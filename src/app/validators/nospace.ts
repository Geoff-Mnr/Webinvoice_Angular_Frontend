import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function nospaceValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value) {
      const hasSpace = (control.value as string).indexOf(" ") >= 0;
      return hasSpace ? { nospace: true } : null;
    }
    return null;
  };
}
