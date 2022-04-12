import { UnitConversionPipe } from './unit-conversion.pipe';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [UnitConversionPipe],
  imports: [CommonModule],
  exports: [UnitConversionPipe],
})
export class PipesModule {}
