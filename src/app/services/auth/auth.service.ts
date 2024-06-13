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
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const hasUserObj = user && typeof user === 'object' && Object.keys(user).length > 0;
    return hasUserObj && !!localStorage.getItem('token');
  }

  loginCustomer(payload: any): Observable<any> {
    return this.http.post(`${this.endpoint}/createcustomerToken`, payload);
  }

  getCustomerProfileById(userId: number): Observable<any> {
    return this.http.get(`${this.endpoint}/GetCustomerById/${userId ?? 0}`);
  }

  getCustomerForPDFById(userId: number): Observable<any> {
    return this.http.get(`${this.endpoint}/GetCustomerForPDFById/${userId}`);
  }

  signUp(payload: any): Observable<any> {
    return this.http.post(`${this.endpoint}/signUp`, payload);
  }

  logoutUser() {
    localStorage.removeItem('token');
    localStorage.removeItem('profile');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    localStorage.clear();
    localStorage.removeItem('role');
  }
}
