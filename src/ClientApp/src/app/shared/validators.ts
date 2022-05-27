import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

// export function fullNameValidator(): ValidatorFn {
//     return (control: AbstractControl): ValidationErrors | null => {


//         const fullNameValid = (fullName.length === 2 || fullName.length === 3) && fullName;

//         return !fullNameValid ? { fullName: true } : null;
//     }
// }


// export function fullNameValidator(): ValidatorFn {
//     return (control:AbstractControl) : ValidationErrors | null => {
//     //const fullName = control.value.trim().split(/[\s,]+/);

//     if (control.get('fullName') == null) return;

//     const fullName = control.get('fullName').value.trim().split(/[\s,]+/);

//     const fullNameValid = fullName.length === 2 || fullName.length === 3;

//     return fullNameValid ? { fullName: true } : null;
//   }
// };


export function fullNameValidator(): ValidatorFn {
  return (c: AbstractControl): ValidationErrors | null => {
    const fullName = c.value.trim().split(/[\s,]+/);
    const fullNameIsValid = fullName.length === 2 || fullName.length === 3;
    return fullNameIsValid ? null : { fullNameValid: { value: c.value } };
  }
}