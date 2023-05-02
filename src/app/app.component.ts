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
    'F-layout': {
      config: {
        direction: 'flex-column',
        alignment: {
          x: 'justify-content-center',
          y: 'center',
        },
        gap: '1',
      },
      content: {
        'F-layout': {
          config: {
            direction: 'flex-column',
            alignment: {
              x: 'justify-content-around',
              y: 'center',
            },
            gap: '1',
          },
          content: {
            array: [
              {
                key: 'Input1',
                type: 'Input',
                name: 'Input test 1',
                placeholder: 'Input 1',
                validations: {
                  sync: [],
                  async: [],
                },
              },
              {
                key: 'Input4',
                type: 'Input',
                name: 'Input test 4',
                placeholder: 'Input 4',
                validations: {
                  sync: [],
                  async: [],
                },
              },
              {
                key: 'Input6',
                type: 'Input',
                name: 'Input test 6',
                placeholder: 'Input 6',
                validations: {
                  sync: [],
                  async: [],
                },
              },
            ],
          },
        },
        singleControl: {
          type: 'Input',
          name: 'FirstTest',
          placeholder: 'Input 3',
          validations: {
            sync: [],
            async: [],
          },
        },
      },
    },
  };

  constructor(private DynFormService: DynFormService) {}

  get FormGroup() {
    return this.DynFormService.getAbstractControl('') as FormGroup;
  }
}
