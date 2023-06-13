import { MaterialModule } from '../../../material.module';
import { DistributionComponent } from './distribution.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PipesModule } from 'projects/portal/src/app/pipes/pipes.module';

@NgModule({
  declarations: [DistributionComponent],
  imports: [CommonModule, RouterModule, MaterialModule, PipesModule],
  exports: [DistributionComponent],
})
export class DistributionModule {}
