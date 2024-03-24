import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { AlertType } from 'src/app/enums/alert-types';
import { ISpecialization } from 'src/app/interfaces/IEducation';
import { AlertService } from 'src/app/services/alert/alert.service';
import { EducationService } from 'src/app/services/education/education.service';
import { RoleAccessService } from 'src/app/services/role-access.service';

@Component({
  selector: 'app-add-edit-education',
  templateUrl: './add-edit-education.component.html',
  styleUrls: ['./add-edit-education.component.scss'],
})
export class AddEditEducationComponent implements OnInit, OnDestroy {

  @Input() data: any;
  isEditMode: boolean = false;

  formGroup!: FormGroup;
  modalControllerService = inject(ModalController);
  accessRolesDataService = inject(RoleAccessService);
  educationService = inject(EducationService);
  alert = inject(AlertService);
  accessRoleData: any[] = [];
  hasSpecializationToggle = false;
  educationId = 0;
  specializationFormGroup!: FormArray;

  specializationList: any[] = [
    { id: 1, name: 'Specialization Name', specializationName: '' }
  ];

  constructor(
    private fb: FormBuilder
  ) {
  }

  ngOnInit() {
    this.initFormGroup();
    const data = this.data?.data;
    this.isEditMode = data?.isEditMode;
    if (this.isEditMode) this.patchFormData();
  }

  patchFormData() {
    const modalData = this.data?.data?.rowData;
    this.educationId = modalData?.educationId;
    this.hasSpecializationToggle = modalData?.hasSpecialization;
    const specializationList = this.formGroup.get('specializationList') as FormArray;
    specializationList.clear();
    this.educationService.getSpecializationListByEducationId(modalData?.educationId).subscribe({
      next: (data: any) => {
        if (data) {
          this.specializationList = data.map((item: any) => {
            item['name'] = 'Specialization Name';
            item['educationId'] = this.educationId;
            return item;
          });
          const props = {
            hasSpecialization: this.hasSpecializationToggle,
            educationName: modalData?.educationName
          }
          this.formGroup.patchValue(props);
          this.specializationList.forEach((specialization: any) => {
            specializationList.push(
              this.fb.group({
                specializationName: specialization?.specializationName ? specialization?.specializationName : ''
              })
            )
          })
        }
      },
      error: (error) => {
        this.alert.setAlertMessage(error?.message, AlertType.error);
      }
    })
  }

  initFormGroup() {
    this.formGroup = this.fb.group({
      hasSpecialization: !['', [Validators.required]],
      educationName: ['', [Validators.required]],
      specializationList: this.fb.array([])
    })
    const specializationArray = this.formGroup.get('specializationList') as FormArray;
    const newSpecializationGroup = this.fb.group({
      specializationName: ['']
    });
    specializationArray.push(newSpecializationGroup);
    this.specializationFormGroup = specializationArray;
  }

  get formGroupControl(): { [key: string]: FormControl } {
    return this.formGroup.controls as { [key: string]: FormControl };
  }

  get specializationListGroup(): FormArray {
    return this.formGroup.get('specializationList') as FormArray;
  }


  handleInputValue(event: string, item: any, index: number) {
    const control = item?.get('specializationName');
    if (control) control.setValue(event);
    this.specializationList[index].specializationName = event;
  }

  handleButtonClick(event: any) {
    if (event?.isCancel) {
      this.modalControllerService.dismiss({ event: 'cancel' });
      return;
    }
    if (this.educationId > 0) this.updateCourseDetails();
    else this.addNewCourse();
  }

  addNewCourse() {
    let formVal: any = { ...this.formGroup.value, educationId: 0 };
    formVal['specializationList'] = this.specializationList.map((item: any) => {
      const obj = {
        specializationId: 0,
        educationId: 0,
        specializationName: item?.specializationName
      }
      return obj;
    });

    this.educationService.addNewCourse(formVal).subscribe({
      next: (data: any) => {
        if (data) {
          this.alert.setAlertMessage(data?.message, data?.status === true ? AlertType.success : AlertType.warning);
          this.modalControllerService.dismiss({ event: 'add' });
        }
      },
      error: (error) => {
        this.alert.setAlertMessage(error?.message, AlertType.error);
      }
    })
  }

  updateCourseDetails() {
    let formVal: any = { ...this.formGroup.value, educationId: this.educationId };
    formVal['specializationList'] = this.specializationList.map((item: any) => {
      return {
        specializationId: item.specializationId ? item.specializationId : 0,
        educationId: this.educationId ? this.educationId : 0,
        specializationName: item?.specializationName
      }
    });
    this.educationService.updateCourse(formVal).subscribe({
      next: (data: any) => {
        if (data) {
          this.alert.setAlertMessage(data?.message, data?.status === true ? AlertType.success : AlertType.warning);
          this.modalControllerService.dismiss({ event: 'update' });
        }
      },
      error: (error) => {
        this.alert.setAlertMessage(error?.message, AlertType.error);
      }
    })
  }

  handleEducationStateChange(event: any) {
    const value = event?.currentTarget.checked;
    this.hasSpecializationToggle = value;
  }

  handleAddRowClick(event: any) {
    const maxId = this.specializationList.reduce((max, obj) => obj.id > max ? obj.id : max, this.specializationList[0].id);
    const newItem = { id: maxId + 1, name: 'Specialization Name', specializationName: '' }
    this.specializationList.push(newItem);
    const specializationListGroup = this.formGroup.get('specializationList') as FormArray;
    const specializationGroup = this.fb.group({
      specializationName: [''],
    });
    specializationListGroup.push(specializationGroup);
    this.specializationFormGroup = specializationListGroup;
  }

  handleRemoveRowClick(event: any) {
    this.specializationList.splice(event, 1);
    this.specializationFormGroup.controls.splice(event, 1);
  }

  ngOnDestroy() {
    this.specializationList = [];
  }

}
