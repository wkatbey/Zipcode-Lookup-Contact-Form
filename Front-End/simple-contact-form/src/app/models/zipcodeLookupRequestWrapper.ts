import { ZipCodeLookupRequest } from './zipcodeLookupRequest';

export class ZipcodeLookupRequestWrapper {

    constructor(lookupRequest: ZipCodeLookupRequest) {
        this.requestXml = lookupRequest.request;
    }

    requestXml: string
}