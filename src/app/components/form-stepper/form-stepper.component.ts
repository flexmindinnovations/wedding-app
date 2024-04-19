import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChange, SimpleChanges, inject } from '@angular/core';
import { ActionValue, FormStep } from 'src/app/interfaces/form-step-item';
import { StepperFormItem } from 'src/app/interfaces/stepper-form';
import { FormStepperService } from 'src/app/services/form-stepper.service';
import { COLOR_SCHEME, stepperThemeVariables } from 'src/app/util/theme';
import { APP_LOADER } from 'src/app/util/util';

@Component({
  selector: 'form-stepper',
  templateUrl: './form-stepper.component.html',
  styleUrls: ['./form-stepper.component.scss'],
})
export class FormStepperComponent implements OnInit, OnChanges, OnDestroy {

  @Input() completedStepInfo: FormStep | any;
  @Input() isDataAvailable: boolean = false;
  colorScheme: any = COLOR_SCHEME;
  registrationSteps: StepperFormItem[] = [];
  formStepperService = inject(FormStepperService);
  loaderType = APP_LOADER;

  currentStepData!: FormStep;
  themesParams = stepperThemeVariables['lastItem'];

  colorVarients: any;
  constructor() {
    this.setCurrentClass();
  }

  ngOnInit() {
    this.getFormStepperItems();
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    const currentValue = simpleChanges['completedStepInfo']?.currentValue;
    if (currentValue) this.handleStepperDirection(currentValue);
  }

  handleStepperDirection(value: any) {
    this.currentStepData = value;
    if (value.action === ActionValue.previous) this.proceedToPreviousStep(value);
    else this.proceedToNextStep(value);
  }

  proceedToPreviousStep(stepData: FormStep) {
    this.registrationSteps.forEach((item: StepperFormItem) => item.isActive = false);
    const previousPage: any = stepData?.formId - 1;
    const previousItemIndex = this.registrationSteps.findIndex((item: StepperFormItem) => item.id === (previousPage >= 1 ? previousPage : previousPage));
    this.registrationSteps[previousItemIndex].isActive = true;
  }

  proceedToNextStep(stepData: FormStep) {
    this.registrationSteps.forEach((item: StepperFormItem) => item.isActive = false);
    const totalSteps = this.registrationSteps.length;
    const nextPage: any = stepData?.formId < totalSteps ? stepData?.formId + 1 : stepData?.formId;
    const nextItemIndex = this.registrationSteps.findIndex((item: StepperFormItem) => item.id === nextPage);
    this.registrationSteps[nextItemIndex].isActive = true;
    this.registrationSteps[nextItemIndex - 1].isCompleted = stepData.isCompleted;
  }

  getFormStepperItems() {
    this.formStepperService.getFormStepperItems().subscribe((items: StepperFormItem[]) => {
      this.registrationSteps = items.map((item: StepperFormItem) => {
        if (item.id === 1) {
          item.isActive = true;
        }
        return item;
      });
    })
  }

  setCurrentClass() {
    const colorScheme = localStorage.getItem('color-scheme');
    this.colorScheme = colorScheme ? colorScheme : this.colorScheme;
    this.colorVarients = stepperThemeVariables[this.colorScheme];
  }

  handleOnStepperClick(step: StepperFormItem) {
    // console.log('step: ', step);

  }

  ngOnDestroy(): void {
    this.registrationSteps = [];
  }
}
