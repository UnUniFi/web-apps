import { InterestRateSwapComponent } from './interest-rate-swap.component';
import { PoolComponent } from './pools/pool/pool.component';
import { PoolsComponent } from './pools/pools.component';
import { VaultComponent } from './vaults/vault/vault.component';
import { VaultsComponent } from './vaults/vaults.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: InterestRateSwapComponent,
  },
  {
    path: 'vaults',
    component: VaultsComponent,
  },
  {
    path: 'vaults/:id',
    component: VaultComponent,
  },
  {
    path: 'pools',
    component: PoolsComponent,
  },
  {
    path: 'pools/:id',
    component: PoolComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InterestRateSwapRoutingModule {}
