import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { RegisterUserComponent } from 'src/app/modals/register-user/register-user.component';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss'],
})
export class PricingComponent implements OnInit {

  cardItems: CardItem[] = [];
  dialogRef: DynamicDialogRef | undefined;
  showLoginDialog = false;
  public screenWidth: any;

  @HostListener('window:resize', ['$event'])
  onResize(event?: any) {
    this.screenWidth = window.innerWidth;
  }

  constructor(
    private authService: AuthService,
    private dialogService: DialogService,
    private router: Router
  ) { }

  ngOnInit() {
    this.setCardItems();
  }

  setCardItems() {
    this.cardItems = [
      {
        planName: 'Amazing Plan',
        planType: 'Basic',
        styleClass: '',
        planFeature: [
          { id: 1, text: 'Access upto 50 profiles per week' }
        ],
        originalAmount: 1499,
        discountAmount: 499,
        actualAmount: '',
        planStartDate: moment(new Date()),
        actionName: 'Get Amazing Plan',
        isActive: true
      },
      {
        planName: 'Delux',
        planType: 'Delux',
        planFeature: [
          { id: 1, text: 'Access to unlimited profiles' }
        ],
        styleClass: 'pricing',
        originalAmount: 5000,
        discountAmount: 2499,
        actualAmount: '',
        planStartDate: moment(new Date()),
        actionName: 'Get Delux',
        isActive: true
      }
    ];
  }

  handlePlanCardClick(plan: any) {
    const isLoggedIn = this.authService.isLoggedIn();
    console.log('plan: ', plan);

    if (!isLoggedIn) {
      // this.dialogRef = this.dialogService.open(RegisterUserComponent, {
      //   header: 'Sign up',
      //   width: '25%',
      //   baseZIndex: 10000,
      //   breakpoints: {
      //     '960px': '75vw',
      //     '640px': '90vw'
      //   },
      //   maximizable: false
      // })

      // this.dialogRef.onClose.subscribe((afterClose: any) => {
      //   if (afterClose) { }
      // });
      sessionStorage.setItem('plan', JSON.stringify(plan));
      this.showLoginDialog = true;
    } else {

    }

  }
  handleButtonClick(src?: string) {
    this.showLoginDialog = false;
    setTimeout(() => {
      if (src == 'login') {
        this.router.navigateByUrl('login');
      } else {
        sessionStorage.removeItem('inquiry');
      }
    }, 300);
  }

  getDialogStyle() {
    if (this.screenWidth < 640) {  // Example breakpoint for small devices
      return { width: '90vw', padding: '0' }; // Use 90% of screen width on small devices
    } else {
      return { width: '30vw', padding: '0' }; // Default to 25% of screen width on larger screens
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