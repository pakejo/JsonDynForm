import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { InputParams } from '../../interfaces/InputParams.interface';
import { DynFormService } from '../../services/dyn-form.service';
import { ErrorsService } from '../../services/errors.service';
import { ValidationsService } from '../../services/validations.service';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css'],
})
export class InputComponent implements OnInit {
  name = '';

  label = '';

  icon = '';

  validations!: {
    sync: any[];
    async: any[];
  };

  controlRef!: FormControl;

  @Input() JsonPath = '';

  @Input() set data(value: InputParams) {
    this.name = value.name;
    this.label = value.label;
    this.icon = value.icon;
    this.validations = value.validations;
  }

  constructor(
    private DynFormService: DynFormService,
    private readonly validationService: ValidationsService,
    private readonly errorsService: ErrorsService
  ) {}

  get FormControlRef() {
    return this.controlRef;
  }

  get ControlIsInvalid() {
    return (
      this.controlRef?.invalid &&
      (this.controlRef.dirty || this.controlRef.touched)
    );
  }

  ngOnInit(): void {
    this.controlRef = this.DynFormService.getAbstractControl(
      this.JsonPath
    ) as FormControl;

    this.controlRef.setValidators(
      this.validationService.buildSyncValidations(this.validations.sync)
    );

    this.controlRef.setAsyncValidators(
      this.validationService.buildAsynValidations(this.validations.async)
    );
  }

  getErrorMessage() {
    return this.errorsService.getFieldErrorMessage(this.FormControlRef);
  }
}
