import { CreateModule } from '../../views/copy-trading/traders/create/create.module';
import { TraderModule } from '../../views/copy-trading/traders/trader/trader.module';
import { TradersModule } from '../../views/copy-trading/traders/traders.module';
import { CopyTradingRoutingModule } from './copy-trading-routing.module';
import { CreateComponent } from './traders/create/create.component';
import { TraderComponent } from './traders/trader/trader.component';
import { TradersComponent } from './traders/traders.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [TradersComponent, TraderComponent, CreateComponent],
  imports: [CommonModule, CopyTradingRoutingModule, TradersModule, TraderModule, CreateModule],
})
export class AppCopyTradingModule {}
