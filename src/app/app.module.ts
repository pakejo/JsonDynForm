import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClientModule } from '@angular/common/http';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DynArrayComponent } from './components/dyn-array/dyn-array.component';
import { DynGroupComponent } from './components/dyn-group/dyn-group.component';
import { InputComponent } from './components/input/input.component';
import { LayoutComponent } from './components/layout/layout.component';
import { SelectComponent } from './components/select/select.component';
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
    SelectComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    InputTextModule,
    DropdownModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
