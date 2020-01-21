import fs = require('fs')
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

  let pageTemplate = fs.readFileSync('./src/templates/page.mustache');
  let pages = Mustache.render(pageTemplate.toString(), doc);

  let bodyTemplate = fs.readFileSync('./src/templates/body.mustache');
  let body = Mustache.render(bodyTemplate.toString(), [], {Pages: pages})

  return body;
}