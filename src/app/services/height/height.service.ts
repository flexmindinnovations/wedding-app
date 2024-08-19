import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HeightService {

  endpoint = environment.endpoint + '/api/Height';
  http = inject(HttpClient);

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

