import { TestBed } from '@angular/core/testing';

import { FormStepperService } from './form-stepper.service';

describe('FormStepperService', () => {
  let service: FormStepperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormStepperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
