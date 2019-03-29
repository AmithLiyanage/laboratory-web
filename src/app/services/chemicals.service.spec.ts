import { TestBed } from '@angular/core/testing';

import { ChemicalsService } from './chemicals.service';

describe('ChemicalsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ChemicalsService = TestBed.get(ChemicalsService);
    expect(service).toBeTruthy();
  });
});
