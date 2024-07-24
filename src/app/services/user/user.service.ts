import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpConfigService } from '../http-config.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  endpoint = environment.endpoint + '/api/User';
  http = inject(HttpClient);

  getUserList(): Observable<any> {
    return this.http.get(`${this.endpoint}/getUserList`);
  }

  saveUser(payload: any): Observable<any> {
    return this.http.post(`${this.endpoint}/saveUser`, payload)
  }

  updateUser(payload: any): Observable<any> {
    return this.http.put(`${this.endpoint}/updateUser`, payload)
  }

  deleteUser(id: any): Observable<any> {
    return this.http.delete(`${this.endpoint}/deleteUser/${id}`)
  }

  setFavourite(payload: any): Observable<any> {
    return this.http.post(`${environment.endpoint}/api/CustomerLike/AddLike`, payload);
  }

  setInterest(payload:any): Observable<any>{
    return this.http.post(`${environment.endpoint}/api/CustomerLike/AddInterest`, payload);
  }

  // for customer showed interest
  getInterest(customerInterestId:any): Observable<any> {
    return this.http.get(`${environment.endpoint}/api/CustomerLike/getInterestCustomerListByInterestedCustomerId?InterestedCustomerId=${customerInterestId}`);
  }

  getFavouriteProfileList(customerId: any): Observable<any> {
    return this.http.get(`${environment.endpoint}/api/CustomerLike/getLikedCustomerListByCustomerId?CustomerId=${customerId}`);
  }

 // for profile history
  getCustomerInterestList(customerId: any): Observable<any> {
    return this.http.get(`${environment.endpoint}/api/CustomerLike/getInterestCustomerListByCustomerId?CustomerId=${customerId}`);
  }

  getMatchedProfileList(payload: any, pageNumber = 1, totalCount = 0): Observable<any> {
    // payload = {gender: 'male'};
    let urlPath = `${environment.endpoint}/api/Customer/getMatchedCustomerList`;
    const paginationParams = `&pageNumber=${pageNumber}&totalCount=${totalCount}`;
    if (Object.keys(payload).length > 0) {
      urlPath = `${urlPath}?${new URLSearchParams(payload).toString()}${paginationParams}`;
    } else {
      urlPath = `${urlPath}?pageNumber=${pageNumber}&totalCount=${totalCount}`;
    }
    return this.http.get(urlPath);
  }

  getPaidFilteredProfileList(payload: any): Observable<any> {
    const queryParams = new URLSearchParams(payload).toString();
    const endpoint = environment.endpoint + `/api/Customer/getPaidCustomerFilterList?${queryParams}`;
    return this.http.get(endpoint, payload);
  }
  getFreeFilteredProfileList(payload: any): Observable<any> {
    const endpoint = environment.endpoint + `/api/Customer/getUnpaidCustomerFilterList?${new URLSearchParams(payload).toString()}`;
    return this.http.get(endpoint, payload);
  }

  verifyUserEmail(userEmail: string): Observable<any> {
    const endpoint = environment.endpoint + `/api/Customer/sendEmail?emailId=${userEmail}`;
    return this.http.get(endpoint);
  }

  verifyOTP(userEmail: string, userOTP: any): Observable<any> {
    const endpoint = environment.endpoint + `/api/Customer/veryOTP?emailId=${userEmail}&OTP=${userOTP}`;
    return this.http.get(endpoint);
  }

  updateUserPassword(userEmail: string, userPassword: any): Observable<any> {
    const payload = {
      "emailId": userEmail,
      "customerPassword": userPassword
    }
    const endpoint = environment.endpoint + `/api/Customer/updateCustomerPassword`;
    return this.http.put(endpoint, payload);
  }

}
