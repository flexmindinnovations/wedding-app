import { AfterViewInit, Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { AlertType } from 'src/app/enums/alert-types';
import { AlertService } from 'src/app/services/alert/alert.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { AUTO_DISMISS_TIMER } from 'src/app/util/theme';
import { IAlert } from 'src/app/interfaces/IAlert';
import { Subscription, delay, of, tap } from 'rxjs';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(100%)' }),
        animate('0.3s ease-out', style({ opacity: 1, transform: 'translateX(0%)' }))
      ]),
      transition(':leave', [
        style({ transform: 'translateX(0%)' }),
        animate('0.3s ease-out', style({ transform: 'translateX(150%)' }))
      ])
    ])
  ]
})
export class AlertComponent implements OnDestroy {

  alertService = inject(AlertService);
  @Input() alertType: AlertType = 1;
  @Input() alertMessage: string = '';
  @Input() showAlert: boolean = true;
  @Input() outside = false;

  handleHideAlert() {
    setTimeout(() => {
      this.showAlert = false;
    }, 3500);
  }

  ngOnDestroy(): void {
    this.alertService.alertSubject.unsubscribe();
  }

  getAlertType() {
    switch (this.alertType) {
      case AlertType.success:
        return 'success';
      case AlertType.error:
        return 'error';
      case AlertType.warning:
        return 'warning';
    }
  }

}
