import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppDerivativesRoutingModule } from './app-derivatives-routing.module';
import { AppDerivativesComponent } from './app-derivatives.component';


@NgModule({
  declarations: [
    AppDerivativesComponent
  ],
  imports: [
    CommonModule,
    AppDerivativesRoutingModule
  ]
})
export class AppDerivativesModule { }
