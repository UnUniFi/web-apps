import { InterestRateSwapComponent } from './interest-rate-swap.component';
import { PoolComponent } from './pools/pool/pool.component';
import { PoolsComponent } from './pools/pools.component';
import { SimplePoolComponent } from './simple-pools/simple-pool/simple-pool.component';
import { SimplePoolsComponent } from './simple-pools/simple-pools.component';
import { SimpleVaultComponent } from './simple-vaults/simple-vault/simple-vault.component';
import { SimpleVaultsComponent } from './simple-vaults/simple-vaults.component';
import { ContractVaultsComponent } from './vaults/contract-vaults/contract-vaults.component';
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
    path: 'vaults/:contract',
    component: ContractVaultsComponent,
  },
  {
    path: 'vaults/:contract/:id',
    component: VaultComponent,
  },
  {
    path: 'simple-vaults',
    component: SimpleVaultsComponent,
  },
  {
    path: 'simple-vaults/:contract',
    component: SimpleVaultComponent,
  },
  {
    path: 'pools',
    component: PoolsComponent,
  },
  {
    path: 'pools/:contract/:id',
    component: PoolComponent,
  },
  {
    path: 'simple-pools',
    component: SimplePoolsComponent,
  },
  {
    path: 'simple-pools/:contract',
    component: SimplePoolComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InterestRateSwapRoutingModule {}
