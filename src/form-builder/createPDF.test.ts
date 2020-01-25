import { processCsvData } from './processCsvData'
import { renderHtmlOutput } from './renderHtmlOutput';
import { createPdfAsync } from './createPdf';
import fs = require('fs')

test('create simple HTML file', () => {
  let s = 
`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width">
<title>Bernie Sign-in Sheet</title>
<link rel="stylesheet" type="text/css" href="style.css">
</head>
<body class="page">
  <p>Test</p>
</body>
</html>`;

  //createPdf(s);
  expect.anything()
})


test('create PDF from sample CSV', () => {
  let eventRawCsv = fs.readFileSync('./test/participation_export_6.csv');
  let eventData = processCsvData(eventRawCsv);
  eventData.HostName = "Chris Mott";
  eventData.EventZipCode = "98117";
  let eventHtml = renderHtmlOutput(eventData);
  createPdfAsync(eventHtml);
  expect.anything();
})
