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
            sync: [
              {
                type: 'required',
              },
              {
                type: 'custom',
                name: 'custom validation',
                value: [
                  'and',
                  [
                    ['value', 'greater_than', 0],
                    [
                      'or',
                      [
                        ['value', 'starts_with', '40'],
                        ['value', 'ends_with', '1'],
                      ],
                    ],
                  ],
                ],
              },
            ],
            async: [
              {
                type: 'custom',
                name: 'custom val 2',
                url: 'https://pokeapi.co/api/v2/pokemon/pikachu/',
                value: ['and', [['value', 'equal', '$.species.name']]],
              },
            ],
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
          // options: [
          //   {display: 'Yes', value: true},
          //   {display: 'No', value: false},
          // ]
          options: {
            url: 'https://restcountries.com/v3.1/all',
            path: '$.name.common',
            sortOrder: 'desc',
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
