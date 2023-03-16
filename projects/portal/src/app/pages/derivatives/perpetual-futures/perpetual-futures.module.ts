import { PerpetualFuturesModule } from '../../../views/derivatives/perpetual-futures/perpetual-futures.module';
import { PerpetualFuturesRoutingModule } from './perpetual-futures-routing.module';
import { PerpetualFuturesComponent } from './perpetual-futures.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MarketComponent } from './market/market.component';

@NgModule({
  declarations: [PerpetualFuturesComponent, MarketComponent],
  imports: [CommonModule, PerpetualFuturesRoutingModule, PerpetualFuturesModule],
})
export class AppPerpetualFuturesModule {}
