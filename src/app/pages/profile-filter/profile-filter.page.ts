import { Component, OnInit, ViewChild, inject } from '@angular/core';
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

  fb = inject(FormBuilder);
  totalCount = 0;


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
  ) { }

  ngOnInit() {
    this.initFormGroup();
    this.genderOptions = [
      { id: 'male', title: 'Male' },
      { id: 'female', title: 'Female' },
    ];
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
          console.log({searchCriteria: this.searchCriteria, isSearchFromQuery: this.isSearchFromQuery});
          
          if (!this.isSearchFromQuery) {
            this.seachFilteredProfiles(this.searchCriteria);
            setTimeout(() => {
              this.formGroup.patchValue(this.searchCriteria);
              console.log('formVal: ', this.formGroup.value);
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
    })
  }

  initFormGroup() {
    this.formGroup = this.fb.group({
      gender: ['', [Validators.required]],
      fromAge: ['', [Validators.required]],
      toAge: ['', [Validators.required]],
      cast: !['', [Validators.required]],
      subcast: ['', ![Validators.required]],
      motherTongue: ['', [Validators.required]]
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
  }

  handleFilter() {
    this.sidebarVisible = false;
    this.seachFilteredProfiles(this.filteredQueryParams);
  }

  seachFilteredProfiles(queryParams: any) {
    const isLogged = this.authService.isLoggedIn();
    if (Object.keys(queryParams).length > 0) {
      if (isLogged) {
        const pageNumber = 1;
        this.userService.getPaidFilteredProfileList(queryParams).subscribe({
          next: (response) => {
            if (response) {
              // const { customerList, totalCount } = response;
              this.filteredProfileList = response;
              // this.totalCount = totalCount;
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
    const value = event?.id;
    switch (src) {
      case 'castId':
        this.isReligionSelected = true;
        this.getCastList(value);
        break;
    }
  }

  get formGroupControl(): { [key: string]: FormControl } {
    return this.formGroup.controls as { [key: string]: FormControl };
  }

  getMasterData() {
    const religionList = this.castService.getReligionList();
    const motherToungeList = this.sharedService.getMotherToungeList();
    forkJoin({ religionList, motherToungeList }).subscribe({
      next: (response: any) => {
        if (response) {
          const { religionList, motherToungeList } = response;
          this.religionList = religionList;
          this.religionList = religionList.map((item: any) => {
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
          this.getCustomerDetails()
        }
      },
      error: (error: any) => {
        this.isError = true;
      }
    })
  }

  getCastList(religionId: number) {
    this.castService.getCastListById(religionId).subscribe({
      next: (response: any) => {
        if (response) {
          const subCastList = response?.subCastList;
          this.castList = subCastList.map((item: any) => {
            return {
              id: item?.subCastId,
              title: item?.subCastName
            }
          });
        }

      },
      error: (error: any) => {
        this.isError = true;
      }
    })
  }

}
