import { InterestRateSwapComponent } from './interest-rate-swap.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [InterestRateSwapComponent],
  imports: [CommonModule, RouterModule],
  exports: [InterestRateSwapComponent],
})
export class InterestRateSwapModule {}
