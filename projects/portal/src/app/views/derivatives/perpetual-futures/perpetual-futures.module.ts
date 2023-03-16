import { PipesModule } from '../../../pipes/pipes.module';
import { MaterialModule } from '../../material.module';
import { MarketComponent } from './market/market.component';
import { PerpetualFuturesComponent } from './perpetual-futures.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [PerpetualFuturesComponent, MarketComponent],
  imports: [CommonModule, RouterModule, FormsModule, MaterialModule, PipesModule],
  exports: [PerpetualFuturesComponent, MarketComponent],
})
export class PerpetualFuturesModule {}
