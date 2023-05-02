import { Injectable } from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormArray,
  AbstractControl,
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
}
