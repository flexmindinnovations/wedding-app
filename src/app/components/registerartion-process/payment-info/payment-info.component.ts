import { Component, HostListener, OnInit, isDevMode, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomerRegistrationService } from 'src/app/services/customer-registration.service';
import { SharedService } from 'src/app/services/shared.service';
import { generateTxnId, paymentHtmlPayload } from 'src/app/util/util';

@Component({
  selector: 'app-payment-info',
  templateUrl: './payment-info.component.html',
  styleUrls: ['./payment-info.component.scss'],
})
export class PaymentInfoComponent implements OnInit {
  showPaymentConfirmationDialog = false;
  public screenWidth: any;

  formGroup!: FormGroup;

  userData = signal<any>({});
  isPaymentCompleted = signal<any>(false);
  currentPaymentDetails: any;
  paymentHistory: any;
  isLoading = false;

  @HostListener('window:resize', ['$event'])
  onResize(event?: any) {
    this.screenWidth = window.innerWidth;
  }

  constructor(
    private fb: FormBuilder,
    private sharedService: SharedService,
    private customerRegistrationService: CustomerRegistrationService
  ) { }

  ngOnInit() {

    this.formGroup = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      mobile: [''],
      email: ['', [Validators.required, Validators.email]],
      amount: ['249', [Validators.required]]
    })

    this.getCustomerDetails();
  }

  get formGroupControl(): { [key: string]: FormControl } {
    return this.formGroup.controls as { [key: string]: FormControl };
  }

  getCustomerDetails(): void {
    this.isLoading = true;
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.customerRegistrationService.getCustomerDetailsById(user?.user).subscribe({
      next: (data: any) => {
        if (data) {
          const { customerUserName, contactInfoModel, personalInfoModel, currentCustomerPayment, paymentHistoryList } = data;
          if (currentCustomerPayment?.paymentStatus === 'success') {
            this.isPaymentCompleted.set(true);
            this.currentPaymentDetails = currentCustomerPayment;
            this.paymentHistory = paymentHistoryList;
          }
          this.sharedService.userDetails.set(data);
          const userFormObject = {
            mobile: customerUserName,
            firstName: personalInfoModel?.firstName,
            lastName: personalInfoModel?.lastName,
            email: contactInfoModel?.emailId
          }
          this.userData.set(userFormObject);
          this.formGroup.patchValue(userFormObject);
          this.formGroup.disable();
          this.formGroupControl['email'].enable();
          this.formGroupControl['mobile'].enable();
          this.isLoading = false;
        }
      },
      error: (error) => { }
    })
  }

  handlePayment() {
    if (this.formGroup.valid) {
      const formVal = this.formGroup.getRawValue();
      const payload: any = {};
      for (let key in formVal) {
        if (formVal[key]) payload[key] = formVal[key]
      }
      const appEnv = isDevMode() ? 'local' : 'prod';
      this.sharedService.getPaymentObj(appEnv, payload).subscribe({
        next: (res: any) => {
          if (res) {
            console.clear();
            const data = res?.info;
            const htmlPaymentString = paymentHtmlPayload(data, appEnv);
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

  showPopup() {
    this.showPaymentConfirmationDialog = true;
  }

  getPaymentMode(mode: string) {
    let paymentMode: string = '';
    switch(mode) {
      case 'CC':
        paymentMode = 'Credit Card';
        break;
      case 'DC':
        paymentMode = 'Debit Card';
        break;
      case 'NB':
        paymentMode = 'Net Banking';
        break;
      case 'CASH':
        paymentMode = 'Cash Payment';
        break;
      case 'UPI':
        paymentMode = 'UPI';
        break;
    }

    return paymentMode;
  }

  getDialogStyle() {
    if (this.screenWidth < 640) {  // Example breakpoint for small devices
      return { width: '90vw', padding: '0' }; // Use 90% of screen width on small devices
    } else {
      return { width: '30vw', padding: '0' }; // Default to 25% of screen width on larger screens
    }
  }

}
