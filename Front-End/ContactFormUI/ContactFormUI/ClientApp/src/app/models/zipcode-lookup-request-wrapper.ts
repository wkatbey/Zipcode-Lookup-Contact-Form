import { ZipCodeLookupRequest } from './zipcode-lookup-request';

export class ZipcodeLookupRequestWrapper {

  constructor(lookupRequest: ZipCodeLookupRequest) {
    this.requestXml = lookupRequest.request;
  }

  requestXml: string
}
