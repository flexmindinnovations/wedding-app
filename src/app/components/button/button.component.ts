import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { COLOR_SCHEME, buttonThemeVariables, iconSize, themeVariables } from 'src/app/util/theme';

@Component({
  selector: 'mt-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})

export class ButtonComponent implements OnInit {
  @Input() title: string = '';
  @Input() icon: string = '';
  @Input() textOnly = false;
  @Input() iconOnly = false;
  @Input() buttonType: ButtonTypes = 'default';
  @Input('iconSlot') iconSlot: 'start' | 'end' = 'start';
  @Input('disabled') isDisabled = false;
  @Input() size: ButtonSize = 'lg';
  @Input() isCancel: boolean = false;
  colorScheme: any = COLOR_SCHEME;
  colorVarients: any;
  cancelButtonStyle: any;
  iconSize: string = '';

  @Output() action = new EventEmitter();
  constructor() { }

  ngOnInit() {
    this.setCurrentClass();
  }

  setCurrentClass() {
    const colorScheme = localStorage.getItem('color-scheme');
    this.colorScheme = colorScheme ? colorScheme : this.colorScheme;
    this.colorVarients = buttonThemeVariables[this.colorScheme][this.size];
    this.cancelButtonStyle = `px-5 text-gray-700 rounded-md shadow-none hover:bg-gray-100 hover:text-gray-700 border border-gray-500 disabled:bg-transparent disabled:hover:bg-transparent disabled:cursor-not-allowed`;
    this.iconSize = iconSize[this.size];
  }


  handleButtonClick() {
    this.action.emit({ isCancel: this.isCancel });
  }
}

export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonTypes = 'normal' | 'default' | 'danger' | 'success';
