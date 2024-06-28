import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpConfigService } from '../http-config.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  endpoint = environment.endpoint + '/api';
  http = inject(HttpConfigService);
  constructor() { }

  getRandomProfiles(): Observable<any> {
    return this.http.get(`${this.endpoint}/Dashboard/getRandomCustomerList`);
  }
}
