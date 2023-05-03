import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DynFormService } from '../../services/dyn-form.service';
import { InputParams } from '../interfaces/InputParams.interface';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css'],
})
export class InputComponent implements OnInit {
  name = '';

  label = '';

  icon = '';

  controlRef!: FormControl;

  @Input() JsonPath = '';

  @Input() set data(value: InputParams) {
    this.name = value.name;
    this.label = value.label;
    this.icon = value.icon;
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
  }

  getErrorMessage() {
    return 'Generic Error Message';
  }
}
