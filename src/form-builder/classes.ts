
export class EventRegistrations {
  HostName:string = '';
  EventType:string = '';
  EventZipCode:string = '';
  EventDate:string = '';
  Registrants:Registrant[] = [];
}

export class Registrant {
  FirstName:string  = '';
  LastName:string = '';
  Email:string = '';
  Phone:string = '';
  ZipCode = '';
}

export class EventRegistrationDocument {
  Pages: EventRegistrationPage[] = [];
}

export class EventRegistrationPage {
  HostName:string = '';
  EventType:string = '';
  EventZipCode:string = '';
  EventDate:string = '';
  RegistrantPageSections:RegistrantPageSection[] = [];

  // From: first index (starting from 1)
  // To: last index 
  constructor(event: EventRegistrations, from: number, to: number) {
    this.HostName = event.HostName;
    this.EventDate = event.EventDate;
    this.EventType = event.EventType;
    this.EventZipCode = event.EventZipCode;

    for (let index = from - 1; index < Math.min(to, event.Registrants.length); index++) {
      const r = event.Registrants[index];
      let newR = new RegistrantPageSection(r);
      this.RegistrantPageSections.push(newR);
    }
  }
}

export class RegistrantPageSection {
  FirstName:string[] = [];
  LastName:string[] = [];
  Email:string[] = [];
  Phone:string[] = [];
  ZipCode:string[] = [];

  private readonly MAXCHARS_FIRSTNAME:number = 14;
  private readonly MAXCHARS_LASTNAME:number = 15;
  private readonly MAXCHARS_EMAIL:number = 34;
  private readonly MAXCHARS_PHONE:number = 10;
  private readonly MAXCHARS_ZIPCODE:number = 5;

  constructor(r: Registrant) {
    this.FirstName = this.createCharacterArray(r.FirstName, this.MAXCHARS_FIRSTNAME);
    this.LastName = this.createCharacterArray(r.LastName, this.MAXCHARS_LASTNAME);
    this.Email = this.createCharacterArray(r.Email, this.MAXCHARS_EMAIL);
    this.ZipCode = this.createCharacterArray(r.ZipCode, this.MAXCHARS_ZIPCODE);
    let p = this.createCharacterArray(r.Phone, this.MAXCHARS_PHONE);
    for (let index = 0; index < p.length; index++) {
      const digit = p[index];
      this.Phone.push(digit);
      if (index == 2 || index == 5) {
        this.Phone.push(' ')  // form has '-' separator 
      }      
    }
  }

  private createCharacterArray (s: string, maxCharacters: number): string[] {
    let a:string[] = [];
    if (s === null) {
      return a;
    }
    for (let index = 0; index < Math.min(s.length, maxCharacters); index++) {
      a.push(s[index])
    }
    return a;
  }

}
