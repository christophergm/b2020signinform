import {EventRegistrations, Registrant} from './classes';
import parse = require('csv-parse/lib/sync')
import { readFile } from 'fs';

export function processCsvData(csvData: Buffer, excludeNonAttendees: boolean = true): EventRegistrations {
  const e:EventRegistrations = new EventRegistrations();
  let rawEventData: any [] = parse(csvData, {
    columns: true,
    skip_empty_lines: true
  });

  // Get event data from first row 
  let x = rawEventData[1];
  e.EventDate = x.start.substring(0,10);
  e.EventType = x.event_campaign_slug.replace(/-/g, ' ');

  // Exclude non-attendees based on fields
  //  Attended, Status
  //      , REGISTERED  - registered
  //  TRUE, REGISTERED  - completed
  //  FALSE, REGISTERED - no show
  //  TRUE, CANCELLED   - ?
  //       , CANCELLED  - cancelled
  //        , CONFIRMED - confirmed
  rawEventData = rawEventData.filter(x => (x['status'] === 'REGISTERED' && x['attended'] !== 'FALSE') || 
                                           x['status'] == 'CONFIRMED')
  // Fill in each participant
  rawEventData.forEach(x => {
    let r:Registrant = new Registrant();
    r.FirstName = x['first name'];
    r.LastName = x['last name'];
    r.Email = x['email'];
    r.Phone = x['phone'];
    r.ZipCode = x['zip'];
    e.Registrants.push(r);
  });
  return (e);
}

