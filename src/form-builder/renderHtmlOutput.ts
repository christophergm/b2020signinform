import fs = require('fs')
import path = require("path");
import Mustache = require("mustache");
import {EventRegistrations, EventRegistrationPage, EventRegistrationDocument} from './classes';

const REGISTRANTS_PER_PAGE = 4;

export function renderHtmlOutput (evt: EventRegistrations): string {

  let numRegistrants = evt.Registrants.length;
  let numPages = Math.ceil(numRegistrants / REGISTRANTS_PER_PAGE);
  let doc = new EventRegistrationDocument();

  for (let index = 0; index < numPages; index++) {
    let p = new EventRegistrationPage(evt, index * REGISTRANTS_PER_PAGE + 1, index * REGISTRANTS_PER_PAGE + 4)
    doc.Pages.push(p)
  }

  let pageTemplate = loadTemplateFile('page.mustache');
  let pages = Mustache.render(pageTemplate.toString(), doc);

  let bodyTemplate = loadTemplateFile('body.mustache');
  let body = Mustache.render(bodyTemplate.toString(), [], {Pages: pages})

  return body;
}

function loadTemplateFile(templateName) {
  const fileName = `./templates/${templateName}`
  let resolved
  if (process.env.LAMBDA_TASK_ROOT) {
    resolved = path.resolve(process.env.LAMBDA_TASK_ROOT, fileName)
  } else {
    resolved = path.resolve(__dirname, fileName)
  }
  console.log(`Loading template at: ${resolved}`)
  try {
    const data = fs.readFileSync(resolved, 'utf8')
    return data
  } catch (error) {
    const message = `Could not load template at: ${resolved}, error: ${JSON.stringify(error, null, 2)}`
    console.error(message)
    throw new Error(message)
  }
}