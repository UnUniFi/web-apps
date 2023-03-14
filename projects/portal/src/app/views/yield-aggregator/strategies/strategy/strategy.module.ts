import { StrategyComponent } from './strategy.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [StrategyComponent],
  imports: [CommonModule, RouterModule],
  exports: [StrategyComponent],
})
export class StrategyModule {}
