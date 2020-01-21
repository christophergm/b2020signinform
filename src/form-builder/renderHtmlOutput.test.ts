import { EventRegistrations, Registrant, EventRegistrationPage } from "./classes";
import { renderHtmlOutput } from "./renderHtmlOutput";
import { AssertionError } from "assert";

test('creates event registration HTML', () => {
  let eventReg = new EventRegistrations();
  eventReg.EventDate = "2019-10-10";
  let reg = new Registrant();
  reg.FirstName = "Christopher";
  reg.LastName = "Mott";
  reg.Email = "christopher_mott@email.com";
  reg.ZipCode = "55555";
  eventReg.Registrants.push(reg);
  
  let pageText = renderHtmlOutput(eventReg);
  expect.anything();
})

