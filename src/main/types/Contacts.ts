export interface Contact {
  description: string,
  number: string,
  sort_order: number,
  explanation: string,
  in_leaflet: boolean,
  explanation_cy: string,
  description_cy: string
}

export interface ContactType {
  id: number,
  name: string,
  name_cy: string
}
