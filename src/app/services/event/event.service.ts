import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  endpoint = environment.endpoint + '/api';
  http = inject(HttpClient);

  isRequestCompleted = new Subject();

  constructor() { }

  setRequestStatus(status: boolean, action: string) {
    this.isRequestCompleted.next({ status, action });
  }

  getRequestStatus(): Observable<any> {
    return this.isRequestCompleted.asObservable();
  }

  getEventList(): Observable<any> {
    return this.http.get(`${this.endpoint}/Event/getEventList`);
  }

  getEventById(eventId: number): Observable<any> {
    return this.http.get(`${this.endpoint}/Event/getEventById?eventId=${eventId}`);
  }

  addNewEvent(formData: any): Observable<any> {
    return this.http.post(`${this.endpoint}/Event/UploadImageWithEventData`, formData);
  }
  updateEvent(formData: any): Observable<any> {
    return this.http.put(`${this.endpoint}/Event/UpdateImageWithEventData`, formData);
  }

  deleteEvent(eventId: number): Observable<any> {
    return this.http.delete(`${this.endpoint}/Delete/` + eventId);
  }
}
