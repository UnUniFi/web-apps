import { AppInterestRateSwapModule } from '../../../views/apps/app-interest-rate-swap/app-interest-rate-swap.module';
import { AppInterestRateSwapRoutingModule } from './app-interest-rate-swap-routing.module';
import { AppInterestRateSwapComponent } from './app-interest-rate-swap.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { VaultsComponent } from './vaults/vaults.component';

@NgModule({
  declarations: [AppInterestRateSwapComponent, VaultsComponent],
  imports: [CommonModule, AppInterestRateSwapRoutingModule, AppInterestRateSwapModule],
})
export class AppAppInterestRateSwapModule {}
