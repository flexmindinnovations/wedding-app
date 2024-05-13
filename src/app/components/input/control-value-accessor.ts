import { Injectable, Injector, Input, ViewChild } from "@angular/core";
import { ControlContainer, ControlValueAccessor, FormControl, FormControlDirective } from "@angular/forms";

@Injectable()
export class ControlValueAccessorConnector implements ControlValueAccessor {

    @ViewChild(FormControlDirective, { static: true })
    formControlDirective!: FormControlDirective;

    @Input()
    formControl: FormControl | any;

    @Input()
    formControlName!: string | any;

    get control() {
        return this.formControl || this.controlContainer?.control?.get(this.formControlName);
    }

    get controlContainer() {
        return this.injector.get(ControlContainer);
    }

    constructor(private injector: Injector) { }

    writeValue(obj: any): void {
        return this.formControlDirective?.valueAccessor?.writeValue(obj);
    }
    registerOnChange(fn: any): void {
        return this.formControlDirective?.valueAccessor?.registerOnChange(fn);
    }
    registerOnTouched(fn: any): void {
        return this.formControlDirective?.valueAccessor?.registerOnTouched(fn);
    }
    setDisabledState(isDisabled: boolean): void {
        // this.formControlDirective.valueAccessor.setDisabledState(isDisabled);
    }
}