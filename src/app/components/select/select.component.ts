import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DynFormService } from '../../services/dyn-form.service';
import { ValidationsService } from '../../services/validations.service';
import { SelectOption } from '../../interfaces/SelectOption.interface';
import { SelectParams } from '../../interfaces/SelectParams.interface';
import { FetchService } from '../../services/fetch.service';
import { ErrorsService } from '../../services/errors.service';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.css'],
})
export class SelectComponent {
  private isAsync = false;

  private fetchUrl: string = '';
  private fetchPath: string | undefined;
  private sortOrder: string | undefined;

  label: string = '';
  options!: SelectOption[];
  controlRef!: FormControl;
  validations!: {
    sync: any[];
    async: any[];
  };
  @Input() JsonPath: string = '';

  @Input() set data(value: SelectParams) {
    this.label = value.label;
    this.validations = value.validations;

    if (Array.isArray(value.options)) {
      this.options = value.options;
    } else {
      this.isAsync = true;

      this.fetchUrl = value.options.url;
      this.fetchPath = value.options.path;
      this.sortOrder = value.options.sortOrder;
    }
  }

  constructor(
    private DynFormService: DynFormService,
    private readonly fetchService: FetchService,
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

    if (this.isAsync) {
      this.fetchService
        .fetchDataList(this.fetchUrl, this.fetchPath, this.sortOrder)
        .subscribe((values) => {
          this.options = values;
          this.setFirstOptionAsDefault();
        });
    } else {
      this.setFirstOptionAsDefault();
    }

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

  setFirstOptionAsDefault() {
    this.controlRef.setValue((this.options as SelectOption[])[0].value, {
      emitEvent: false,
    });
  }
}
