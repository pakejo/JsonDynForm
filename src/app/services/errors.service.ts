import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BasicValidationsErrorMessages } from '../data/basicValidations';

interface ValidationsErrorMessages {
  [key: string]: (formControl: FormControl) => string;
}

@Injectable({
  providedIn: 'root',
})
export class ErrorsService {
  private errorMessages: ValidationsErrorMessages =
    BasicValidationsErrorMessages;

  constructor() {}

  addCustomValidationMessage(
    validationName: string,
    validationMessage: string
  ) {
    this.errorMessages[validationName] = (_formControl: FormControl) =>
      validationMessage;
  }

  /**
   * This function returns the error message associated with a specific form control reference based on
   * the error type.
   * @param {FormControl} formControlRef - The parameter `formControlRef` is a reference to a
   * `FormControl` object. `FormControl` is a class in Angular that is used to track the value and
   * validation status of an individual form control.
   */
  getFieldErrorMessage(formControlRef: FormControl) {
    return Object.entries(this.errorMessages)
      .filter(([key, _]) => formControlRef.hasError(key))
      .map(([_, callback]) => callback(formControlRef))[0];
  }
}
