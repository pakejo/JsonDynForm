import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appDynLeaf]',
})
export class DynLeafDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
