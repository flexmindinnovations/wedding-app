import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Optional, Output, Self, ViewChild, inject } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';
import { COLOR_SCHEME, dropdownThemeVariables } from 'src/app/util/theme';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
})
export class DropdownComponent implements OnInit, AfterViewInit, ControlValueAccessor {

  cdr = inject(ChangeDetectorRef);


  toggleIcon: any = 'down';
  isOpen: boolean = false;
  @Input() label: string = '';
  @Input() labelColor: string = 'text-white';
  @Input() formControlName: string = '';
  @Input() control!: FormControl;
  @Input() fill: 'solid' | 'outline' = 'outline';
  @Input() cssClasses: any;
  @Input() options: any[] = [];
  @Input() isMultiSelect: boolean = false;
  @Input() controlValue: any;

  @Output() onSelectionChange: any = new EventEmitter();
  value: any;
  @Input() buttonId = uuidv4();
  @Input() menuId: any = uuidv4();
  id = uuidv4();
  @Input() dropdownId: string = ''
  searchQuery: string = '';
  filteredOptions: any = [];

  isNumberValue: boolean = false;

  invalidControl = ' border-red-700 bg-red-200';
  validControl = ' border-gray-300 bg-gray-50';


  onChange(value: any) { }
  onTouched() { }


  isVisible = false;
  itemValue: any;

  colorScheme: any = COLOR_SCHEME;
  colorVarients: any;
  dropdownIcon = 'chevron-down-outline';
  dropdown: any;

  dropdownOptions: any = {
    placement: 'bottom',
    triggerType: 'click',
    offsetSkidding: 0,
    offsetDistance: 10,
    delay: 300,
    ignoreClickOutsideClass: false,
    onHide: () => {
      this.isVisible = false;
      this.dropdownIcon = this.isVisible ? 'chevron-up-outline' : 'chevron-down-outline';
    },
    onShow: () => {
      // console.log('dropdown has been shown');
    },
    onToggle: () => {
      this.dropdownIcon = this.isVisible ? 'chevron-up-outline' : 'chevron-down-outline';
    },
  }

  @ViewChild('triggerButton', { static: true }) triggerButton!: ElementRef;
  @ViewChild('menuEl', { static: true }) menuEl!: ElementRef;
  menuWidth: any;

  constructor(
    @Self()
    @Optional()
    public ngControl: NgControl
  ) {
    ngControl.valueAccessor = this;
    this.setCurrentClass();
  }

  setCurrentClass() {
    const colorScheme = localStorage.getItem('color-scheme');
    this.colorScheme = colorScheme ? colorScheme : this.colorScheme;
    this.colorVarients = dropdownThemeVariables[this.colorScheme];
  }

  ngOnInit() {
    this.filteredOptions = JSON.parse(JSON.stringify(this.options));
    setTimeout(() => {
      if (this.controlValue) {
        const selectedValue = this.options.find((item: any) => item[this.getId()] === this.controlValue);
        if (selectedValue) {
          this.onSelectionChange.emit(selectedValue);
          this.value = selectedValue;
        }
      }
    })
  }

  getId() {
    let idKey = 'id';
    switch (this.label) {
      case 'Specialization':
        idKey = 'specializationId';
        break;
    }

    return idKey;
  }

  ngAfterViewInit(): void {
    if (this.options.length) {
      const value = this.control.value;
      const itemVlue = this.options.filter((item: any) => item.id === value);
      if (itemVlue?.length) this.itemValue = itemVlue[0];
      this.cdr.detectChanges();
    }
  }

  handleToggle() {
    this.isOpen = !this.isOpen;
    this.toggleIcon = this.isOpen ? 'up' : 'down';
  }

  writeValue(obj: any): void {
    this.value = obj;
    this.onChange(obj?.id);
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

  handleOnChange(event: any) {
    const value = event.target.value;
    this.onChange(value);
  }

  handleDropdownToggle() {
  }

  onItemChange(event: any) {
    const value = event?.value;
    this.onSelectionChange.emit(event?.value);
    this.writeValue(event?.value);
  }

  handleSearchQuery(event: any) {
    let searchText = event?.target?.value;
    if (searchText) {
      const filteredData = this.options.filter((item: any) => {
        return item.title.toLowerCase().includes(searchText.toLowerCase());
      })
      this.filteredOptions = [...filteredData];
    } else {
      this.filteredOptions = [...this.options];
    }
  }
}