import { InterestRateSwapModule } from '../../views/interest-rate-swap/interest-rate-swap.module';
import { VaultsModule } from '../../views/interest-rate-swap/vaults/vaults.module';
import { InterestRateSwapRoutingModule } from './interest-rate-swap-routing.module';
import { InterestRateSwapComponent } from './interest-rate-swap.component';
import { VaultsComponent } from './vaults/vaults.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [InterestRateSwapComponent, VaultsComponent],
  imports: [CommonModule, InterestRateSwapRoutingModule, InterestRateSwapModule, VaultsModule],
})
export class AppInterestRateSwapModule {}
