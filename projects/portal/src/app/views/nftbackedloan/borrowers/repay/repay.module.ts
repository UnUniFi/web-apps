import { RepayComponent } from './repay.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PipesModule } from 'projects/portal/src/app/pipes/pipes.module';
import { MaterialModule } from 'projects/portal/src/app/views/material.module';

@NgModule({
  declarations: [RepayComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MaterialModule,
    PipesModule,
  ],
  exports: [RepayComponent],
})
export class RepayModule {}
