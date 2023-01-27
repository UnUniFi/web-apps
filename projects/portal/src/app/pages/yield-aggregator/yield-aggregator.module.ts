import { VaultModule } from '../../views/yield-aggregator/vaults/vault/vault.module';
import { VaultsModule } from '../../views/yield-aggregator/vaults/vaults.module';
import { YieldAggregatorModule } from '../../views/yield-aggregator/yield-aggregator.module';
import { VaultComponent } from './vaults/vault/vault.component';
import { VaultsComponent } from './vaults/vaults.component';
import { YieldAggregatorRoutingModule } from './yield-aggregator-routing.module';
import { YieldAggregatorComponent } from './yield-aggregator.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [YieldAggregatorComponent, VaultsComponent, VaultComponent],
  imports: [
    CommonModule,
    YieldAggregatorRoutingModule,
    YieldAggregatorModule,
    VaultsModule,
    VaultModule,
  ],
})
export class AppYieldAggregatorModule {}
