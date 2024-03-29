import { MaterialModule } from '../material.module';
import { IncentiveComponent } from './incentive.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [IncentiveComponent],
  imports: [CommonModule, RouterModule, FormsModule, MaterialModule,PipesModule],
  exports: [IncentiveComponent],
})
export class IncentiveModule {}
