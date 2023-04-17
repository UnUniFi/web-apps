import { RepayComponent } from './repay.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { GoogleChartsModule } from 'angular-google-charts';
import { PipesModule } from 'projects/portal/src/app/pipes/pipes.module';
import { MaterialModule } from 'projects/portal/src/app/views/material.module';

@NgModule({
  declarations: [RepayComponent],
  imports: [
    CommonModule,
    GoogleChartsModule,
    FormsModule,
    RouterModule,
    MaterialModule,
    PipesModule,
  ],
  exports: [RepayComponent],
})
export class RepayModule {}
