import { CoinAmountPipe } from './coin-amount.pipe';
import { UnitConversionPipe } from './unit-conversion.pipe';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [UnitConversionPipe, CoinAmountPipe],
  imports: [CommonModule],
  exports: [UnitConversionPipe, CoinAmountPipe],
})
export class PipesModule {}
