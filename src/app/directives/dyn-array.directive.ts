import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appDynArray]',
})
export class DynArrayDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
