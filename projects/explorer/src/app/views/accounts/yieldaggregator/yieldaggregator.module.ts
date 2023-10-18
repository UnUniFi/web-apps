import { YieldaggregatorComponent } from './yieldaggregator.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PipesModule } from 'projects/portal/src/app/pipes/pipes.module';

@NgModule({
  declarations: [YieldaggregatorComponent],
  imports: [CommonModule, RouterModule, PipesModule],
  exports: [YieldaggregatorComponent],
})
export class YieldaggregatorModule {}
