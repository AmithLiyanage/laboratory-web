import { TestBed } from '@angular/core/testing';

import { ItemRemovalService } from './item-removal.service';

describe('ItemRemovalService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ItemRemovalService = TestBed.get(ItemRemovalService);
    expect(service).toBeTruthy();
  });
});
