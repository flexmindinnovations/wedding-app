import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpConfigService } from '../http-config.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeightService {

  endpoint = environment.endpoint + '/api/Height';
  http = inject(HttpConfigService);

  getHeightList(): Observable<any> {
    return this.http.get(`${this.endpoint}/getHeightList`);
  }

  saveHeight(payload: any): Observable<any> {
    return this.http.post(`${this.endpoint}/saveHeightMaster`, payload)
  }

  updateHeight(payload: any): Observable<any> {
    return this.http.post(`${this.endpoint}/updateHeightMaster`, payload)
  }

  deleteHight(id: any): Observable<any> {
    return this.http.delete(`${this.endpoint}/deleteHeightMaster/${id}`)
  }

}

