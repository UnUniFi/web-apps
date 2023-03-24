import { StrategiesModule } from '../../views/yield-aggregator/strategies/strategies.module';
import { StrategyModule } from '../../views/yield-aggregator/strategies/strategy/strategy.module';
import { CreateModule } from '../../views/yield-aggregator/vaults/create/create.module';
import { OwnerModule } from '../../views/yield-aggregator/vaults/owner/owner.module';
import { VaultModule } from '../../views/yield-aggregator/vaults/vault/vault.module';
import { VaultsModule } from '../../views/yield-aggregator/vaults/vaults.module';
import { YieldAggregatorModule } from '../../views/yield-aggregator/yield-aggregator.module';
import { StrategiesComponent } from './strategies/strategies.component';
import { StrategyComponent } from './strategies/strategy/strategy.component';
import { CreateComponent } from './vaults/create/create.component';
import { OwnerComponent } from './vaults/owner/owner.component';
import { VaultComponent } from './vaults/vault/vault.component';
import { VaultsComponent } from './vaults/vaults.component';
import { YieldAggregatorRoutingModule } from './yield-aggregator-routing.module';
import { YieldAggregatorComponent } from './yield-aggregator.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [
    YieldAggregatorComponent,
    VaultsComponent,
    VaultComponent,
    CreateComponent,
    OwnerComponent,
    StrategiesComponent,
    StrategyComponent,
  ],
  imports: [
    CommonModule,
    YieldAggregatorRoutingModule,
    YieldAggregatorModule,
    VaultsModule,
    VaultModule,
    CreateModule,
    OwnerModule,
    StrategiesModule,
    StrategyModule,
  ],
})
export class AppYieldAggregatorModule {}