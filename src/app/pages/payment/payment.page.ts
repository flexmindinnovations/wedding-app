import { Component, OnInit, isDevMode, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { tsParticles } from '@tsparticles/engine';
import { AuthService } from 'src/app/services/auth/auth.service';
import { SharedService } from 'src/app/services/shared.service';
import { MERCHANT_KEY_LIVE, MERCHANT_KEY_TEST, verifyPaymentHash } from 'src/app/util/util';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
})
export class PaymentPage implements OnInit {
  isLoading = signal(false);
  isTxSuccess = signal(false);
  queryParams = signal<any>({})
  paymentDetails = signal<any>({});
  paymentDbResponse = signal<any>({});
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private sharedService: SharedService
  ) { }

  ngOnInit() {
    this.isLoading.set(true);
    const user = this.sharedService.getLoggedInCustomerInfo();
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params && params['status'] === 'success') {
        this.queryParams.set(params);
        this.paymentDetails.update((val) => { return { ...val, email: params['email'] } })
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
          params['mode']
        );
        const hash = verifyPaymentHash({ command: 'verify_payment', txnid: params['txnid'] });
        const payload = {
          command: 'verify_payment',
          var1: params['txnid'],
          hash
        }
        this.sharedService.verifyPayment(payload).subscribe((res: any) => {
          if (res) {
            const txData = res.transaction_details[payload['var1']];
            if (txData.status === TransactionStatus.SUCCESS) {
              this.isTxSuccess.set(true);
              this.paymentDetails.update((val) => { return { ...val, ...txData } });

              this.sharedService.saveCustomerPayment(paymentObj).subscribe({
                next: (data: any) => {
                  if (data) {
                    this.isLoading.set(false);
                    this.paymentDbResponse.set(data);
                  }
                },
                error: (error) => {
                  console.log('error: ', error);
                  this.isLoading.set(false);
                }
              })

            } else {
              this.isTxSuccess.set(false);
            }
          }
        })
      }
    })
  }

  handleRedirect() {
    this.router.navigateByUrl('');
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

export enum TransactionStatus {
  FAILED = 'failed',
  SUCCESS = 'success'
}
