import { ViewBalanceModule } from '../../views/balance/balance.module';
import { BalanceRoutingModule } from './balance-routing.module';
import { BalanceComponent } from './balance.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [BalanceComponent],
  imports: [CommonModule, BalanceRoutingModule, ViewBalanceModule],
})
export class AppBalanceModule {}
