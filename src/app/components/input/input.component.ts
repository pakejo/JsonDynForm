import { Component, Input, OnInit } from '@angular/core';
import { DynFormService } from '../../services/dyn-form.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css'],
})
export class InputComponent implements OnInit {
  name = '';

  placeholder = '';

  validations = [];

  @Input() JsonPath = '';

  @Input() set data(value: any) {
    this.name = value.name;
    this.placeholder = value.placeholder;
  }

  constructor(private DynFormService: DynFormService) {}

  get FormControlRef() {
    return this.DynFormService.getAbstractControl(this.JsonPath) as FormControl;
  }

  ngOnInit(): void {}
}
