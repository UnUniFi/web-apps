import { PipesModule } from '../../pipes/pipes.module';
import { MaterialModule } from '../material.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule, MaterialModule, PipesModule],
  exports: [],
})
export class StakingModule {}
