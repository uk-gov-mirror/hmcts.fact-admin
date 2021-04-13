import { Logger } from '../../types/Logger';
import {AxiosError, AxiosInstance} from 'axios';
import {Contact, ContactType} from '../../types/Contacts';

export class FactApi {

  private readonly baseURL = '/courts';

  constructor(
    private readonly axios: AxiosInstance,
    private readonly logger: Logger
  ) { }

  public getCourts(): Promise<unknown[]> {
    return this.axios
      .get(`${this.baseURL}/all`)
      .then(results => results.data)
      .catch(this.errorHandler([]));
  }

  public getDownloadCourts(): Promise<unknown[]> {
    return this.axios
      .get(`${this.baseURL}/`)
      .then(results => results.data)
      .catch(this.errorHandler([]));
  }

  public getCourt(slug: string): Promise<unknown[]> {
    return this.axios
      .get(`${this.baseURL}/court/${slug}`)
      .then(results => results.data)
      .catch(this.errorHandler([]));
  }

  public getCourtGeneral(slug: string): Promise<{}> {
    return this.axios
      .get(`${this.baseURL}/${slug}/general`)
      .then(results => results.data)
      .catch(this.errorHandler({}));
  }

  public getContactTypes(): Promise<ContactType[]> {
    // return this.axios
    //   .get(`${this.baseURL}/contacttypes`)
    //   .then(results => results.data)
    //   .catch(this.errorHandler({}));

    // TODO Replace with actual call (above) once new API endpoints complete
    const mockApiResponse: ContactType[] = [
      { id: 111, name: 'Appointments', 'name_cy': 'apwyntiadau' },
      { id: 54, name: 'Bankruptcy', 'name_cy': 'methdaliad' },
      { id: 89, name: 'Care cases', 'name_cy': 'Achosion gofal' },
      { id: 15, name: 'Chancery', 'name_cy': 'Siawnsri' },
      { id: 25, name: 'County Court', 'name_cy': 'Llys Sirol' },
      { id: 9, name: 'Crown Court', 'name_cy': 'Llys y Goron' },
      { id: 51, name: 'Divorce', 'name_cy': 'Ysgariad' }
    ];
    return Promise.resolve(mockApiResponse);
  }

  public getContacts(slug: string): Promise<Contact[]> {
    // return this.axios
    //   .get(`${this.baseURL}/${slug}/contacts`)
    //   .then(results => results.data)
    //   .catch(this.errorHandler({}));

    // TODO Replace with actual call (above) once new API endpoints complete
    const mockApiResponse: Contact[] = [
      {
        description: 'Appointments',
        number: '0111 222 3030',
        sort_order: 0,
        explanation: 'Appointments Explanation in english',
        in_leaflet: false,
        explanation_cy: 'Appointments Explanation in welsh',
        description_cy: 'apwyntiadau'
      },
      {
        description: 'Divorce',
        number: '0444 555 6060',
        sort_order: 1,
        explanation: 'Divorce Explanation in english',
        in_leaflet: false,
        explanation_cy: 'Divorce Explanation in welsh',
        description_cy: 'Ysgariad'
      },
      {
        description: 'SomethingCustom',
        number: '0101 2020 3919',
        sort_order: 2,
        explanation: 'Custom explanation in english',
        in_leaflet: false,
        explanation_cy: 'Custom Explanation in welsh',
        description_cy: 'SomethingCustomInWelsh'
      }
    ];
    return Promise.resolve(mockApiResponse);
  }

  public updateContacts(slug: string, contacts: Contact[]) {
    // TODO: PUT request to new API endpoint
    console.log('PUT /courts/' + slug + '/contacts - BODY: ' + contacts);
  }


  public updateCourtGeneral(slug: string, body: {}): Promise<{}> {
    return this.axios
      .put(`${this.baseURL}/${slug}/general`, body)
      .then(results => results.data)
      .catch(this.errorHandler({}));
  }

  public async updateCourtsInfo(body: UpdateCourtsInfoRequest): Promise<void> {
    return this.axios.put(`${this.baseURL}/info`, body);
  }

  private errorHandler<T>(defaultValue: T) {
    return (err: AxiosError) => {
      this.logger.error(err.message);

      if (err.response) {
        this.logger.info(err.response.data);
        this.logger.info(err.response.headers);
      }

      return defaultValue;
    };
  }
}

interface UpdateCourtsInfoRequest {
  'info': string,
  'info_cy': string,
  'courts': string[]
}
