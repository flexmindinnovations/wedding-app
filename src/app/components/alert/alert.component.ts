import { AfterViewInit, Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { AlertType } from 'src/app/enums/alert-types';
import { AlertService } from 'src/app/services/alert/alert.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { AUTO_DISMISS_TIMER } from 'src/app/util/theme';
import { IAlert } from 'src/app/interfaces/IAlert';
import { Subscription, delay, of, tap } from 'rxjs';
import { SharedService } from 'src/app/services/shared.service';
import { MessageService } from 'primeng/api';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements AfterViewInit, OnDestroy {

  alertService = inject(AlertService);
  messageService = inject(MessageService)
  alertType: AlertType = 1;
  alertMessage: string = '';
  showAlert: boolean = true;
  @Input() key = uuidv4();

  ngAfterViewInit(): void {
    this.alertService.getAlertMessage().subscribe((data: any) => {
      this.showAlert = true;
      this.alertMessage = data?.message;
      this.alertType = data?.type;
      this.showToast();
    });
  }

  showToast() {
    this.messageService.add({ 
      key: this.key, 
      sticky: true, 
      severity: this.getAlertType(), 
      summary: this.getAlertType(),
      detail: this.alertMessage
     });
  }

  handleHideAlert() {
    this.showAlert = false;
    this.messageService.clear();
  }

  ngOnDestroy(): void {
    this.alertService.alertSubject.unsubscribe();
  }

  getAlertType() {
    switch (this.alertType) {
      case AlertType.success:
        return 'Success';
      case AlertType.error:
        return 'Error';
      case AlertType.warning:
        return 'Warning';
    }
  }

}
