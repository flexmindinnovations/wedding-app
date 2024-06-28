import { Injectable, inject } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AlertType } from 'src/app/enums/alert-types';
import { SharedService } from '../shared.service';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  alertSubject = new Subject<any>();

  setAlertMessage(message: string | undefined, type?: AlertType): void {
    let obj: any = undefined;
    if(message && type) obj = { message, type };
    this.alertSubject.next(obj);
  }

  getAlertMessage(): Observable<any> {
    return this.alertSubject.asObservable();
  }
}
