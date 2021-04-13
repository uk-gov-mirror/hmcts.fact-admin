import {Contact} from "./Contacts";

export interface CourtPageData {
  isSuperAdmin: boolean,
  court: {},
  updated: boolean,
  phoneNumbers: { contact: Contact, types: { value: string; text: string; selected: boolean }[] }[],
  standardContactTypes: { value: string; text: string; selected: boolean }[];
}
