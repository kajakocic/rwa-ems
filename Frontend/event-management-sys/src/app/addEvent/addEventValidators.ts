import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function dateNotExpiredValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const date = new Date(control.value);
    const today = new Date();

    // Ako je datum u prošlosti, validacija je neuspela
    if (date < today) {
      return { expiredDate: true };
    }

    return null;
  };
}

export function priceValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const price = control.value;

    // Ako je cena manja od 0, validacija je neuspešna
    if (price < 0) {
      return { negativePrice: true };
    }

    return null; 
  };
}
