import { WalletGuard } from '../../models/wallets/wallet.guard';
import { UnjailSimpleComponent } from './unjail-simple/unjail-simple.component';
import { UnjailComponent } from './unjail/unjail.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'unjail/simple',
    component: UnjailSimpleComponent,
  },
  {
    path: 'unjail',
    component: UnjailComponent,
    canActivate: [WalletGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SlashingRoutingModule {}
