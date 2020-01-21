import { EventRegistrations, RegistrantPageSection, Registrant, EventRegistrationPage } from "./classes";

test('creates event registration page', () => {
  let eventReg = new EventRegistrations();
  eventReg.EventDate = "2019-10-10";
  let reg = new Registrant();
  reg.FirstName = "Christopher";
  reg.LastName = "Mott";
  reg.Email = "christopher_mott@email.com";
  reg.ZipCode = "55555";
  eventReg.Registrants.push(reg);

  let eventRegPage = new EventRegistrationPage(eventReg, 1, 1);
  expect(eventRegPage.EventDate).toBe('2019-10-10')
  expect(eventRegPage.RegistrantPageSections.length).toBe(1);
  expect(eventRegPage.RegistrantPageSections[0].FirstName.length).toBe(11);
  expect(eventRegPage.RegistrantPageSections[0].LastName.length).toBe(4);
  expect(eventRegPage.RegistrantPageSections[0].Email.length).toBe(26);
  expect(eventRegPage.RegistrantPageSections[0].ZipCode.length).toBe(5);
})

test('creates event registration page and truncates long strings', () => {
  let eventReg = new EventRegistrations();
  eventReg.EventDate = "2019-10-10";
  let reg = new Registrant();
  reg.FirstName = "ChristopherChristopherChristopher";
  reg.LastName = "MottMottMottMottMottMottMottMottMottMottMottMott";
  reg.Email = "christopher_mott@email.comchristopher_mott@email.comchristopher_mott@email.com";
  reg.ZipCode = "555555555555555";
  eventReg.Registrants.push(reg);

  let eventRegPage = new EventRegistrationPage(eventReg, 1, 1);
  expect(eventRegPage.EventDate).toBe('2019-10-10')
  expect(eventRegPage.RegistrantPageSections.length).toBe(1);
  expect(eventRegPage.RegistrantPageSections[0].FirstName.length).toBe(14);
  expect(eventRegPage.RegistrantPageSections[0].LastName.length).toBe(15);
  expect(eventRegPage.RegistrantPageSections[0].Email.length).toBe(34);
  expect(eventRegPage.RegistrantPageSections[0].ZipCode.length).toBe(5);
})
