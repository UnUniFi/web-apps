import { MaterialModule } from '../../../material.module';
import { CollateralParamComponent } from './collateral-param.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PipesModule } from 'projects/portal/src/app/pipes/pipes.module';

@NgModule({
  declarations: [CollateralParamComponent],
  imports: [CommonModule, MaterialModule, PipesModule],
  exports: [CollateralParamComponent],
})
export class CollateralParamModule {}
