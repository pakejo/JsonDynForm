import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynGroupDirective } from 'src/app/directives/dyn-group.directive';
import { DynFormService } from 'src/app/services/dyn-form.service';
import { ObjectChildsAreObjects } from 'src/app/utils/objects-utils';
import { FormRenderer } from '../../classes/FormRenderer';
import { Layouts } from 'src/app/enums/layouts.enum';

@Component({
  selector: 'app-dyn-group',
  templateUrl: './dyn-group.component.html',
  styleUrls: ['./dyn-group.component.css'],
})
export class DynGroupComponent implements OnInit {
  @Input() JsonPath: string = '';
  @Input() name: string = '';
  @Input() data: any;
  @Input() classes: string = '';
  @ViewChild(DynGroupDirective, { static: true }) group!: DynGroupDirective;

  public formGroupRef!: FormGroup;

  constructor(private DynFormService: DynFormService) {}

  ngOnInit(): void {
    this.formGroupRef = this.DynFormService.getAbstractControl(
      this.JsonPath
    ) as FormGroup;

    const renderer = new FormRenderer(
      this.group.viewContainerRef,
      this.DynFormService
    );

    Object.entries(this.data).forEach(([key, entryContent]) => {
      if (key === Layouts.FLayout) {
        const { config, content } = entryContent as any;

        renderer.RenderLayout(this.JsonPath, config, content);
      } else if (ObjectChildsAreObjects(entryContent)) {
        renderer.RenderGroup(this.JsonPath, key, entryContent, this.classes);
      } else {
        renderer.RenderControl(this.JsonPath, key, entryContent);
      }
    });
  }
}
