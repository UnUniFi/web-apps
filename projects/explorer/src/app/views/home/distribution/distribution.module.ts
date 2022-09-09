import { MaterialModule } from '../../material.module';
import { DistributionComponent } from './distribution.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [DistributionComponent],
  imports: [CommonModule, RouterModule, MaterialModule],
  exports: [DistributionComponent],
})
export class DistributionModule {}
