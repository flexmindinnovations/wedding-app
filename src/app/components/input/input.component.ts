import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Optional, Output, Self, ViewChild, inject } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormControl, NgControl } from '@angular/forms';
import { SharedService } from 'src/app/services/shared.service';
import { COLOR_SCHEME, inputThemeVariables } from 'src/app/util/theme';
import { v4 as uuidv4 } from 'uuid';

declare var Datepicker: any;
@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})

export class InputComponent implements OnInit, AfterViewInit, OnDestroy, ControlValueAccessor {

  @Input() label: string = '';
  @Input() type: 'text' | 'password' | 'email' | 'number' | 'date' = 'text';
  @Input() formControlName: string = '';
  @Input() control!: FormControl | any;
  @Input() fill: 'solid' | 'outline' = 'outline';
  @Input() isMultiline: boolean = false;
  @Input('required') isRequired: true | false = false;
  @Input() placeholder: string = '';
  @Input() controlValue: string = '';
  @Input() presentaion: 'date' | 'time' | 'date-time' | undefined;
  @Output() inputValue: EventEmitter<string> = new EventEmitter();
  value: any;
  pickerFormat: string = 'DD MM YYYY';
  hasValue: boolean = false;
  cdr = inject(ChangeDetectorRef);

  sharedService = inject(SharedService);

  onChange(value: any) { }
  onTouched() { }

  colorScheme: any = COLOR_SCHEME;
  colorVarients: any;

  invalidControl = ' border-red-700 bg-red-200';
  validControl = ' border-gray-300 bg-gray-50';
  datePicker: any;
  datePickerId = uuidv4();
  showPassword: boolean = false;
  passwordToggleIcon = 'eye-outline';
  inputSubscription: any;

  constructor(
    @Self()
    @Optional()
    public ngControl: NgControl
  ) {
    ngControl.valueAccessor = this;
    this.setCurrentClass();
  }

  ngOnInit(): void {
    this.placeholder = this.placeholder ? this.placeholder : this.label ? 'Enter ' + this.label : '';
  }

  ngAfterViewInit(): void {
    const control: any = this.control;
    const controlName = (Object.keys(control.parent.controls).find(key => control.parent.controls[key] === control));
    if (this.value || this.controlValue) this.formatInputData(controlName);
    this.cdr.detectChanges();
    const dtEl: any = document.getElementById(this.datePickerId);
    if (this.type === 'date') this.initDatePicker(dtEl);

    this.inputSubscription = this.sharedService.resetControl().subscribe((reset: any) => {
      console.log('reset: ', reset);
      
      this.inputValue.emit('');
      this.control.reset();
      // this.control.patchValue('');
      // this.control.setValue('');
      this.hasValue = false;

      setTimeout(() => {
        this.inputSubscription.unsubscribe();
      }, 2000)
    })
  }

  formatInputData(controlName: any) {
    this.hasValue = true;
    if (this.type === 'date') {
      this.value = this.value ? new Date(this.value).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
    }
  }

  initDatePicker(element: any) {
    const today = new Date();
    element.value = this.value ? new Date(this.value).toISOString().split('T')[0] : today.toISOString().split('T')[0];
  }

  setCurrentClass() {
    const colorScheme = localStorage.getItem('color-scheme');
    this.colorScheme = colorScheme ? colorScheme : this.colorScheme;
    this.colorVarients = inputThemeVariables[this.colorScheme];
  }

  writeValue(obj: any): void {
    this.value = obj;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    // this.disabled = isDisabled;
  }
  handleOnChange(event: any, src?: string) {
    const value = src === 'time' ? event : event.target.value;
    this.hasValue = !!value;
    const formattedValue = src === 'dt' ? new Date(value).toLocaleDateString('en-GB') : value;
    this.inputValue.emit(formattedValue);
    this.onChange(value);
  }

  handlePasswordVisiblity() {
    this.showPassword = !this.showPassword;
    this.passwordToggleIcon = this.passwordToggleIcon === 'eye-outline' ? 'eye-off-outline' : 'eye-outline';
    this.type = this.showPassword ? 'text' : 'password';
  }

  ngOnDestroy(): void {
    this.value = '';
    this.controlValue = '';
    this.inputSubscription.unsubscribe();
  }
}
