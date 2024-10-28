import { Component, HostListener, OnInit, isDevMode, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { AlertType } from 'src/app/enums/alert-types';
import { AlertService } from 'src/app/services/alert/alert.service';
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
  amountOptions: any = [];
  cardItems: any[] = [];


  constructor(
    private fb: FormBuilder,
    private sharedService: SharedService,
    private customerRegistrationService: CustomerRegistrationService,
    private alertService: AlertService,
  ) {
    this.onResize();
  }

  ngOnInit() {
    this.formGroup = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      amount: ['', [Validators.required]],
      mobile: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      email: ['', [Validators.required, Validators.email]],
    });
    this.getPlanAmount();
    this.setCardItems();
    this.getCustomerDetails();
  }

  get formGroupControl(): { [key: string]: FormControl } {
    return this.formGroup.controls as { [key: string]: FormControl };
  }
  setCardItems() {
    this.sharedService.getMembershipPlanList().subscribe({
      next: (response) => {
        if (response) {
          this.cardItems = response.map((plan: any) => ({
            planName: plan.planName || '',
            planType: plan.planType || '',
            styleClass: plan.styleClass || '',
            planFeature: [
              { id: 1, text: 'Access to unlimited profiles' }
            ],
            originalAmount: plan.originalAmount || 0,
            discountAmount: plan.discountAmount || 0,
            actualAmount: plan.actualAmount || '',
            planStartDate: moment(plan.planStartDate || new Date()),
            actionName: `Get ${plan.planName}` || '',
            isActive: plan.isActive || false,
            isSelected: false
          }));
          this.cardItems = this.cardItems.sort((plan1: any, plan2: any) => plan1.discountAmount - plan2.discountAmount);
          if (this.cardItems && this.cardItems.length > 0) {
            this.cardItems[0].isSelected = true;
            const amount = this.cardItems[0]?.discountAmount;
            this.formGroup.patchValue({ amount });
          }
        }
      },
      error: (error) => {
        this.alertService.setAlertMessage('Error: Something went wrong ', AlertType.error)
      }
    });
    // this.cardItems = [
    //   {
    //     planName: 'Amazing Plan',
    //     planType: 'Basic',
    //     styleClass: '',
    //     planFeature: [
    //       { id: 1, text: 'Access upto 50 profiles per week' }
    //     ],
    //     originalAmount: 2499,
    //     discountAmount: 1499,
    //     actualAmount: '',
    //     planStartDate: moment(new Date()),
    //     actionName: 'Get Amazing Plan',
    //     isActive: true
    //   },
    //   {
    //     planName: 'Delux',
    //     planType: 'Delux',
    //     planFeature: [
    //       { id: 1, text: 'Access to unlimited profiles' }
    //     ],
    //     styleClass: 'pricing',
    //     originalAmount: 5000,
    //     discountAmount: 2499,
    //     actualAmount: '',
    //     planStartDate: moment(new Date()),
    //     actionName: 'Get Delux',
    //     isActive: true
    //   }
    // ];
  }
  getPlanAmount() {
    this.sharedService.getMembershipPlanList().subscribe({
      next: (response) => {
        if (response) {
          this.amountOptions = response.map((plan: any) => ({
            id: plan.actualAmount,
            title: plan.actualAmount,
          }));
        }
      },
      error: (error) => {
        this.alertService.setAlertMessage('Error: Something went wrong ', AlertType.error);
      }
    });
  }

  onPlanClick(item: any) {
    this.cardItems.forEach((each) => each.isSelected = false);
    item.isSelected = true;
    const amount = item?.discountAmount;
    this.formGroup.patchValue({ amount });
  }

  // onSelectionChange(event: any, amount: any) {
  //   if (event && event?.title) {
  //     this.formGroup.patchValue({ amount: event?.title });
  //   }
  // }


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
    switch (mode) {
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

  @HostListener('window:resize', ['$event'])
  onResize(event?: any) {
    this.screenWidth = window.innerWidth;
  }

  onClosePopup() {
    this.showPaymentConfirmationDialog = false;
    this.cardItems.forEach((each) => each.isSelected = false);
    this.formGroup.get('amount')?.reset();
  }


  getDialogStyle() {
    if (this.screenWidth < 640) {  // Example breakpoint for small devices
      return { width: '90vw', padding: '0' }; // Use 90% of screen width on small devices
    } else {
      return { width: '30vw', padding: '0' }; // Default to 25% of screen width on larger screens
    }
  }
  isAnyCardSelected(): boolean {
    return this.cardItems.some(item => item.isSelected);
  }
}
