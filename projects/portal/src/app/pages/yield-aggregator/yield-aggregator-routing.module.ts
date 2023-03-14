import { StrategiesComponent } from './strategies/strategies.component';
import { StrategyComponent } from './strategies/strategy/strategy.component';
import { CreateComponent } from './vaults/create/create.component';
import { OwnerComponent } from './vaults/owner/owner.component';
import { VaultComponent } from './vaults/vault/vault.component';
import { VaultsComponent } from './vaults/vaults.component';
import { YieldAggregatorComponent } from './yield-aggregator.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: YieldAggregatorComponent,
  },
  {
    path: 'vaults',
    component: VaultsComponent,
  },
  {
    path: 'vaults/create',
    component: CreateComponent,
  },
  {
    path: 'vaults/owner/:address',
    component: OwnerComponent,
  },
  {
    path: 'vaults/:vault_id',
    component: VaultComponent,
  },
  {
    path: 'strategies',
    component: StrategiesComponent,
  },
  {
    path: 'strategies/:strategy_id',
    component: StrategyComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class YieldAggregatorRoutingModule {}
