import { DecimalsPipe } from './decimals.pipe';
import { FloorPipe } from './floor.pipe';
import { PercentagePipe } from './percentage.pipe';
import { UnitConversionPipe } from './unit-conversion.pipe';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [DecimalsPipe, FloorPipe, UnitConversionPipe, PercentagePipe],
  imports: [CommonModule],
  exports: [DecimalsPipe, FloorPipe, UnitConversionPipe, PercentagePipe],
})
export class PipesModule {}
