import { ChangeDetectorRef, Component, OnInit, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Params } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Sidebar } from 'primeng/sidebar';
import { debounce, debounceTime, delay, forkJoin, of } from 'rxjs';
import { AlertService } from 'src/app/services/alert/alert.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CastService } from 'src/app/services/cast/cast.service';
import { SharedService } from 'src/app/services/shared.service';
import { UserService } from 'src/app/services/user/user.service';
import { CustomerRegistrationService } from 'src/app/services/customer-registration.service';
import { AlertType } from 'src/app/enums/alert-types';

@Component({
  selector: 'app-profile-filter',
  templateUrl: './profile-filter.page.html',
  styleUrls: ['./profile-filter.page.scss'],
})
export class ProfileFilterPage implements OnInit {

  isReadOnly: boolean = false;
  isMobile: boolean = false;

  formGroup!: FormGroup;
  genderOptions: any = [];
  castService = inject(CastService);
  sharedService = inject(SharedService);
  maritalStatusOptions: any = [];
  religionList: any[] = [];
  motherToungeList: any[] = [];
  castList: any[] = [];
  isSearchFromQuery: boolean = false;
  isReligionSelected: boolean = false;
  isDataAvailable = false;
  isLoading = false;
  isError = false;
  customerRegistrationService = inject(CustomerRegistrationService);
  customerData: any;
  searchCriteria: any;
  countryList: any = [];
  stateList: any = [];
  cityList: any = [];
  fb = inject(FormBuilder);
  totalCount = 0;
  isCountryListAvailable = false;
  isStateListAvailable = false;
  isCityListAvailable = false;
  pageNumber = 1;
  itemsPerPage = 20;
  castListOptions: any[] = [];
  subCastListOptions: any[] = [];
  hasSubCast: boolean = false;
  subCastId: boolean = false;
  religionId: any;
  isSubCastDataAvailable: boolean = false;
  religionListOptions: any[] = [];
  cdref = inject(ChangeDetectorRef);

  sidebarVisible: boolean = false;
  @ViewChild('sidebarRef') sidebarRef!: Sidebar;

  filteredProfileList: any[] = [];
  filteredQueryParams: any;

