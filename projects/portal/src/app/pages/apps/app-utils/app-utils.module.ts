import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppUtilsRoutingModule } from './app-utils-routing.module';
import { AppUtilsComponent } from './app-utils.component';


@NgModule({
  declarations: [
    AppUtilsComponent
  ],
  imports: [
    CommonModule,
    AppUtilsRoutingModule
  ]
})
export class AppUtilsModule { }
