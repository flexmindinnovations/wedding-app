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


  constructor(
    private fb: FormBuilder,
    private sharedService: SharedService,
    private customerRegistrationService: CustomerRegistrationService
  ) {
    this.onResize();
   }

  ngOnInit() {

    this.formGroup = this.fb.group({
      firstName: ['',[Validators.required]],
      lastName: ['',[Validators.required]],
      mobile: [''],
      email: ['',[Validators.required,Validators.email]],
      amount: ['249',[Validators.required]]
    })

    this.getCustomerDetails();
  }

  get formGroupControl(): { [key: string]: FormControl } {
    return this.formGroup.controls as { [key: string]: FormControl };
  }

  getCustomerDetails(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.customerRegistrationService.getCustomerDetailsById(user?.user).subscribe({
      next: (data: any) => {
        if (data) {
          const { customerUserName, contactInfoModel, personalInfoModel } = data;
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
        }
      },
      error: (error) => { }
    })
  }

  handlePayment() {
    if(this.formGroup.valid){
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

  @HostListener('window:resize', ['$event'])
  onResize(event?: any) {
    this.screenWidth = window.innerWidth;
  }


  getDialogStyle() {
    if (this.screenWidth < 640) {  // Example breakpoint for small devices
      return { width: '90vw', padding: '0' }; // Use 90% of screen width on small devices
    } else {
      return { width: '30vw', padding: '0' }; // Default to 25% of screen width on larger screens
    }
  }

}
