import { Component, OnInit, isDevMode } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { SharedService } from 'src/app/services/shared.service';
import { MERCHANT_KEY_LIVE, MERCHANT_KEY_TEST, verifyPaymentHash } from 'src/app/util/util';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
})
export class PaymentPage implements OnInit {

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private sharedService: SharedService
  ) { }

  ngOnInit() {

    const user = this.sharedService.getLoggedInCustomerInfo();
    this.activatedRoute.queryParams.subscribe((params) => {
      console.log('params: ', params);
      if (params && params['status'] === 'success') {
        const paymentDate = new Date(params['addedon']);
        const paymentObj = new Payment(
          0,
          user?.user,
          params['mihpayid'],
          params['mode'],
          params['txnid'],
          params['amount'],
          params['discount'],
          params['net_amount_debit'],
          params['bank_ref_num'],
          paymentDate.toISOString(),
          params['status'],
          'online'
        );

        console.log('paymentObj: ', paymentObj);
        const hash = verifyPaymentHash({ command: 'verify_payment', txnid: params['txnid'] });
        console.log('hash: ', hash);
        const payload = {
          key: isDevMode() ? MERCHANT_KEY_TEST : MERCHANT_KEY_LIVE,
          command: 'verify_payment',
          var1: params['txnid'],
          hash
        }
        console.log('payload: ', payload);
        
        this.sharedService.verifyPayment(payload).subscribe((res: any) => {
          console.log('res: ', res);
          
        })
      }
    })
  }

}

export class Payment {
  customerPaymentId: number;
  customerId: number;
  mihpayid: string;
  mode: string;
  txnid: string;
  amount: number;
  discount: number;
  net_amount_debit: number;
  bank_ref_num: string;
  paymentDate: string;
  paymentStatus: string;
  paymentMode: string;

  constructor(
    customerPaymentId: number,
    customerId: number,
    mihpayid: string,
    mode: string,
    txnid: string,
    amount: number,
    discount: number,
    net_amount_debit: number,
    bank_ref_num: string,
    paymentDate: string,
    paymentStatus: string,
    paymentMode: string
  ) {
    this.customerPaymentId = customerPaymentId
    this.customerId = customerId
    this.mihpayid = mihpayid
    this.mode = mode
    this.txnid = txnid
    this.amount = amount
    this.discount = discount
    this.net_amount_debit = net_amount_debit
    this.bank_ref_num = bank_ref_num
    this.paymentDate = paymentDate
    this.paymentStatus = paymentStatus
    this.paymentMode = paymentMode
  }
}
