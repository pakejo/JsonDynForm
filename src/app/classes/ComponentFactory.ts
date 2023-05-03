import { ViewContainerRef } from '@angular/core';
import { ComponentTypes } from '../enums/componentsTypes.enum';
import { InputComponent } from '../components/input/input.component';
import { SelectComponent } from '../components/select/select.component';

export class ComponentFactory {
  public static create(container: ViewContainerRef, type: string) {
    switch (type.toUpperCase()) {
      case ComponentTypes.INPUT:
        return container.createComponent(InputComponent);
      case ComponentTypes.SELECT:
        return container.createComponent(SelectComponent);

      default:
        return null;
    }
  }
}
