import { FormControl, Validators } from '@angular/forms';
import { validateIBAN } from 'ngx-iban-validator';

export const BasicValidations = {
  required: (_value: string) => Validators.required,
  requiredTrue: (_value: string) => Validators.requiredTrue,
  email: (_value: string) => Validators.email,
  min: (value: number) => Validators.min(value),
  max: (value: number) => Validators.max(value),
  minLength: (value: number) => Validators.minLength(value),
  maxLength: (value: number) => Validators.maxLength(value),
  pattern: (value: string | RegExp) => Validators.pattern(value),
  IBAN: (_value: string) => validateIBAN,
  custom: (_value: string) => null,
};

export const BasicValidationsErrorMessages = {
  required: (_formControl: FormControl) => 'The field can not be empty',
  requiredTrue: (_formControl: FormControl) => 'The field can not be empty',
  email: (_formControl: FormControl) => 'Invalid email format',
  min: (formControl: FormControl) =>
    `Value should be greater than ${formControl.getError('min')?.min}`,
  max: (formControl: FormControl) =>
    `Value should be smaller than ${formControl.getError('max')?.max}`,
  minLength: (formControl: FormControl) =>
    `Value length should be greater than ${
      formControl.getError('minlength')?.requiredLength
    }`,
  maxLength: (formControl: FormControl) =>
    `Value length should be smaller than ${
      formControl.getError('maxlength')?.requiredLength
    }`,
  pattern: (formControl: FormControl) =>
    `Value does not match pattern ${
      formControl.getError('pattern')?.requiredPattern
    }`,
  IBAN: (_formControl: FormControl) => 'Invalid IBAN',
};
