import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { StepperFormItem } from '../interfaces/stepper-form';

@Injectable({
  providedIn: 'root'
})
export class FormStepperService {

  http = inject(HttpClient);

  getFormStepperItems(): Observable<StepperFormItem[]> {
    return this.http.get<StepperFormItem[]>('../../assets/data/stepper-form-items.json');
  }
}
