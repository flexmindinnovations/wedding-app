import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerRegistrationService {

  isRequestCompleted = new Subject();

  endpoint = environment.endpoint + '/api';
  http = inject(HttpClient);


  getCustomerList(): Observable<any> {
    return this.http.get(this.endpoint + '/Customer/GetCustomerList');
  }

  getCustomerDetailsById(customerId: number): Observable<any> {
    return this.http.get(this.endpoint + `/Customer/GetCustomerById/${customerId}`);
  }

  savePersonalInformation(payload: any): Observable<any> {
    return this.http.post(this.endpoint + '/CustomerPersonalInfo/saveCustomerPersonalInfo', payload);
  }

  updatePersonalInformation(payload: any, customerId: number): Observable<any> {
    return this.http.put(this.endpoint + `/CustomerPersonalInfo/updateCustomerPersonalInfo/${customerId}`, payload);
  }

  saveFamilyInformation(payload: any): Observable<any> {
    return this.http.post(this.endpoint + '/CustomerFamilyInfo/saveCustomerFamilyInfo', payload);
  }

  updateFamilyInformation(payload: any, customerId: number): Observable<any> {
    return this.http.put(this.endpoint + `/CustomerFamilyInfo/updateCustomerFamilyInfo/${customerId}`, payload);
  }

  saveContactInformation(payload: any): Observable<any> {
    return this.http.post(this.endpoint + '/CustomerContactInfo/saveCustomerContactInfo', payload);
  }

  updateContactInformation(payload: any, customerId: number): Observable<any> {
    return this.http.put(this.endpoint + `/CustomerContactInfo/updateCustomerContactInfo/${customerId}`, payload);
  }

  saveOtherInformation(payload: any): Observable<any> {
    return this.http.post(this.endpoint + '/CustomerOtherInfo/saveCustomerOtherInfo', payload);
  }

  updateOtherInformation(payload: any, customerId: number): Observable<any> {
    return this.http.put(this.endpoint + `/CustomerOtherInfo/updateCustomerOtherInfo/${customerId}`, payload);
  }

  savePhotos(payload: any): Observable<any> {
    return this.http.post(this.endpoint + '/CustomerImage/UploadCustomerImage', payload);
  }

  updatePhotos(payload: any, customerId: number): Observable<any> {
    return this.http.put(this.endpoint + `/CustomerImage/UpdateCustomerImage`, payload);
  }

  getCustomerPhotos(customerId: number): Observable<any> {
    return this.http.get(this.endpoint + `/CustomerImage/Get/${customerId}`);
  }

  setRequestStatus(status: boolean, action: string) {
    this.isRequestCompleted.next({ status, action });
  }

  getRequestStatus(): Observable<any> {
    return this.isRequestCompleted.asObservable();
  }


}
