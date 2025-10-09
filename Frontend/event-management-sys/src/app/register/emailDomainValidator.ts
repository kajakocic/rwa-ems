import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Validator koji proverava da li email završava sa '@gmail.com'
export function emailDomainValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const email = control.value;
    if (email && !email.endsWith('@gmail.com')) {
      return { invalidDomain: { value: control.value } };
    }
    return null; 
  };
}
