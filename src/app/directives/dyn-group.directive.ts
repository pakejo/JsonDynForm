import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appDynGroup]',
})
export class DynGroupDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
