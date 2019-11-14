import { TestBed } from '@angular/core/testing';

import { ZipcodeLookupService } from './zipcode-lookup.service';

describe('ZipcodeLookupService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ZipcodeLookupService = TestBed.get(ZipcodeLookupService);
    expect(service).toBeTruthy();
  });
});
