import { Injectable } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
} from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class DynFormService {
  private form = new FormGroup({});

  constructor() {}

  private addNewAbstractContol(
    key: string,
    path: string,
    control: AbstractControl
  ) {
    const group = path === '' ? this.form : this.form.get(path);

    if (group instanceof FormGroup) {
      group.addControl(key, control, { emitEvent: false });
      return path === '' ? `${key}` : `${path}.${key}`;
    }

    if (group instanceof FormArray) {
      const currentLength = group.length;
      group.push(control, { emitEvent: false });
      return `${path}.${currentLength}`;
    }

    throw new Error(
      `Target path is a control element thus it can not contain children. Path: ${path}`
    );
  }

  addNewFormGroup(key: string, path: string) {
    return this.addNewAbstractContol(key, path, new FormGroup({}));
  }

  addNewFormControl(key: string, path: string, control: FormControl) {
    return this.addNewAbstractContol(key, path, control);
  }

  addNewFormArray(key: string, path: string) {
    return this.addNewAbstractContol(key, path, new FormArray([]));
  }

  getAbstractControl(path: string) {
    return path == '' ? this.form : this.form.get(path);
  }

  getValidationStatus() {
    let validationStatus = {};

    this.extractValidationStatus(this.form, validationStatus);

    return validationStatus;
  }

  private extractValidationStatus(
    control: FormControl | FormGroup | FormArray,
    statusObject: any
  ) {
    const extractBasicData = (ctrl: typeof control, obj: any) => {
      obj.valid = ctrl.valid;
      obj.invalid = ctrl.invalid;
      obj.touched = ctrl.touched;
      obj.untouched = ctrl.untouched;
      obj.errors = ctrl.errors;
    };

    if (control instanceof FormControl) {
      extractBasicData(control, statusObject);
      statusObject.value = control.value;
    } else if (control instanceof FormGroup) {
      extractBasicData(control, statusObject);
      statusObject.errors = control.errors;

      Object.keys(control.controls).forEach((key) => {
        statusObject[key] = {};
        this.extractValidationStatus(
          control.get(key) as any,
          statusObject[key]
        );
      });
    } else if (control instanceof FormArray) {
      extractBasicData(control, statusObject);

      statusObject.controls = [];

      control.controls.forEach((formControl, index) => {
        statusObject.controls[index] = {};
        this.extractValidationStatus(
          formControl as any,
          statusObject.controls[index]
        );
      });
    }
  }
}
