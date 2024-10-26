import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AlertType } from 'src/app/enums/alert-types';
import { RegisterUserComponent } from 'src/app/modals/register-user/register-user.component';
import { AlertService } from 'src/app/services/alert/alert.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss'],
})
export class PricingComponent implements OnInit {

  cardItems: CardItem[] = [];
  dialogRef: DynamicDialogRef | undefined;


  constructor(
    private authService: AuthService,
    private dialogService: DialogService,
    private sharedService: SharedService,
    private alertService: AlertService,
  ) { }

  ngOnInit() {
    this.setCardItems();
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
            ] || [],
            originalAmount: plan.originalAmount || 0,
            discountAmount: plan.discountAmount || 0,
            actualAmount: plan.actualAmount || '',
            planStartDate: moment(plan.planStartDate || new Date()),
            actionName: `Get ${plan.planName}` || '',
            isActive: plan.isActive || false
          }));
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


  handlePlanCardClick(plan: any) {
    const isLoggedIn = this.authService.isLoggedIn();
    if (!isLoggedIn) {
      this.dialogRef = this.dialogService.open(RegisterUserComponent, {
        header: 'Sign up',
        width: '25%',
        baseZIndex: 10000,
        breakpoints: {
          '960px': '75vw',
          '640px': '90vw'
        },
        maximizable: false
      })

      this.dialogRef.onClose.subscribe((afterClose: any) => {
        if (afterClose) { }
      });
    } else {

    }

  }

}

interface CardItem {
  planName: string;
  planType: PlanType;
  planFeature: Array<PlanFeature>;
  styleClass: string;
  originalAmount: CurrencyInputType;
  discountAmount: CurrencyInputType;
  actualAmount?: CurrencyInputType;
  planStartDate: Date | any;
  actionName: string;
  isActive: boolean;
}

interface PlanFeature {
  id: number;
  text: string;
}

type CurrencyInputType = number | string;
type PlanType = 'Basic' | 'Delux';