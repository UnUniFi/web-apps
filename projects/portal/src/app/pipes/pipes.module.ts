import { EllipsisPipe } from './address.pipe';
import { CoinAmountPipe } from './coin-amount.pipe';
import { CoinDenomPipe } from './coin-denom.pipe';
import { CoinPipe } from './coin.pipe';
import { DecimalsPipe } from './decimals.pipe';
import { FloorPipe } from './floor.pipe';
import { PercentagePipe } from './percentage.pipe';
import { UnitConversionPipe } from './unit-conversion.pipe';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [
    DecimalsPipe,
    FloorPipe,
    UnitConversionPipe,
    PercentagePipe,
    CoinPipe,
    CoinDenomPipe,
    CoinAmountPipe,
    EllipsisPipe,
  ],
  imports: [CommonModule],
  exports: [
    DecimalsPipe,
    FloorPipe,
    UnitConversionPipe,
    PercentagePipe,
    CoinPipe,
    CoinDenomPipe,
    CoinAmountPipe,
    EllipsisPipe,
  ],
})
export class PipesModule {}
