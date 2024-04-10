import { Injectable, inject } from '@angular/core';
import { HttpConfigService } from '../http-config.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  http = inject(HttpConfigService);
  endpoint = environment.endpoint + '/api/Customer';
  constructor() { }

  isLoggedIn() {
    return !!localStorage.getItem('token');
  }

  loginCustomer(payload: any): Observable<any> {
    return this.http.post(`${this.endpoint}/createcustomerToken`, payload);
  }

  getCustomerProfileById(userId: number): Observable<any> {
    return this.http.get(`${this.endpoint}/GetCustomerById/${userId}`);
  }

  logoutUser() {
    localStorage.removeItem('token');
    localStorage.removeItem('profile');
    localStorage.removeItem('user');
  }
}