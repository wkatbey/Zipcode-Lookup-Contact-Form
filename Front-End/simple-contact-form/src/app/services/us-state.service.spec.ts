import { TestBed } from '@angular/core/testing';

import { UsStateService } from './us-state.service';

describe('UsStateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UsStateService = TestBed.get(UsStateService);
    expect(service).toBeTruthy();
  });
});
