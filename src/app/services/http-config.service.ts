import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, tap, throwError } from 'rxjs';
import { AlertService } from './alert/alert.service';

@Injectable({
  providedIn: 'root'
})
export class HttpConfigService {

  http = inject(HttpClient);
  alert = inject(AlertService);

  constructor() { }

  get(url: string, modelType?: any): Observable<any> {
    return this.http.get(url, { observe: 'events', reportProgress: true, })
      .pipe(
        tap((data: any) => { }),
        map((response) => {
          if (response.type === 4 && response.body) {
            return response.body;
          }
        }),
        catchError((error) => {
          return throwError(() => error)
        })
      );
  }

  post(url: string, payload: any): Observable<any> {
    return this.http.post(url, payload, { observe: 'events', reportProgress: true })
      .pipe(
        tap((data: any) => { }),
        map((response) => {
          if (response.type === 4) {
            return response.body;
          }
        }),
        catchError((error) => {
          return throwError(() => error)
        })
      );
  }

  put(url: string, payload: any): Observable<any> {
    return this.http.put(url, payload, { observe: 'events', reportProgress: true })
      .pipe(
        tap((data: any) => { }),
        map((response) => {
          if (response.type === 4) {
            return response.body;
          }
        }),
        catchError((error) => {
          return throwError(() => error)
        })
      );
  }

  delete(url: string): Observable<any> {
    return this.http.delete(url, { observe: 'events', reportProgress: true })
      .pipe(
        tap((data: any) => { }),
        map((response) => {
          if (response.type === 4) {
            return response.body;
          }
        }),
        catchError((error) => {
          return throwError(() => error)
        })
      );
  }

  postImage(url: string, payload: any): Observable<any> {
    return this.http.post(url, payload, { observe: 'events', reportProgress: true })
      .pipe(
        tap((data: any) => { }),
        map((response) => {
          if (response.type === 4) {
            return response.body;
          }
        }),
        catchError((error) => {
          return throwError(() => error)
        })
      );
  }

  getHeaders({ isImage }: { isImage: boolean }): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': isImage ? 'multipart/form-data' : 'application/json'
    })
  }
}
