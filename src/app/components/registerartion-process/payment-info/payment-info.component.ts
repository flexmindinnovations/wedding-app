import { Component, OnInit, isDevMode } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';
import { generateTxnId, paymentHtmlPayload } from 'src/app/util/util';

@Component({
  selector: 'app-payment-info',
  templateUrl: './payment-info.component.html',
  styleUrls: ['./payment-info.component.scss'],
})
export class PaymentInfoComponent implements OnInit {

  constructor(
    private sharedService: SharedService
  ) { }

  ngOnInit() { }

  handlePayment() {
    const uniqueId = generateTxnId();
    const appEnv = isDevMode() ? 'local' : 'prod';
    this.sharedService.getPaymentObj(appEnv).subscribe({
      next: (res: any) => {
        if (res) {
          console.clear();
          const data = res?.info;
          const htmlPaymentString = paymentHtmlPayload(data);
          const winUrl = URL.createObjectURL(
            new Blob([htmlPaymentString], { type: "text/html" })
          );
          window.location.href = winUrl;
        }
      },
      error: (error: any) => {
        console.log('error: ', error);
      }
    })


  }

}
