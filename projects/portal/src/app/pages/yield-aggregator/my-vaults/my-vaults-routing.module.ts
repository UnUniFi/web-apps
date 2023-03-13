import { CreateComponent } from './create/create.component';
import { MyVaultsComponent } from './my-vaults.component';
import { VaultComponent } from './vault/vault.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: MyVaultsComponent,
  },
  {
    path: 'create',
    component: CreateComponent,
  },
  {
    path: 'vaults/:vaultId',
    component: VaultComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyVaultsRoutingModule {}
