import { InterestRateSwapModule } from '../../views/interest-rate-swap/interest-rate-swap.module';
import { PoolModule } from '../../views/interest-rate-swap/pools/pool/pool.module';
import { PoolsModule } from '../../views/interest-rate-swap/pools/pools.module';
import { VaultsModule } from '../../views/interest-rate-swap/vaults/vaults.module';
import { InterestRateSwapRoutingModule } from './interest-rate-swap-routing.module';
import { InterestRateSwapComponent } from './interest-rate-swap.component';
import { PoolComponent } from './pools/pool/pool.component';
import { PoolsComponent } from './pools/pools.component';
import { VaultsComponent } from './vaults/vaults.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [InterestRateSwapComponent, VaultsComponent, PoolsComponent, PoolComponent],
  imports: [
    CommonModule,
    InterestRateSwapRoutingModule,
    InterestRateSwapModule,
    VaultsModule,
    PoolsModule,
    PoolModule,
  ],
})
export class AppInterestRateSwapModule {}
