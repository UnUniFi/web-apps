import { InterestRateSwapModule } from '../../views/interest-rate-swap/interest-rate-swap.module';
import { PoolModule } from '../../views/interest-rate-swap/pools/pool/pool.module';
import { PoolsModule } from '../../views/interest-rate-swap/pools/pools.module';
import { SimplePoolModule } from '../../views/interest-rate-swap/simple-pools/simple-pool/simple-pool.module';
import { SimplePoolsModule } from '../../views/interest-rate-swap/simple-pools/simple-pools.module';
import { SimpleVaultModule } from '../../views/interest-rate-swap/simple-vaults/simple-vault/simple-vault.module';
import { SimpleVaultsModule } from '../../views/interest-rate-swap/simple-vaults/simple-vaults.module';
import { VaultModule } from '../../views/interest-rate-swap/vaults/vault/vault.module';
import { VaultsModule } from '../../views/interest-rate-swap/vaults/vaults.module';
import { InterestRateSwapRoutingModule } from './interest-rate-swap-routing.module';
import { InterestRateSwapComponent } from './interest-rate-swap.component';
import { PoolComponent } from './pools/pool/pool.component';
import { PoolsComponent } from './pools/pools.component';
import { SimplePoolComponent } from './simple-pools/simple-pool/simple-pool.component';
import { SimplePoolsComponent } from './simple-pools/simple-pools.component';
import { SimpleVaultComponent } from './simple-vaults/simple-vault/simple-vault.component';
import { SimpleVaultsComponent } from './simple-vaults/simple-vaults.component';
import { VaultComponent } from './vaults/vault/vault.component';
import { VaultsComponent } from './vaults/vaults.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [
    InterestRateSwapComponent,
    VaultsComponent,
    VaultComponent,
    SimpleVaultsComponent,
    SimpleVaultComponent,
    PoolsComponent,
    PoolComponent,
    SimplePoolsComponent,
    SimplePoolComponent,
  ],
  imports: [
    CommonModule,
    InterestRateSwapRoutingModule,
    InterestRateSwapModule,
    VaultsModule,
    VaultModule,
    SimpleVaultsModule,
    SimpleVaultModule,
    PoolsModule,
    PoolModule,
    SimplePoolsModule,
    SimplePoolModule,
  ],
})
export class AppInterestRateSwapModule {}
