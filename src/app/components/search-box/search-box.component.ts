import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AlertType } from 'src/app/enums/alert-types';
import { AlertService } from 'src/app/services/alert/alert.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CastService } from 'src/app/services/cast/cast.service';
import { CustomerRegistrationService } from 'src/app/services/customer-registration.service';
import { SharedService } from 'src/app/services/shared.service';
import { use } from 'video.js/dist/types/tech/middleware';

@Component({
  selector: 'search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss'],
})
export class SearchBoxComponent implements OnInit, AfterViewInit {

  formGroup!: FormGroup;
  genderOptions: any = [];

  castService = inject(CastService);
  sharedService = inject(SharedService);
  religionList: any[] = [];
  motherToungeList: any[] = [];
  castList: any[] = [];

  isReligionSelected: boolean = false;

  fb = inject(FormBuilder);
  countryList: any = [];
  stateList: any = [];
  cityList: any = [];
  isCountryListAvailable = false;
  isStateListAvailable = false;
  isCityListAvailable = false;
  maritalStatusOptions: any = [];
  castListOptions: any[] = [];
  subCastListOptions: any[] = [];

  hasSubCast: boolean = false;
  subCastId: boolean = false;
  religionId: any;
  isSubCastDataAvailable: boolean = false;
  religionListOptions: any[] = [];
  isLoggedIn = false;
  alert = inject(AlertService);
  customerRegistrationService = inject(CustomerRegistrationService);

  constructor(
    private router: Router,
    private alertService: AlertService,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.initFormGroup();
    this.genderOptions = [
      { id: 'male', title: 'Male' },
      { id: 'female', title: 'Female' },
    ];
    this.maritalStatusOptions = [
      { id: 'married', title: 'Married' },
      { id: 'single', title: 'Single' },
      { id: 'divorced', title: 'Divorced' },
      { id: 'widowed', title: 'Widowed' }
    ]
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user?.user) this.getCustomerDetails(user);
  }

  getCustomerDetails(user: any): void {
    this.customerRegistrationService.getCustomerDetailsById(user?.user).subscribe({
      next: (data: any) => {
        if (data) {
          this.religionId = data?.familyInfoModel?.religionId;
          this.getCastListReligionId(this.religionId)
        }
      },
      error: (error) => {
        console.log('error: ', error);
        this.alert.setAlertMessage('Error: ' + error, AlertType.error);
      }
    })
  }

  ngAfterViewInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.formGroup.reset();
    this.getMasterData();

  }

  initFormGroup() {
    this.formGroup = this.fb.group({
      gender: ['', [Validators.required]],
      fromAge: !['', [Validators.required]],
      toAge: !['', [Validators.required]],
      religionId: !['', [Validators.required]],
      cast: !['', [Validators.required]],
      subCast: !['', [Validators.required]],
      motherTongue: !['', [Validators.required]],
      maritalStatus: !['', [Validators.required]],
      countryId: !['', [Validators.required]],
      stateId: !['', [Validators.required]],
      cityId: !['', [Validators.required]],
    })
    this.getCountryList();
  }

  get formGroupControl(): { [key: string]: FormControl } {
    return this.formGroup.controls as { [key: string]: FormControl };
  }

  onSelectionChange(event: any, src: string) {
    switch (src) {
      case 'religionId':
        this.castListOptions = [];
        this.subCastListOptions = [];
        this.religionId = event?.id;
        this.getCastListReligionId(event?.id)
        break;
      case 'cast':
        this.subCastListOptions = [];
        this.hasSubCast = event?.hasSubcast;
        if (this.hasSubCast) this.getSubCastList(event?.id);
        break;
      case 'subCast':
        const subCastId = event?.id;
        this.subCastId = subCastId;
        break;
      case 'maritalStatus':
        break;
      case 'countryId':
        this.getStateByCountry(event?.id);
        break;
      case 'stateId':
        this.getCityByState(event?.id);
        break;
    }

  }

  handleOnSearch() {
    const formVal = this.formGroup.value;
    if (!this.isLoggedIn && this.formGroup.invalid) {
      this.alertService.setAlertMessage('Please provide filter criteria', AlertType.warning);
      return;
    }

    const filteredQueryParams = Object.keys(formVal).filter(objKey =>
      formVal[objKey]).reduce((newObj: any, key) => {
        newObj[key] = formVal[key];
        return newObj;
      }, {}
      );

    this.router.navigate(['/filter-profile'], { queryParams: filteredQueryParams, skipLocationChange: false });
  }

  getMasterData() {
    const religionListOptions = this.castService.getReligionList();
    const motherToungeList = this.sharedService.getMotherToungeList();
    forkJoin({ religionListOptions, motherToungeList }).subscribe({
      next: (response: any) => {
        if (response) {
          const { religionListOptions, motherToungeList } = response;
          this.religionListOptions = religionListOptions;
          this.religionListOptions = religionListOptions.map((item: any) => {
            return {
              id: item?.religionId,
              title: item?.religionName
            }
          });
          this.motherToungeList = motherToungeList.map((item: any) => {
            return {
              id: item?.motherTongueId,
              title: item?.motherTongueName
            }
          });
        }
      },
      error: (error: any) => {
        console.log('error: ', error);

      }
    })
  }

  getCastListReligionId(religionId: any) {
    this.castService.getCastListByReligionId(religionId).subscribe({
      next: (response: any) => {
        if (response) {
          this.castListOptions = response.map((item: any) => {
            return {
              id: item?.castId,
              title: item?.castName,
              hasSubcast: item?.hasSubcast
            }
          })
        }
      },
      error: (error) => { }
    })
  }

  getSubCastList(castId: number) {
    this.subCastListOptions = [];
    this.isSubCastDataAvailable = false;
    this.castService.getSubCastListByCast(castId).subscribe({
      next: (response: any) => {
        if (response) {
          this.subCastListOptions = response.map((item: any) => {
            return {
              id: item?.subCastId,
              title: item?.subCastName
            }
          })
          this.isSubCastDataAvailable = true;
        }
      },
      error: (error) => { }
    })
  }
  getCountryList() {
    this.sharedService.getCountryList().subscribe({
      next: (data: any) => {
        if (data) {
          this.countryList = data?.map((item: any) => {
            const obj = {
              id: item?.countryId,
              title: item?.countryName
            }
            return obj;
          });
          this.isCountryListAvailable = true;
        }
      },
      error: (error) => {
        console.log('error: ', error);

      }
    })
  }

  getStateByCountry(countryId: number) {
    if (countryId) {
      this.stateList = [];
      this.cityList = [];
      this.sharedService.getStatByCountry(countryId).subscribe({
        next: (data: any[]) => {
          if (data) {
            this.stateList = data?.map((item: any) => {
              const obj = {
                id: item?.stateId,
                title: item?.stateName
              }
              return obj;
            });
            this.isStateListAvailable = true;
          }
        },
        error: (error) => {
          console.log('error: ', error);

        }
      })
    }

  }
  getCityByState(stateId: number) {
    this.cityList = [];
    if (stateId) {
      this.sharedService.getCityByState(stateId).subscribe({
        next: (data: any[]) => {
          if (data) {
            this.cityList = data?.map((item: any) => {
              const obj = {
                id: item?.cityId,
                title: item?.cityName
              }
              return obj;
            });
            this.isCityListAvailable = true;
          }
        },
        error: (error) => {
          console.log('error: ', error);

        }
      })
    }
  }
}
