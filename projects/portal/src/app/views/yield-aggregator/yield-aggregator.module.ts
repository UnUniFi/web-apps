import { MaterialModule } from '../material.module';
import { YieldAggregatorComponent } from './yield-aggregator.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { GoogleChartsModule } from 'angular-google-charts';

@NgModule({
  declarations: [YieldAggregatorComponent],
  imports: [CommonModule, RouterModule, FormsModule, MaterialModule, GoogleChartsModule],
  exports: [YieldAggregatorComponent],
})
export class YieldAggregatorModule {}
