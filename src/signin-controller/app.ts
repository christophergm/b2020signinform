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
        let s = "YWZmaWxpYXRlZCBvcmdhbml6YXRpb24gaWQsYWZmaWxpYXRlZCBvcmdhbml6YXRpb24gbmFtZSxhZmZpbGlhdGVkIG9yZ2FuaXphdGlvbiB1cmwsYXR0ZW5kZWQsZW1haWwsZW5kLGV2ZW50IGlkLGV2ZW50IG5hbWUsZXZlbnQgb3JnYW5pemF0aW9uIGlkLGV2ZW50IG9yZ2FuaXphdGlvbiBuYW1lLGV2ZW50IG9yZ2FuaXphdGlvbiB1cmwsZXZlbnQgdHlwZSxldmVudF9jYW1wYWlnbl9pZCxldmVudF9jYW1wYWlnbl9zbHVnLGZlZWRiYWNrLGZpcnN0IG5hbWUsbGFzdCBuYW1lLHBob25lLHJhdGluZyxyZWZlcnJlcixzaWdudXAgY3JlYXRlZCB0aW1lLHNpZ251cCB1cGRhdGVkIHRpbWUsc3RhcnQsc3RhdHVzLHV0bV9jYW1wYWlnbix1dG1fY29udGVudCx1dG1fbWVkaXVtLHV0bV9zb3VyY2UsdXRtX3Rlcm0semlwCjE3NjcsQmVybmllIDIwMjAsaHR0cHM6Ly9ldmVudHMuYmVybmllc2FuZGVycy5jb21kLyxUUlVFLHh4eHh4eHh4eHh4eHh4QG1tbW1tbS5tbW1tbW1tbS5tbW0sMjAxOS0xMS0yNCAxNjowMDowMC0wODowMCwxNTk4MjUsIk15IEJlcm5pZSBTdG9yeSBXb3Jrc2hvcCBpbiBTZWF0dGxlLCBXQSIsMTc2NyxCZXJuaWUgMjAyMCxodHRwczovL2V2ZW50cy5iZXJuaWVzYW5kZXJzLmNvbS8sSE9VU0VfUEFSVFksMjAzNSxob3N0LWEtbXktYmVybmllLXN0b3J5LXdvcmtzaG9wLGNoYW5nZSBkb2VzIG5vdCBoYXBwZW4gZnJvbSB0aGUgdG9wIGRvd24uLGZmZmZmZmZmZmZmZmZmLGxsbGxsbGxsbGxsbGxsbCxwcHBwcHBwcHBwLFBvc2l0aXZlLGh0dHBzOi8vbWFwLmJlcm5pZXNhbmRlcnMuY29tLywyMDE5LTExLTI0IDEzOjMxOjA3LjU2NDQ1MC0wODowMCwyMDE5LTExLTI1IDEwOjExOjMxLjE2NzgyOS0wODowMCwyMDE5LTExLTI0IDE0OjAwOjAwLTA4OjAwLFJFR0lTVEVSRUQsLCwsLCx6enp6egoxNzY3LEJlcm5pZSAyMDIwLGh0dHBzOi8vZXZlbnRzLmJlcm5pZXNhbmRlcnMuY29tLyxUUlVFLGpvbi5jb21wbGV0ZWRAZ21haWwuY29tLDIwMTktMTEtMjQgMTY6MDA6MDAtMDg6MDAsMTU5ODI1LCJNeSBCZXJuaWUgU3RvcnkgV29ya3Nob3AgaW4gU2VhdHRsZSwgV0EiLDE3NjcsQmVybmllIDIwMjAsaHR0cHM6Ly9ldmVudHMuYmVybmllc2FuZGVycy5jb20vLEhPVVNFX1BBUlRZLDIwMzUsaG9zdC1hLW15LWJlcm5pZS1zdG9yeS13b3Jrc2hvcCwsam9obixjb21wbGV0ZWQsMTExMTExMTExMSwsaHR0cHM6Ly9tYXAuYmVybmllc2FuZGVycy5jb20vLDIwMTktMTEtMjQgMDk6NDQ6MzkuODAwMDYxLTA4OjAwLDIwMTktMTEtMjQgMTc6MDE6NDUuMjEzMTg5LTA4OjAwLDIwMTktMTEtMjQgMTQ6MDA6MDAtMDg6MDAsUkVHSVNURVJFRCwsLCwsLDk4MTA3CjE3NjcsQmVybmllIDIwMjAsaHR0cHM6Ly9ldmVudHMuYmVybmllc2FuZGVycy5jb20vLFRSVUUsamFuZS5jb21wbGV0ZWRAZ21haWwuY29tLDIwMTktMTEtMjQgMTY6MDA6MDAtMDg6MDAsMTU5ODI1LCJNeSBCZXJuaWUgU3RvcnkgV29ya3Nob3AgaW4gU2VhdHRsZSwgV0EiLDE3NjcsQmVybmllIDIwMjAsaHR0cHM6Ly9ldmVudHMuYmVybmllc2FuZGVycy5jb20vLEhPVVNFX1BBUlRZLDIwMzUsaG9zdC1hLW15LWJlcm5pZS1zdG9yeS13b3Jrc2hvcCxpJ20gZ2V0dGluZyBhY3RpdmUgYmVjYXVzZSB3ZSBuZWVkIGEgbWFzcyBtb3ZlbWVudCxKYW5lLENvbXBsZXRlZCw0NDM3OTQ1MzE0LFBvc2l0aXZlLGh0dHBzOi8vbWFwLmJlcm5pZXNhbmRlcnMuY29tLywyMDE5LTExLTIzIDE4OjIwOjQ5LjIyMDI1My0wODowMCwyMDE5LTExLTI0IDE3OjI2OjAxLjYxOTI3My0wODowMCwyMDE5LTExLTI0IDE0OjAwOjAwLTA4OjAwLFJFR0lTVEVSRUQsLCwsLCw5ODAwNAoxNzY3LEJlcm5pZSAyMDIwLGh0dHBzOi8vZXZlbnRzLmJlcm5pZXNhbmRlcnMuY29tLywsYm9iX2NhbmNlbGxlZEBob3RtYWlsLmNvbSwyMDE5LTExLTI0IDE2OjAwOjAwLTA4OjAwLDE1OTgyNSwiTXkgQmVybmllIFN0b3J5IFdvcmtzaG9wIGluIFNlYXR0bGUsIFdBIiwxNzY3LEJlcm5pZSAyMDIwLGh0dHBzOi8vZXZlbnRzLmJlcm5pZXNhbmRlcnMuY29tLyxIT1VTRV9QQVJUWSwyMDM1LGhvc3QtYS1teS1iZXJuaWUtc3Rvcnktd29ya3Nob3AsLEJvYixDYW5jZWxsZWQsMzMzMzMzMzMzMywsaHR0cHM6Ly9tYXAuYmVybmllc2FuZGVycy5jb20vLDIwMTktMTEtMjEgMjA6MTc6MTUuNjk3NDgxLTA4OjAwLDIwMTktMTEtMjQgMDM6MjM6MDIuNDQ3ODExLTA4OjAwLDIwMTktMTEtMjQgMTQ6MDA6MDAtMDg6MDAsQ0FOQ0VMTEVELCwsLCwsOTgxMjIKMTc2NyxCZXJuaWUgMjAyMCxodHRwczovL2V2ZW50cy5iZXJuaWVzYW5kZXJzLmNvbS8sRkFMU0UsYmFyYmFyYS1uby1zaG93QHlhaG9vLmNvbSwyMDE5LTExLTI0IDE2OjAwOjAwLTA4OjAwLDE1OTgyNSwiTXkgQmVybmllIFN0b3J5IFdvcmtzaG9wIGluIFNlYXR0bGUsIFdBIiwxNzY3LEJlcm5pZSAyMDIwLGh0dHBzOi8vZXZlbnRzLmJlcm5pZXNhbmRlcnMuY29tLyxIT1VTRV9QQVJUWSwyMDM1LGhvc3QtYS1teS1iZXJuaWUtc3Rvcnktd29ya3Nob3AsLEJhcmJhcmEsTm8gU2hvdyw0NDQ0NDQ0NDQ0LCwsMjAxOS0xMS0yMCAyMDozNzo1MS43NTA0ODMtMDg6MDAsMjAxOS0xMS0yNSAwNjo1Mzo0NS41MTExODctMDg6MDAsMjAxOS0xMS0yNCAxNDowMDowMC0wODowMCxSRUdJU1RFUkVELCwsLCwsOTgyMDYKMTc2NyxCZXJuaWUgMjAyMCxodHRwczovL2V2ZW50cy5iZXJuaWVzYW5kZXJzLmNvbS8sLGNhcmwucmVnaXN0ZXJlZEBtc24uY29tLDIwMTktMTEtMjQgMTY6MDA6MDAtMDg6MDAsMTU5ODI1LCJNeSBCZXJuaWUgU3RvcnkgV29ya3Nob3AgaW4gU2VhdHRsZSwgV0EiLDE3NjcsQmVybmllIDIwMjAsaHR0cHM6Ly9ldmVudHMuYmVybmllc2FuZGVycy5jb20vLEhPVVNFX1BBUlRZLDIwMzUsaG9zdC1hLW15LWJlcm5pZS1zdG9yeS13b3Jrc2hvcCwsQ2FybCxSZWdpc3RlcmVkLCwsLDIwMTktMTEtMTggMTQ6MjY6MjMuMTM4NzYzLTA4OjAwLDIwMTktMTEtMjQgMTc6MjE6MDcuMDQyOTAyLTA4OjAwLDIwMTktMTEtMjQgMTQ6MDA6MDAtMDg6MDAsUkVHSVNURVJFRCxlbTE5MTExNy1NQlNXLWF0dGVuZGVlLCxlbWFpbCwsLDk4MTAzCjE3NjcsQmVybmllIDIwMjAsaHR0cHM6Ly9ldmVudHMuYmVybmllc2FuZGVycy5jb20vLCxicmVudC1yZWdpc3RlcmVkQG1hYy5jb20sMjAxOS0xMS0yNCAxNjowMDowMC0wODowMCwxNTk4MjUsIk15IEJlcm5pZSBTdG9yeSBXb3Jrc2hvcCBpbiBTZWF0dGxlLCBXQSIsMTc2NyxCZXJuaWUgMjAyMCxodHRwczovL2V2ZW50cy5iZXJuaWVzYW5kZXJzLmNvbS8sSE9VU0VfUEFSVFksMjAzNSxob3N0LWEtbXktYmVybmllLXN0b3J5LXdvcmtzaG9wLCxCcmVudCxSZWdpc3RlcmVkLDY2NjY2NjY2NjYsUG9zaXRpdmUsLDIwMTktMTEtMTcgMjE6MzQ6MTYuNTg0NDc4LTA4OjAwLDIwMTktMTEtMjQgMTc6MDU6MDIuODI3OTU3LTA4OjAwLDIwMTktMTEtMjQgMTQ6MDA6MDAtMDg6MDAsUkVHSVNURVJFRCwsLCwsLDk4MTMzCjE3NjcsQmVybmllIDIwMjAsaHR0cHM6Ly9ldmVudHMuYmVybmllc2FuZGVycy5jb20vLCxtaXJpYW0ucmVnaXN0ZXJlZEBsaXZlLmNvbSwyMDE5LTExLTI0IDE2OjAwOjAwLTA4OjAwLDE1OTgyNSwiTXkgQmVybmllIFN0b3J5IFdvcmtzaG9wIGluIFNlYXR0bGUsIFdBIiwxNzY3LEJlcm5pZSAyMDIwLGh0dHBzOi8vZXZlbnRzLmJlcm5pZXNhbmRlcnMuY29tLyxIT1VTRV9QQVJUWSwyMDM1LGhvc3QtYS1teS1iZXJuaWUtc3Rvcnktd29ya3Nob3AsLE1pcmlhbSxSZWdpc3RlcmVkLDc3Nzc3Nzc3NzcsLCwyMDE5LTExLTE3IDE4OjIwOjUxLjQxNTczNC0wODowMCwyMDE5LTExLTI0IDE3OjIxOjA5LjQwMzIyMS0wODowMCwyMDE5LTExLTI0IDE0OjAwOjAwLTA4OjAwLFJFR0lTVEVSRUQsZW0xOTExMTctTUJTVy1hdHRlbmRlZSwsZW1haWwsLCw5ODExNwoxNzY3LEJlcm5pZSAyMDIwLGh0dHBzOi8vZXZlbnRzLmJlcm5pZXNhbmRlcnMuY29tLywsYmVsbC5yZWdpc3RlcmVkQG1hYy5jb20sMjAxOS0xMS0yNCAxNjowMDowMC0wODowMCwxNTk4MjUsIk15IEJlcm5pZSBTdG9yeSBXb3Jrc2hvcCBpbiBTZWF0dGxlLCBXQSIsMTc2NyxCZXJuaWUgMjAyMCxodHRwczovL2V2ZW50cy5iZXJuaWVzYW5kZXJzLmNvbS8sSE9VU0VfUEFSVFksMjAzNSxob3N0LWEtbXktYmVybmllLXN0b3J5LXdvcmtzaG9wLCJtYWtlIGNoYW5nZSBoYXBwZW4iLEJlbGwsUmVnaXN0ZXJlZCw4ODg4ODg4ODg4LFBvc2l0aXZlLCwyMDE5LTExLTE3IDE2OjMzOjAzLjI3Njk2My0wODowMCwyMDE5LTExLTI1IDE4OjM4OjIyLjE3MjQ1OS0wODowMCwyMDE5LTExLTI0IDE0OjAwOjAwLTA4OjAwLENPTkZJUk1FRCxlbTE5MTExNy1NQlNXLWF0dGVuZGVlLCxlbWFpbCwsLDk4MTMz";
        csvData = (Buffer.from(s, 'base64')).toString('ascii')

        let eventData = processCsvData(csvData);
        eventData.HostName = hostName;
        eventData.EventZipCode = eventZipCode;
        let eventHtml = renderHtmlOutput(eventData);
        //eventHtml = "<!doctype html><html lang=\"en\"><head><meta charset=\"utf-8\"></head><body><h1>Heading</h1><p>Body text!</p></body></html>";
        let pdfDocBase64 = await createPdfAsync(eventHtml);

        response = {
            'statusCode': 200,
            'headers': {
              'Content-type': 'application/pdf',
              'content-disposition': 'attachment; filename=test.pdf' 
            },
            'body':  (Buffer.from(pdfDocBase64, 'base64')).toString('ascii'),
            'isBase64Encoded': true
        }
        
    } catch (err) {
        return err;
    }
    return response;
};
