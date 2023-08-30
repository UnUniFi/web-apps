import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustodianRoutingModule } from './custodian-routing.module';
import { CustodianComponent } from './custodian.component';


@NgModule({
  declarations: [
    CustodianComponent
  ],
  imports: [
    CommonModule,
    CustodianRoutingModule
  ]
})
export class CustodianModule { }
