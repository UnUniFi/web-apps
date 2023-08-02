import { StrategyComponent } from './strategy.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GoogleChartsModule } from 'angular-google-charts';
import { PipesModule } from 'projects/portal/src/app/pipes/pipes.module';

@NgModule({
  declarations: [StrategyComponent],
  imports: [CommonModule, RouterModule, GoogleChartsModule, PipesModule],
  exports: [StrategyComponent],
})
export class StrategyModule {}
