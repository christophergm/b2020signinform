const wkhtmltopdf = require('wkhtmltopdf');
const fs = require("fs");
const PdfCreationTimout = 5000;

export async function createPdfAsync (htmlDoc: string): Promise<string> {
  let wkHtmlToPdfOptions = {
    pageSize: 'letter',
    orientation: 'landscape',
    dpi: 2000  // high DPI required so demical percentages in CSS are followed with precision
  }
  let timedOut = false;
	let p = new Promise<string>((resolve, reject) => {
			let chunks = [];
			let timedOut = false;

			const timeout = setTimeout(() => {
        timedOut = true;
        reject();
			}, PdfCreationTimout);

      const stream = wkhtmltopdf(htmlDoc, wkHtmlToPdfOptions);

      stream.on('error', (e) => {
        reject(e);
      });

      stream.on('data', (chunk) => {
        if (timedOut) return;
        chunks.push(chunk);
      });

      stream.on('end', () => {
        if (timedOut) return;

        clearTimeout(timeout);
        let result = Buffer.concat(chunks);
        resolve(result.toString('base64'));
      });
		});

  let result = await p;
  
  return result;

};