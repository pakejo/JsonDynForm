import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynFormService } from './services/dyn-form.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'JsonDynForm';

  public data = {
    FLayout: {
      config: {
        direction: 'flex-column',
        alignment: {
          x: 'justify-content-center',
          y: 'center',
        },
        gap: '1',
      },
      content: {
        Input: {
          type: 'Input',
          name: 'FirstInput',
          label: 'Input',
          validations: {
            sync: [],
            async: [],
          },
        },
        Select: {
          type: 'Select',
          name: 'FirstSelect',
          label: 'Select',
          validations: {
            sync: [],
            async: [],
          },
          options: [
            {display: 'Yes', value: true},
            {display: 'No', value: false},
          ]
        },
      },
    },
  };

  constructor(private DynFormService: DynFormService) {}

  get FormGroup() {
    return this.DynFormService.getAbstractControl('') as FormGroup;
  }
}
