import { RepayComponent } from './repay.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GoogleChartsModule } from 'angular-google-charts';
import { MaterialModule } from 'projects/portal/src/app/views/material.module';

@NgModule({
  declarations: [RepayComponent],
  imports: [CommonModule, GoogleChartsModule, FormsModule, MaterialModule],
  exports: [RepayComponent],
})
export class RepayModule {}
