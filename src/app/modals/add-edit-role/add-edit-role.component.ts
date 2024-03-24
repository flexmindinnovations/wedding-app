import { Component, Input, OnInit, inject, AfterViewInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Console } from 'console';
import { debounceTime, forkJoin, of } from 'rxjs';
import { AlertType } from 'src/app/enums/alert-types';
import { AlertService } from 'src/app/services/alert/alert.service';
import { RoleAccessService } from 'src/app/services/role-access.service';
import { RolesService } from 'src/app/services/role/roles.service';

@Component({
  selector: 'app-add-edit-role',
  templateUrl: './add-edit-role.component.html',
  styleUrls: ['./add-edit-role.component.scss'],
})
export class AddEditRoleComponent implements OnInit, AfterViewInit {

  @Input() data: any;
  isEditMode: boolean = false;
  formGroup!: FormGroup;
  modalControllerService = inject(ModalController);
  accessRolesDataService = inject(RoleAccessService);
  accessRoleData: any[] = [];
  alert = inject(AlertService);
  roleService = inject(RolesService)
  existingRoles: any[] = [];
  isRoleExists: boolean = false;
  alreadyRoleList: any;
  roleId = 0;
  permissionId = 0;

  constructor(
    private fb: FormBuilder
  ) {
  }
  ngAfterViewInit(): void {

  }

  ngOnInit() {
    this.getRoleAccessData();
    this.initFormGroup();
    const data = this.data?.data;
    this.alreadyRoleList = data?.alreadyRolesList;
  }


  patchFormData() {
    const modalData = this.data?.data?.rowData;;
    this.roleId = modalData?.roleId;

    this.roleService.getPermissionListById(this.roleId).subscribe({
      next: (data: any) => {
        if (data) {
          data?.forEach((item: any) => {
            const itemIndex = this.accessRoleData.findIndex((row) => row.id === item?.moduleId);
            this.permissionId = item?.permissionId;
            if (itemIndex > -1) {
              this.accessRoleData[itemIndex] = {
                "id": item?.moduleId,
                "permissionId": item?.permissionId,
                "moduleName": item?.moduleName,
                "enabled": item?.canView,
                "actions": [
                  { "action": "Can Add", "enabled": item?.canAdd },
                  { "action": "Can Edit", "enabled": item?.canEdit },
                  { "action": "Can Delete", "enabled": item?.canDelete }
                ]
              }
            }
          })
        }
      },
      error: (error) => {
        console.log('error: ', error);
        this.alert.setAlertMessage(error?.message, AlertType.error);
      }
    })
    const props = {
      roleName: modalData?.roleName
    }
    this.formGroup.patchValue(props);
  }

  getRoleAccessData() {
    const moduleList = this.accessRolesDataService.getModuleList();
    const roleList = this.accessRolesDataService.getRoleList();
    forkJoin({ moduleList, roleList }).subscribe({
      next: (response: any) => {
        if (response) {
          const { moduleList, roleList } = response;
          this.existingRoles = roleList;
          if (moduleList?.length) {
            const moduleListMapper = moduleList.map((item: any) => {
              return {
                "id": item?.moduleId,
                "moduleName": item?.moduleName,
                "enabled": false,
                "actions": [
                  { "action": "Can Add", "enabled": false },
                  { "action": "Can Edit", "enabled": false },
                  { "action": "Can Delete", "enabled": false }
                ]
              }
            })
            this.accessRoleData = moduleListMapper;
            const data = this.data?.data;
            this.isEditMode = data?.isEditMode;
            if (this.isEditMode) this.patchFormData();
          }
        }
      },
      error: (error) => {
        this.alert.setAlertMessage(error?.message, AlertType.error);
      }
    })
  }


  initFormGroup() {
    this.formGroup = this.fb.group({
      roleName: ['', [Validators.required]],
      roleAccess: !['', [Validators.required]],
    })
  }

  get formGroupControl(): { [key: string]: FormControl } {
    return this.formGroup.controls as { [key: string]: FormControl };
  }

  handleInputChange(event: string) {
    of(event)
      .pipe(
        debounceTime(2000),
      ).subscribe((val: any) => {
        this.isRoleExists = this.isRoleNameExists(val);
        if (this.isRoleExists) {
          this.formGroup.get('roleName')?.setErrors({ 'alreadytExists': '' });
        }
      })
  }

  isRoleNameExists(roleName: string): boolean {
    return this.existingRoles.some((item: any) => item.roleName === roleName);
  }

  handleButtonClick(event: any) {
    if (event?.isCancel) {
      this.modalControllerService.dismiss();
      return;
    }

    const rolePayload = {
      roleId: this.roleId,
      roleName: this.formGroup.get('roleName')?.value,
      permissionList: this.getPermissionList(this.roleId)
    };
    if (this.roleId > 0) this.updateRole(rolePayload);
    else this.addNewRole(rolePayload);

  }


  updateRole(rolePayload: any) {
    this.roleService.updateRole(rolePayload).subscribe({
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

  addNewRole(rolePayload: any) {
    if (this.alreadyRoleList.includes(rolePayload.roleName)) {
      this.alert.setAlertMessage(`${rolePayload.roleName} Already exists`, AlertType.warning);
    } else {
      this.roleService.saveRole(rolePayload).subscribe({
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


  getPermissionList(roleId: number) {
    const permissionList = this.accessRoleData.map((item: any) => {
      const canAdd = item.actions.filter((access: any) => access.action.replace(' ', '').toLowerCase() === 'canadd')[0].enabled;
      const canEdit = item.actions.filter((access: any) => access.action.replace(' ', '').toLowerCase() === 'canedit')[0].enabled;
      const canDelete = item.actions.filter((access: any) => access.action.replace(' ', '').toLowerCase() === 'candelete')[0].enabled;
      return {
        permissionId: item.permissionId ? item.permissionId : 0,
        moduleId: item?.id,
        moduleName: item?.moduleName,
        roleId,
        canView: item.enabled,
        canAdd,
        canEdit,
        canDelete
      }
    })

    return permissionList;
  }

  handleParentStateChange(event: any, item: any) {
    const value = event?.currentTarget.checked;
    item.enabled = value;
    item.actions.forEach((action: any) => action.enabled = value);
  }

  handleChildStateChange(event: any, item: any) {
    const value = event?.currentTarget.checked;
    item.enabled = value;
  }

}
