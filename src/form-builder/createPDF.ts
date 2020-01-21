const wkhtmltopdf = require('wkhtmltopdf');
const fs = require("fs");

export function createPdf (htmlDoc: string) {
  wkhtmltopdf(htmlDoc, {
    output: 'demo.pdf',
    pageSize: 'letter',
    orientation: 'landscape',
    dpi: 2000  // high DPI required so demical percentages in CSS are followed with precision
  });
}