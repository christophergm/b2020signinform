# b2020signin

This project contains source code and supporting files for a serverless application that you can deploy with the SAM CLI. It includes the following files and folders.

- hello-world - Code for the application's Lambda function.
- events - Invocation events that you can use to invoke the function.
- hello-world/tests - Unit tests for the application code. 
- template.yaml - A template that defines the application's AWS resources.

The application uses several AWS resources, including Lambda functions and an API Gateway API. These resources are defined in the `template.yaml` file in this project. You can update the template to add AWS resources through the same deployment process that updates your application code.

If you prefer to use an integrated development environment (IDE) to build and test your application, you can use the AWS Toolkit.  
The AWS Toolkit is an open source plug-in for popular IDEs that uses the SAM CLI to build and deploy serverless applications on AWS. The AWS Toolkit also adds a simplified step-through debugging experience for Lambda function code. See the following links to get started.

* [PyCharm](https://docs.aws.amazon.com/toolkit-for-jetbrains/latest/userguide/welcome.html)
* [IntelliJ](https://docs.aws.amazon.com/toolkit-for-jetbrains/latest/userguide/welcome.html)
* [VS Code](https://docs.aws.amazon.com/toolkit-for-vscode/latest/userguide/welcome.html)
* [Visual Studio](https://docs.aws.amazon.com/toolkit-for-visual-studio/latest/user-guide/welcome.html)

## Project setup

1. Created SAM demo app with VS Code `AWS new SAM app` action
2. Converted to typescript following https://vincedgy.github.io/aws-sam-webpack-typescript/ (https://www.youtube.com/watch?v=FINV-VmCXms)

    ```sh
    npm install webpack webpack-cli typescript ts-loader aws-sam-webpack-plugin @types/aws-lambda @types/node --save-dev
    npm install aws-sdk source-map-support --save
    ```

## Deploy the sample application

The Serverless Application Model Command Line Interface (SAM CLI) is an extension of the AWS CLI that adds functionality for building and testing Lambda applications. It uses Docker to run your functions in an Amazon Linux environment that matches Lambda. It can also emulate your application's build environment and API.

To use the SAM CLI, you need the following tools.

* SAM CLI - [Install the SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
* Node.js - [Install Node.js 10](https://nodejs.org/en/), including the NPM package management tool.
* Docker - [Install Docker community edition](https://hub.docker.com/search/?type=edition&offering=community)

To build and deploy your application for the first time, run the following in your shell:

```bash
sam build
sam deploy --guided
```

The first command will build the source of your application. The second command will package and deploy your application to AWS, with a series of prompts:

* **Stack Name**: The name of the stack to deploy to CloudFormation. This should be unique to your account and region, and a good starting point would be something matching your project name.
* **AWS Region**: The AWS region you want to deploy your app to.
* **Confirm changes before deploy**: If set to yes, any change sets will be shown to you before execution for manual review. If set to no, the AWS SAM CLI will automatically deploy application changes.
* **Allow SAM CLI IAM role creation**: Many AWS SAM templates, including this example, create AWS IAM roles required for the AWS Lambda function(s) included to access AWS services. By default, these are scoped down to minimum required permissions. To deploy an AWS CloudFormation stack which creates or modified IAM roles, the `CAPABILITY_IAM` value for `capabilities` must be provided. If permission isn't provided through this prompt, to deploy this example you must explicitly pass `--capabilities CAPABILITY_IAM` to the `sam deploy` command.
* **Save arguments to samconfig.toml**: If set to yes, your choices will be saved to a configuration file inside the project, so that in the future you can just re-run `sam deploy` without parameters to deploy changes to your application.

You can find your API Gateway Endpoint URL in the output values displayed after deployment.

## Lambda environment

wkhtmltopdf is needed as an executable. Lambda layer ZIP created as described here:
https://gist.github.com/InfeCtlll3/526bc5eee5b13046b2b2d37f40ccffaa

```
docker ps
docker cp <containerid>:/root/wkhtmltopdf.zip .
```


## Use Typescript build and the SAM CLI to build and test locally

#### 0. Build lambda Layer for WkHtmlToPdf dependency

Use `yumbda` to build wkhtmltopdf dependency in a Lambda Layer, as documented here:
https://github.com/lambci/yumda

Look at available dependencies
```
docker run --rm lambci/yumda:2 yum list available
```

Set up dependencies in a local folder using docker
```
mkdir layer
docker run --rm -v "$PWD"/layer:/lambda/opt lambci/yumda:2 yum install -y git wkhtmltopdf.x86_64 libjpeg-turbo.x86_64 libpng.x86_64
```

Create a zipped version (NOT with the `-y` option so that symlinks are collapsed. This allows the layer to work in a local environment as a workaround to this bug https://github.com/awslabs/aws-sam-cli/issues/878)

```
cd layer
$ zip -r ../layer.zip .
```

A problem with removing symlinks is large size. Unzip, remove extra files like `git` folder and dupe `lib` files.  Then re-zip and upload to an AWS Layer.


#### 1. Compile typescript

The typescript and aws-sam-webpack-plugin (replacing SAM CLI) creates a deployment package, and saves it in the `.aws-sam/build` folder.

```bash
NODE_ENV=development npm run-script build
```
or run watch

```bash
NODE_ENV=development npm run-script watch
```

#### 2. Run or Debug

Test a single function by invoking it directly with a test event. An event is a JSON document that represents the input that the function receives from the event source. Test events are included in the `events` folder in this project. Run functions locally and invoke them with the `sam local invoke` command.

```bash
sam local invoke -e events/event.json HelloWorldFunction -d 5858 
```
Then use VS Code debug panel to debug.  Remove `-d 5858` to just run.

#### 3. Launch API

The SAM CLI can also emulate your application's API. Use the `sam local start-api` to run the API locally on port 3000.

```bash
b2020signin$ sam local start-api
b2020signin$ curl http://localhost:3000/
```

The SAM CLI reads the application template to determine the API's routes and the functions that they invoke. The `Events` property on each function's definition includes the route and method for each path.

```yaml
      Events:
        HelloWorld:
          Type: Api
          Properties:
            Path: /hello
            Method: get
```

## Add a resource to your application
The application template uses AWS Serverless Application Model (AWS SAM) to define application resources. AWS SAM is an extension of AWS CloudFormation with a simpler syntax for configuring common serverless application resources such as functions, triggers, and APIs. For resources not included in [the SAM specification](https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md), you can use standard [AWS CloudFormation](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-template-resource-type-ref.html) resource types.

## Fetch, tail, and filter Lambda function logs

To simplify troubleshooting, SAM CLI has a command called `sam logs`. `sam logs` lets you fetch logs generated by your deployed Lambda function from the command line. In addition to printing the logs on the terminal, this command has several nifty features to help you quickly find the bug.

`NOTE`: This command works for all AWS Lambda functions; not just the ones you deploy using SAM.

```bash
b2020signin$ sam logs -n HelloWorldFunction --stack-name b2020signin --tail
```

You can find more information and examples about filtering Lambda function logs in the [SAM CLI Documentation](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-logging.html).

## Debug

Run this command to create event into clipboard which can be inserted into `.aws/templates.json`
```bash
sam local generate-event apigateway aws-proxy | pbcopy
```

These tests will be run from VS Code 'Debug' extension commands.


## Unit tests

Tests are defined in the `hello-world/tests` folder in this project. Use NPM to install the [Mocha test framework](https://mochajs.org/) and run unit tests.

```bash
b2020signin$ cd hello-world
hello-world$ npm install
hello-world$ npm run test
```

## Cleanup

To delete the sample application that you created, use the AWS CLI. Assuming you used your project name for the stack name, you can run the following:

```bash
aws cloudformation delete-stack --stack-name b2020signin
```

## Resources

See the [AWS SAM developer guide](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/what-is-sam.html) for an introduction to SAM specification, the SAM CLI, and serverless application concepts.

Next, you can use AWS Serverless Application Repository to deploy ready to use Apps that go beyond hello world samples and learn how authors developed their applications: [AWS Serverless Application Repository main page](https://aws.amazon.com/serverless/serverlessrepo/)
