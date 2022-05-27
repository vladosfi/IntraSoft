import {Directive, Input} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, ValidationErrors, Validator} from '@angular/forms';
import { fullNameValidator } from './validators';


@Directive({
    selector: "[fullNameValid]",
    providers: [{
        provide: NG_VALIDATORS,
        useExisting:fullNameValidatorDirective,
        multi: true
    }]
})
export class fullNameValidatorDirective implements Validator {
    validate(control: AbstractControl): ValidationErrors | null {
        return fullNameValidator()(control);
    }
}
