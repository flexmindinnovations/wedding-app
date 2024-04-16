import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AlertType } from 'src/app/enums/alert-types';
import { AlertService } from 'src/app/services/alert/alert.service';
import { CastService } from 'src/app/services/cast/cast.service';
import { SharedService } from 'src/app/services/shared.service';

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
  

  constructor(
    private router: Router,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.initFormGroup();
    this.genderOptions = [
      { id: 'male', title: 'Male' },
      { id: 'female', title: 'Female' },
    ];
  }

  ngAfterViewInit(): void {
    this.getMasterData();
  }

  initFormGroup() {
    this.formGroup = this.fb.group({
      gender: ['', [Validators.required]],
      fromAge: !['', [Validators.required]],
      toAge: !['', [Validators.required]],
      cast: !['', [Validators.required]],
      subcast: !['', ![Validators.required]],
      motherTongue: !['', [Validators.required]]
    })
  }

  get formGroupControl(): { [key: string]: FormControl } {
    return this.formGroup.controls as { [key: string]: FormControl };
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

  handleOnSearch() {
    const formVal = this.formGroup.value;
    if(this.formGroup.invalid) {
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
        }
      },
      error: (error: any) => {
        console.log('error: ', error);

      }
    })
  }

  getCastList(religionId: number) {
    this.castService.getCastListById(religionId).subscribe({
      next: (response: any) => {
        if (response) {
          console.log('response: ', response);

          const subCastList = response?.subCastList;
          console.log('subCastList: ', subCastList);

          this.castList = subCastList.map((item: any) => {
            return {
              id: item?.subCastId,
              title: item?.subCastName
            }
          });
        }

      },
      error: (error: any) => {
        console.log('error: ', error);

      }
    })
  }

}
