import { Component, OnInit, Input, inject } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { AlertType } from 'src/app/enums/alert-types';
import { AlertService } from 'src/app/services/alert/alert.service';
import { HandycapService } from 'src/app/services/handycap/handycap.service';


@Component({
  selector: 'app-add-edit-handycap',
  templateUrl: './add-edit-handycap.component.html',
  styleUrls: ['./add-edit-handycap.component.scss'],
})
export class AddEditHandycapComponent implements OnInit {

  @Input() data: any;
  isEditMode: boolean = false;
  formGroup: any;
  modalControllerService = inject(ModalController);
  accessHandycapDataService = inject(HandycapService);
  alert = inject(AlertService);
  alreadyHandycapList: any;
  handycapId = 0;
  constructor(
    private fb: FormBuilder
  ) {
  }

  ngOnInit() {
    this.initFormGroup();
    const data = this.data?.data;
    this.alreadyHandycapList = data?.alreadyHandicapList;
    this.isEditMode = data?.isEditMode;
    if (this.isEditMode) this.patchFormData();
  }

  patchFormData() {
    const modalData = this.data?.data?.rowData;
    this.handycapId = modalData?.id;
    const props = {
      disablity: modalData?.handycapName,
    }
    this.formGroup.patchValue(props);
  }

  initFormGroup() {
    this.formGroup = this.fb.group({
      disablity: ['', [Validators.required]],
    })

    this.formGroup.valueChanges.subscribe((event: any) => {
      const val = event
      console.log('val: ', val);
    })
  }
  get formGroupControl(): { [key: string]: FormControl } {
    return this.formGroup.controls as { [key: string]: FormControl };
  }

  handleButtonClick(event: any) {
    if (event?.isCancel) {
      this.modalControllerService.dismiss({ event: 'cancel' });
      return;
    }

    if (this.handycapId > 0) this.updateHandycap();
    else this.addNewHandycap();

  }

  addNewHandycap() {
    let formVal = this.formGroup.value;
    formVal = { handycapId: 0, handycapName: formVal.disablity };
    if (this.alreadyHandycapList.includes(formVal.handycapName)) {
      this.alert.setAlertMessage(`${formVal.handycapName} Already exists`, AlertType.warning);
    }
    else {
      this.accessHandycapDataService.saveHandycap(formVal).subscribe({
        next: (data: any) => {
          if (data) {
            this.alert.setAlertMessage(data?.message, data?.status === true ? AlertType.success : AlertType.warning);
            this.modalControllerService.dismiss({ event: 'add' });
          }
        },
        error: (error) => {
          console.log('error: ', error);
          this.alert.setAlertMessage(error?.message, AlertType.error);
        }
      })
    }

  }

  updateHandycap() {
    let formVal = this.formGroup.value;
    formVal = { handycapId: this.handycapId, handycapName: formVal.disablity };
    if (this.alreadyHandycapList.includes(formVal.handycapName)) {
      this.alert.setAlertMessage(`${formVal.handycapName} Already exists`, AlertType.warning);
    }
    else {
      this.accessHandycapDataService.updateHandycap(this.handycapId, formVal).subscribe({
        next: (data: any) => {
          if (data) {
            this.alert.setAlertMessage(data?.message, data?.status === true ? AlertType.success : AlertType.warning);
            this.modalControllerService.dismiss({ event: 'update' });
          }
        },
        error: (error) => {
          console.log('error: ', error);
          this.alert.setAlertMessage(error?.message, AlertType.error);
        }
      })
    }
  }

  handleClickOnNext(src: string) {
    throw new Error('Method not implemented.');
  }

}

