import { ViewBalanceModule } from '../../views/balance/balance.module';
import { SendModule } from '../../views/balance/send/send.module';
import { BalanceRoutingModule } from './balance-routing.module';
import { BalanceComponent } from './balance.component';
import { SendComponent } from './send/send.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [BalanceComponent, SendComponent],
  imports: [CommonModule, BalanceRoutingModule, ViewBalanceModule, SendModule],
})
export class AppBalanceModule {}
