import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KycRoutingModule } from './kyc-routing.module';
import { KycComponent } from './kyc.component';
import { AdminComponent } from './admin/admin.component';


@NgModule({
  declarations: [
    KycComponent,
    AdminComponent
  ],
  imports: [
    CommonModule,
    KycRoutingModule
  ]
})
export class KycModule { }
