import { StrategyComponent } from './strategy.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GoogleChartsModule } from 'angular-google-charts';

@NgModule({
  declarations: [StrategyComponent],
  imports: [CommonModule, RouterModule, GoogleChartsModule],
  exports: [StrategyComponent],
})
export class StrategyModule {}
