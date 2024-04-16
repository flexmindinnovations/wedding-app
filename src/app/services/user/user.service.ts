import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpConfigService } from '../http-config.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  endpoint = environment.endpoint + '/api/User';
  http = inject(HttpConfigService);

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

  getFreeFilteredProfileList(payload: any): Observable<any> {
    const endpoint = environment.endpoint + `/api/Customer/getUnpaidCustomerFilterList?${new URLSearchParams(payload).toString()}`;
    return this.http.get(endpoint, payload);
  }

}