  constructor(
    private deviceService: DeviceDetectorService,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private alertService: AlertService,
    private authService: AuthService
  ) {
    this.isMobile = this.deviceService.isMobile();
  }

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
  }

  getCustomerDetails(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.customerRegistrationService.getCustomerDetailsById(user?.user).subscribe({
      next: (data: any) => {
        if (data) {
          this.customerData = data;
          const { personalInfoModel } = this.customerData;
          const oppGender = this.getFilterGender(personalInfoModel['gender']);
          this.searchCriteria = {
            gender: oppGender
          }
          if (!this.isSearchFromQuery) {
            this.seachFilteredProfiles(this.searchCriteria);
            setTimeout(() => {
              this.formGroup.patchValue(this.searchCriteria);
            })
          }
          this.isDataAvailable = true;
        }
      },
      error: (error) => {
        console.log('error: ', error);
        this.isDataAvailable = true;
        this.alertService.setAlertMessage('Error: ' + error, AlertType.error);
      }
    })
  }

  getFirstItemIndex(): number {
    return (this.pageNumber - 1) * this.itemsPerPage + 1;
  }

  getLastItemIndex(): number {
    return Math.min(this.pageNumber * this.itemsPerPage, this.totalCount);
  }

  getFilterGender(gender: string) {
    const oppositeGender = gender === 'male' ? 'female' : 'male';
    return oppositeGender;
  }

  ngAfterViewInit(): void {
    this.isLoading = true;
    this.getMasterData();
    this.activatedRoute.queryParams.subscribe((query: any) => {
      if (typeof query === 'object' && Object.keys(query).length > 0) this.isSearchFromQuery = true;
      const filteredQueryParams = Object.keys(query).filter(objKey =>
        query[objKey]).reduce((newObj: any, key) => {
          newObj[key] = query[key];
          return newObj;
        }, {}
        );
      this.searchCriteria = filteredQueryParams;
        if (this.searchCriteria && Object.keys(this.searchCriteria).length > 0) {
          this.formGroup.patchValue(this.searchCriteria);
          this.cdref.detectChanges();
        }
      this.seachFilteredProfiles(this.searchCriteria);
    })
  }

  initFormGroup() {
    this.formGroup = this.fb.group({
      gender: ['', [Validators.required]],
      fromAge: ['', [Validators.required]],
      toAge: ['', [Validators.required]],
      religionId: ['', [Validators.required]],
      cast: ['', [Validators.required]],
      subCast: ['', [Validators.required]],
      motherTongue: ['', [Validators.required]],
      maritalStatus: ['', [Validators.required]],
      countryId: ['', [Validators.required]],
      stateId: ['', [Validators.required]],
      cityId: ['', [Validators.required]],
    })

    this.formGroup.valueChanges.subscribe((control) => {
      of(true)
        .pipe(
          debounceTime(2000)
        ).subscribe(() => {
          const formVal = this.formGroup.value;
          const filteredQueryParams = Object.keys(formVal).filter(objKey =>
            formVal[objKey]).reduce((newObj: any, key) => {
              newObj[key] = formVal[key];
              return newObj;
            }, {}
            );
          this.filteredQueryParams = filteredQueryParams;
          if (!this.isMobile) {
            this.seachFilteredProfiles(filteredQueryParams);
          }
        })
    })
    this.getCountryList();
  }

  handleFilter() {
    this.sidebarVisible = false;
    this.seachFilteredProfiles(this.filteredQueryParams);
  }

  handlePage(action: any) {
    let queryParams = { ...this.filteredQueryParams };
    switch (action) {
      case 'next':
        this.pageNumber += 1;
        break;
      case 'prev':
        if (this.pageNumber > 1) this.pageNumber--;
        else this.pageNumber = 1;
        break;
    }
    queryParams = { ...queryParams, pageNumber: this.pageNumber, totalCount: this.totalCount };
    this.seachFilteredProfiles(queryParams);
  }

  seachFilteredProfiles(queryParams: any) {
    const isLogged = this.authService.isLoggedIn();
    if (Object.keys(queryParams).length > 0) {
      if (isLogged) {
        const pageNumber = this.pageNumber;
        queryParams = { ...queryParams, pageNumber, totalCount: this.totalCount ?? 0 }
        this.filteredProfileList = [];
        this.userService.getPaidFilteredProfileList(queryParams).subscribe({
          next: (response) => {
            if (response) {
              const { customerList, totalCount } = response;
              this.filteredProfileList = customerList;
              this.totalCount = totalCount;
              this.isLoading = false;
            }
          },
          error: (error) => {
            this.isError = true;
            this.isLoading = false;
          }
        })
      } else {
        this.userService.getFreeFilteredProfileList(queryParams).subscribe({
          next: (response) => {
            if (response) {
              this.filteredProfileList = response;
              this.isLoading = false;
            }
          },
          error: (error) => {
            this.isError = true;
            this.isLoading = false;
          }
        })
      }
    }
  }

  handleListItemChange(event: any) {

  }

  getSplitterDimensions() {
    if (this.isMobile) {
      return [0, 100];
    } else {
      return [20, 100];
    }
  }

  getMinSplitterDimensions() {
    if (this.isMobile) {
      return [0, 100];
    } else {
      return [15, 80];
    }
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

  get formGroupControl(): { [key: string]: FormControl } {
    return this.formGroup.controls as { [key: string]: FormControl };
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
          this.isDataAvailable = true;
          this.isLoading = false;
          if(this.authService.isLoggedIn()) this.getCustomerDetails();
        }
      },
      error: (error: any) => {
        this.isError = true;
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