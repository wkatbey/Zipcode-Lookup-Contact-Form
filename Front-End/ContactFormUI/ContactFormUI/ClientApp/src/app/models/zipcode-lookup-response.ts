import { NgxXml2jsonService } from 'ngx-xml2json';
import { ZipcodeLookupRequestWrapper } from '../models/zipcode-lookup-request-wrapper';

export class ZipcodeLookupResponse {

  xmlToJson: NgxXml2jsonService = new NgxXml2jsonService();

  constructor(response: ZipcodeLookupRequestWrapper) {
    const parser = new DOMParser();
    const xml = parser.parseFromString(response.requestXml, 'text/xml');

    let jsonResponse: any = this.xmlToJson.xmlToJson(xml);

    this.zipcode = jsonResponse.ZipCodeLookupResponse.Address.Zip5;
  }

  zipcode: number;
}
