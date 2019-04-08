import { TestBed } from '@angular/core/testing';

import { LendingServiceService } from './lending-service.service';

describe('LendingServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LendingServiceService = TestBed.get(LendingServiceService);
    expect(service).toBeTruthy();
  });
});
