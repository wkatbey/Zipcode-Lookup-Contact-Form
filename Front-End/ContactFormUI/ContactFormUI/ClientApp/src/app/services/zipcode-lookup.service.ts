import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Address } from '../models/address';
import { ZipCodeLookupRequest } from '../models/zipcode-lookup-request';
import { ZipcodeLookupRequestWrapper } from '../models/zipcode-lookup-request-wrapper';

@Injectable({
  providedIn: 'root'
})
export class ZipcodeLookupService {

  constructor(private http: HttpClient) { }

  zipcodeLookupUrl: string = "https://localhost:5001/api/zipcode-lookup";

  getZipcodeByAddress(address: Address): Observable<ZipcodeLookupRequestWrapper> {
    let zipcodeLookupRequest = new ZipCodeLookupRequest(address);
    let wrapper = new ZipcodeLookupRequestWrapper(zipcodeLookupRequest);

    return this.http.post<ZipcodeLookupRequestWrapper>(this.zipcodeLookupUrl, wrapper);
  }
}
