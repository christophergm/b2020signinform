import { processCsvData } from './processCsvData';
import fs = require('fs')

test('parses event 1', () => {
  let event1 = fs.readFileSync('./test/participation_export_1.csv');
  let d1 = processCsvData(event1);
  expect(d1.Registrants.length).toBe(7);
  expect(d1.EventDate).toBe('2019-11-24')
})

