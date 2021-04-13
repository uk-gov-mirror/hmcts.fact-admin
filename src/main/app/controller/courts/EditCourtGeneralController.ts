import {Response} from 'express';
import autobind from 'autobind-decorator';
import {AuthedRequest} from '../../../types/AuthedRequest';
import {CourtPageData} from '../../../types/CourtPageData';
import {isObjectEmpty} from '../../../utils/validation';
import {Contact, ContactType} from '../../../types/Contacts';

@autobind
export class EditCourtGeneralController {
  public async get(req: AuthedRequest, res: Response): Promise<void> {
    const updated = req.query.updated === 'true';
    const pageData: CourtPageData = {
      isSuperAdmin: req.session.user.isSuperAdmin,
      court: {},
      updated: updated,
      phoneNumbers: [],
      standardContactTypes: []
    };

    const slug: string = req.params.slug as string;
    pageData.court = await req.scope.cradle.api.getCourtGeneral(slug);

    const contactTypes = await req.scope.cradle.api.getContactTypes();
    const contacts = await req.scope.cradle.api.getContacts(slug);
    pageData.phoneNumbers = this.getPhoneNumberPageData(contacts, contactTypes);
    pageData.standardContactTypes = this.getDisplayContactTypes(contactTypes);

    res.render('courts/edit-court-general', pageData);
  }

  public async post(req: AuthedRequest, res: Response): Promise<void> {
    const court = req.body;
    EditCourtGeneralController.convertOpenAndAccessSchemeToBoolean(court);
    EditCourtGeneralController.removeDeletedOpeningTimes(court);
    EditCourtGeneralController.convertOpeningTimes(court);
    EditCourtGeneralController.convertContacts(court);
    const slug: string = req.params.slug as string;
    const updatedCourts = await req.scope.cradle.api.updateCourtGeneral(slug, court);
    if (isObjectEmpty(updatedCourts)) {
      return res.redirect(`/courts/${slug}/edit/general?updated=false`);
    }
    return res.redirect(`/courts/${slug}/edit/general?updated=true`);
  }

  private static convertOpenAndAccessSchemeToBoolean(court: any): void {
    court.open = court.open === 'true';
    court['access_scheme'] = court['access_scheme'] === 'true';
  }

  private static removeDeletedOpeningTimes(court: any): void {
    if(court.deleteOpeningHours){
      court['description'].splice(court.deleteOpeningHours - 1 , 1);
      court['hours'].splice(court.deleteOpeningHours, 1);
    }
  }

  private static convertOpeningTimes(court: any): void {
    if (court['description']){
      const descriptions = Array.isArray(court['description']) ? court['description'] : [court['description']];
      const hours = Array.isArray(court['hours']) ? court['hours'] : [court['hours']];
      court['opening_times'] = descriptions
        .map((k: any, i: number) => ({ description: k, hours: hours[i]}))
        .filter((o: { description: string; hours: string }) => o.description !== '' && o.hours !== '');
    }
  }

  private static deleteContacts(court: any): void {
    if(court.deleteContact){
      court['contactDescription'].splice(court.deleteContact - 1 , 1);
      court['contactNumber'].splice(court.deleteContact - 1, 1);
      court['contactExplanation'].splice(court.deleteContact - 1, 1);
      court['contactExplanation_cy'].splice(court.deleteContact - 1, 1);
    }
  }

  // TODO Remove or tidy up the English | Welsh concatenation once query response received.
  private static convertContacts(court: any): void {
    this.deleteContacts(court);
    if (court.contactDescription) {
      const descriptions = Array.isArray(court.contactDescription) ? court.contactDescription : [court.contactDescription];
      const numbers = Array.isArray(court.contactNumber) ? court.contactNumber : [court.contactNumber];
      const explanations = Array.isArray(court.contactExplanation) ? court.contactExplanation : [court.contactExplanation];
      const explanationCys = Array.isArray(court.contactExplanation_cy) ? court.contactExplanation_cy : [court.contactExplanation_cy];
      court['contacts'] = descriptions
        // eslint-disable-next-line @typescript-eslint/camelcase
        .map((val: any, idx: number) => ({ number: numbers[idx], description: (val as string).split('|')[0], description_cy: (val as string).split('|')[1], explanation: explanations[idx], explanation_cy: explanationCys[idx], sortOrder: idx}))
        .filter((c: { number: string; description: string; description_cy: string; explanation: string; explanation_cy: string; sortOrder: number }) => c.description != '' && c.number != '');
    }
  }

  private getPhoneNumberPageData(contacts: Contact[], standardContactTypes: ContactType[]) {
    return contacts.map((contact: Contact) =>
      ({
        contact: contact,
        types: this.getDisplayContactTypes(standardContactTypes,
          { english: contact.description, welsh: contact.description_cy })
      })
    );
  }

  private getDisplayContactTypes(contactTypes: ContactType[], selector?: { english: string; welsh: string }) {
    const displayContactTypes = contactTypes.map(
      (ct: ContactType) =>
        ({value: ct.name + '|' + ct.name_cy, text: ct.name, selected: selector && ct.name === selector.english}));

    // Add custom contact type if applicable; some contacts in the DB have non-standard contact types.
    if (displayContactTypes.some(v => v.selected) === false) {
      const val = selector ? selector.english + '|' + selector.welsh : '';
      const text = selector ? selector.english : '';
      displayContactTypes.splice(0, 0, { value: val, text: text, selected: true });
    }

    return displayContactTypes;
  }
}
