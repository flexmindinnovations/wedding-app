import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Optional, Output, Self, SimpleChanges, ViewChild, inject } from '@angular/core';
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
  @Input() labelColor: string = 'text-white';
  @Input() type: InputType = 'text';
  @Input() formControlName: string = '';
  @Input() control!: FormControl | any;
  @Input() fill: 'solid' | 'outline' = 'outline';
  @Input() isMultiline: boolean = false;
  @Input() showClear: boolean = false;
  @Input('required') isRequired: true | false = false;
  @Input() placeholder: string = '';
  @Input() controlValue: string = '';
  @Input() presentaion: 'date' | 'time' | 'date-time' | undefined;
  @Output() inputValue: EventEmitter<string> = new EventEmitter();
  @Output() handleEnterKeyEvent: EventEmitter<any> = new EventEmitter();
  value: any;
  id = uuidv4();
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
    this.formatInputData();
    this.cdr.detectChanges();
    this.inputSubscription = this.sharedService.resetControl().subscribe((reset: any) => {
      this.inputValue.emit('');
      this.control.reset();
      this.hasValue = false;
      setTimeout(() => {
        this.inputSubscription.unsubscribe();
      }, 2000)
    })
  }

  formatInputData() {
    this.hasValue = true;
    if (this.type === 'date') {
      this.value = this.value ? new Date(this.value) : new Date();
    }
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
    const value = event?.target?.value ? event?.target?.value : event;
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

  onEnterKeyPressed() {
    this.handleEnterKeyEvent.emit(true);
  }

  ngOnDestroy(): void {
    this.value = '';
    this.controlValue = '';
    this.inputSubscription.unsubscribe();
  }
}

export type InputType = 'text' | 'password' | 'email' | 'number' | 'date' | 'time';