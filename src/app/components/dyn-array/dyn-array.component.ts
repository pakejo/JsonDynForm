import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormRenderer } from 'src/app/classes/FormRenderer';
import { DynArrayDirective } from 'src/app/directives/dyn-array.directive';
import { Layouts } from 'src/app/enums/layouts.enum';
import { DynFormService } from 'src/app/services/dyn-form.service';
import { ObjectChildsAreObjects } from 'src/app/utils/objects-utils';

@Component({
  selector: 'app-dyn-array',
  templateUrl: './dyn-array.component.html',
  styleUrls: ['./dyn-array.component.css'],
})
export class DynArrayComponent implements OnInit {
  @Input() JsonPath: string = '';
  @Input() name: string = '';
  @Input() data: any[] = [];
  @Input() classes: string = '';
  @ViewChild(DynArrayDirective, { static: true }) array!: DynArrayDirective;

  public parentFormGroupRef!: FormGroup;

  constructor(private DynFormService: DynFormService) {}

  ngOnInit(): void {
    this.parentFormGroupRef = this.DynFormService.getAbstractControl(
      this.JsonPath
    )?.parent as FormGroup;

    const renderer = new FormRenderer(
      this.array.viewContainerRef,
      this.DynFormService
    );

    this.data.forEach((entry) => {
      if (entry.key === Layouts.FLayout) {
        const { config, content } = entry as any;
        renderer.RenderLayout(this.JsonPath, config, content);
      } else if (ObjectChildsAreObjects(entry)) {
        renderer.RenderGroup(this.JsonPath, entry.key, entry, this.classes);
      } else {
        renderer.RenderControl(this.JsonPath, entry.key, entry);
      }
    });
  }
}
