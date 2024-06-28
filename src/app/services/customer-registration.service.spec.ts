import { TestBed } from '@angular/core/testing';

import { CustomerRegistrationService } from './customer-registration.service';

describe('CustomerRegistrationService', () => {
  let service: CustomerRegistrationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerRegistrationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
