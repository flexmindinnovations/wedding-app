import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpConfigService } from '../http-config.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CastService {

  endpoint = environment.endpoint + '/api/Cast';
  http = inject(HttpConfigService);

  getCastList(): Observable<any> {
    return this.http.get(`${this.endpoint}/GetCastList`);
  }
  getCastListById(castId: any): Observable<any> {
    return this.http.get(`${this.endpoint}/GetCastListById?castId=${castId}`)
  }
  getSubCastListByCast(castId: number): Observable<any> {
    return this.http.get(`${this.endpoint}/GetSubCastListByCastId?castId=${castId}`);
  }
  addNewCast(payload: any): Observable<any> {
    return this.http.post(`${this.endpoint}/saveCastMaster`, payload);
  }
  updateNewCast(payload: any, castId: number): Observable<any> {
    return this.http.put(`${this.endpoint}/updateCastMaster/${castId}`, payload);
  }
  deleteCastById(castId: number): Observable<any> {
    return this.http.get(`${this.endpoint}/Delete/${castId}`);
  }

}

