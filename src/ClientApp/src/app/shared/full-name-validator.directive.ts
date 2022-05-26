import {Directive} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, ValidationErrors, Validator} from '@angular/forms';
import { fullNameValidator } from './full-name-validator.validator';

@Directive({
    selector: "[fullNameValid]",
    providers: [{
        provide: NG_VALIDATORS,
        useExisting:fullNameValidDirective,
        multi: true
    }]
})
export class fullNameValidDirective implements Validator {

    validate(control: AbstractControl): ValidationErrors | null {
        return fullNameValidator()(control);
    }
}
