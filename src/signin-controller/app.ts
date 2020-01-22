import { processCsvData } from '../form-builder/processCsvData'
import { renderHtmlOutput } from '../form-builder/renderHtmlOutput';
import { createPdfAsync } from '../form-builder/createPdf';
// const axios = require('axios')
// const url = 'http://checkip.amazonaws.com/';
let response;

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html 
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 * 
 */
exports.lambdaHandler = async (
    event:AWSLambda.APIGatewayEvent, 
    context:AWSLambda.APIGatewayEventRequestContext
  ) => {
    try {
        let hostName;
        let eventZipCode;
        let csvData;

        if (event.body !== null && event.body !== undefined) {
            let body = JSON.parse(event.body)
            if (body.hostName)
              hostName = body.hostName;
            if (body.zipCode)
              eventZipCode = body.eventZipCode;
            if (body.csvData)
              csvData = (Buffer.from(body.csvData, 'base64')).toString('ascii');
        }

        let eventData = processCsvData(csvData);
        eventData.HostName = hostName;
        eventData.EventZipCode = eventZipCode;
        let eventHtml = renderHtmlOutput(eventData);
        let pdfDocBase64 = await createPdfAsync(eventHtml);

        response = {
            'statusCode': 200,
            'headers': {
              'Content-type': 'application/txt',
              'content-disposition': 'attachment; filename=test.pdf' 
            },
            'body': pdfDocBase64,
            'isBase64Encoded': true
        }
        
    } catch (err) {
        console.log(err);
        return err;
    }
    console.log(response);    
    return response;
};
