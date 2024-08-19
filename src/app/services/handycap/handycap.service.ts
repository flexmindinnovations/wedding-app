import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HandycapService {
  endpoint = environment.endpoint + '/api/Handycap';
  http = inject(HttpClient);

  getHandycapList(): Observable<any> {
    return this.http.get(`${this.endpoint}/getHandycapList`);
  }

  saveHandycap(payload: any): Observable<any> {
    return this.http.post(`${this.endpoint}/saveHandycap`, payload)
  }

  updateHandycap(id: any, payload: any): Observable<any> {
    return this.http.put(`${this.endpoint}/updateHandycap/${id}`, payload)
  }

  deleteHandycap(id: any): Observable<any> {
    return this.http.delete(`${this.endpoint}/deleteHeightMaster/${id}`)
  }
}
