import { AppYieldAggregatorModule } from '../../../views/apps/app-yield-aggregator/app-yield-aggregator.module';
import { AppYieldAggregatorRoutingModule } from './app-yield-aggregator-routing.module';
import { AppYieldAggregatorComponent } from './app-yield-aggregator.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [AppYieldAggregatorComponent],
  imports: [CommonModule, AppYieldAggregatorRoutingModule, AppYieldAggregatorModule],
})
export class AppAppYieldAggregatorModule {}
