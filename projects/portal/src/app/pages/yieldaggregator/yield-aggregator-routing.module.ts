import { WalletGuard } from '../../models/wallets/wallet.guard';
import { StrategiesComponent } from './strategies/strategies.component';
import { StrategyComponent } from './strategies/strategy/strategy.component';
import { CreateComponent } from './vaults/create/create.component';
import { DepositComponent } from './vaults/deposit/deposit.component';
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
    canActivate: [WalletGuard],
  },
  {
    path: 'vaults/owner/:address',
    component: OwnerComponent,
  },
  {
    path: 'vaults/deposit/:address',
    component: DepositComponent,
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
    path: 'strategies/:denom',
    component: StrategiesComponent,
  },
  {
    path: 'strategies/:denom/:strategy_id',
    component: StrategyComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class YieldAggregatorRoutingModule {}
