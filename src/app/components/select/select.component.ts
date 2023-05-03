import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DynFormService } from 'src/app/services/dyn-form.service';
import { SelectOption } from '../interfaces/SelectOption.interface';
import { SelectParams } from '../interfaces/SelectParams.interface';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.css'],
})
export class SelectComponent {
  label: string = '';
  options: SelectOption[] = [];
  controlRef!: FormControl;
  @Input() JsonPath: string = '';

  @Input() set data(value: SelectParams) {
    this.label = value.label;
    this.options = value.options;
  }

  constructor(private DynFormService: DynFormService) {}

  get FormControlRef() {
    return this.controlRef;
  }

  get ControlIsInvalid() {
    return this.controlRef?.invalid && this.controlRef.touched;
  }

  ngOnInit(): void {
    this.controlRef = this.DynFormService.getAbstractControl(
      this.JsonPath
    ) as FormControl;

    this.controlRef.setValue(this.options[0].value, { emitEvent: false });
  }

  getErrorMessage() {
    return 'Generic Error Message';
  }
}
