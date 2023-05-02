import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appDynComponent]',
})
export class DynComponentDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
