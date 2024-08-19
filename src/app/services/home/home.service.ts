import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  endpoint = environment.endpoint + '/api';
  http = inject(HttpClient);
  constructor() { }

  getRandomProfiles(): Observable<any> {
    return this.http.get(`${this.endpoint}/Dashboard/getRandomCustomerList`);
  }
}
