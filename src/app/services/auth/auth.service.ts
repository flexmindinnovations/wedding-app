import { Injectable, inject } from '@angular/core';
import { HttpConfigService } from '../http-config.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  http = inject(HttpConfigService);
  endpoint = environment.endpoint + '/api/Customer/createcustomerToken';
  constructor() { }

  isLoggedIn() {
    return !!localStorage.getItem('token');
  }

  loginCustomer(payload: any): Observable<any> {
    return this.http.post(this.endpoint, payload);
  }

  getCustomerProfile() {

  }

  logoutUser() {
    localStorage.removeItem('token');
    localStorage.removeItem('profile');
    localStorage.removeItem('user');
  }
}
