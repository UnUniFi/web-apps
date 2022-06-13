import { PipesModule } from '../../../../pipes/pipes.module';
import { MaterialModule } from '../../../material.module';
import { DistributionComponent } from './distribution.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule as PortalMaterialModule } from 'projects/portal/src/app/views/material.module';

@NgModule({
  declarations: [DistributionComponent],
  imports: [CommonModule, RouterModule, MaterialModule, PortalMaterialModule, PipesModule],
  exports: [DistributionComponent],
})
export class DistributionModule {}
