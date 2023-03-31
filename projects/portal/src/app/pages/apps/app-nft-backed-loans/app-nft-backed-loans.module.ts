import { AppNftBackedLoansModule } from '../../../views/apps/app-nft-backed-loans/app-nft-backed-loans.module';
import { AppNftBackedLoansRoutingModule } from './app-nft-backed-loans-routing.module';
import { AppNftBackedLoansComponent } from './app-nft-backed-loans.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [AppNftBackedLoansComponent],
  imports: [CommonModule, AppNftBackedLoansRoutingModule, AppNftBackedLoansModule],
})
export class AppAppNftBackedLoansModule {}
