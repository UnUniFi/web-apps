import { InterestRateSwapModule } from '../../views/interest-rate-swap/interest-rate-swap.module';
import { InterestRateSwapRoutingModule } from './interest-rate-swap-routing.module';
import { InterestRateSwapComponent } from './interest-rate-swap.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [InterestRateSwapComponent],
  imports: [CommonModule, InterestRateSwapRoutingModule, InterestRateSwapModule],
})
export class AppInterestRateSwapModule {}
