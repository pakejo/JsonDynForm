import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DynFormService } from 'src/app/services/dyn-form.service';
import { SelectOption } from '../interfaces/SelectOption.interface';
import { SelectParams } from '../interfaces/SelectParams.interface';
import { Observable } from 'rxjs';
import { FetchService } from '../../services/fetch.service';

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
  @Input() JsonPath: string = '';

  @Input() set data(value: SelectParams) {
    this.label = value.label;

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
    private readonly fetchService: FetchService
  ) {}

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
  }

  getErrorMessage() {
    return 'Generic Error Message';
  }

  setFirstOptionAsDefault() {
    this.controlRef.setValue((this.options as SelectOption[])[0].value, {
      emitEvent: false,
    });
  }
}
