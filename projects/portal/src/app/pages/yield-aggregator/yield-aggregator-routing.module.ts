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
    path: 'vaults/:vault_id',
    component: VaultComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class YieldAggregatorRoutingModule {}
