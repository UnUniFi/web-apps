import { MaterialModule } from '../../../material.module';
import { StakingComponent } from './staking.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PipesModule } from 'projects/portal/src/app/pipes/pipes.module';

@NgModule({
  declarations: [StakingComponent],
  imports: [CommonModule, RouterModule, MaterialModule, PipesModule],
  exports: [StakingComponent],
})
export class StakingModule {}
