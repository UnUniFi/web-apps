import { MaterialModule } from '../../material.module';
import { PerpetualFuturesComponent } from './perpetual-futures.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MarketComponent } from './market/market.component';

@NgModule({
  declarations: [PerpetualFuturesComponent, MarketComponent],
  imports: [CommonModule, RouterModule, FormsModule, MaterialModule],
  exports: [PerpetualFuturesComponent, MarketComponent],
})
export class PerpetualFuturesModule {}
