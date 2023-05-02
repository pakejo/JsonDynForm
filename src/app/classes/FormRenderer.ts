import { ViewContainerRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DynFormService } from 'src/app/services/dyn-form.service';
import { DynArrayComponent } from '../components/dyn-array/dyn-array.component';
import { DynGroupComponent } from '../components/dyn-group/dyn-group.component';
import { InputComponent } from '../components/input/input.component';
import {
  FlayoutConfig,
  LayoutContent,
} from '../components/interfaces/FlayoutConfig.interface';
import { LayoutComponent } from '../components/layout/layout.component';
import { IRenderizable } from './IRenderizable';

export class FormRenderer implements IRenderizable {
  constructor(
    public viewContainerRef: ViewContainerRef,
    public DynFormService: DynFormService
  ) {}

  RenderLayout(
    path: string,
    config: FlayoutConfig,
    content: LayoutContent
  ): void {
    const layoutComponent =
      this.viewContainerRef.createComponent(LayoutComponent);
    layoutComponent.setInput('JsonPath', path);
    layoutComponent.setInput('config', config);
    layoutComponent.setInput('content', content);
  }

  RenderArray(path: string, name: string, data: any[], classes: string): void {
    const arrayPath = this.DynFormService.addNewFormArray(name, path);

    const arrayComponent =
      this.viewContainerRef.createComponent(DynArrayComponent);

    arrayComponent.setInput('JsonPath', arrayPath);
    arrayComponent.setInput('name', name);
    arrayComponent.setInput('data', data);
    arrayComponent.setInput('classes', classes);
  }

  RenderGroup(path: string, name: string, data: any, classes: string): void {
    const groupPath = this.DynFormService.addNewFormGroup(name, path);

    const groupComponent =
      this.viewContainerRef.createComponent(DynGroupComponent);

    groupComponent.setInput('JsonPath', groupPath);
    groupComponent.setInput('name', name);
    groupComponent.setInput('data', data);
    groupComponent.setInput('classes', classes);
  }

  RenderControl(path: string, name: string, data: any): void {
    const inputPath = this.DynFormService.addNewFormControl(
      name,
      path,
      new FormControl()
    );

    const componentRef = this.viewContainerRef.createComponent(InputComponent);

    // Set component input
    componentRef.setInput('JsonPath', inputPath);
    componentRef.setInput('data', data);
  }
}
