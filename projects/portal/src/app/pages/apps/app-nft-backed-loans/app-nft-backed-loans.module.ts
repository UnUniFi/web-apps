import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppNftBackedLoansRoutingModule } from './app-nft-backed-loans-routing.module';
import { AppNftBackedLoansComponent } from './app-nft-backed-loans.component';


@NgModule({
  declarations: [
    AppNftBackedLoansComponent
  ],
  imports: [
    CommonModule,
    AppNftBackedLoansRoutingModule
  ]
})
export class AppNftBackedLoansModule { }
