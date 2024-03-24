import { TestBed } from '@angular/core/testing';

import { HandycapService } from './handycap.service';

describe('HandycapService', () => {
  let service: HandycapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HandycapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
