import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { InputTextModule } from 'primeng/inputtext';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DynArrayComponent } from './components/dyn-array/dyn-array.component';
import { DynGroupComponent } from './components/dyn-group/dyn-group.component';
import { InputComponent } from './components/input/input.component';
import { LayoutComponent } from './components/layout/layout.component';
import { DynArrayDirective } from './directives/dyn-array.directive';
import { DynGroupDirective } from './directives/dyn-group.directive';
import { DynLeafDirective } from './directives/dyn-leaf.directive';

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    InputComponent,
    DynGroupDirective,
    DynArrayDirective,
    DynLeafDirective,
    DynGroupComponent,
    DynArrayComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    InputTextModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
