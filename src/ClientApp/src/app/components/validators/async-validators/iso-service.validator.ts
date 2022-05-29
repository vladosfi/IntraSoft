import { AbstractControl, AsyncValidatorFn } from "@angular/forms";
import { map } from "rxjs";
import { IsoService } from "../../../core/services/iso.service";

export function isoServiceValidator(isoService: IsoService): AsyncValidatorFn {
    return (control: AbstractControl) => {
        return isoService.getIsoServices()
            .pipe(
                map(isoServicesFromRepo => {
                    const isoServiceResult = isoServicesFromRepo.find(is => is.number.toLowerCase() 
                    == control.value.toLowerCase());

                    return isoServiceResult ? {numberExist: true} : null;
                })
            )
    }
}