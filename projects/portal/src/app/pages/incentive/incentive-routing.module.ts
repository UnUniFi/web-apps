import { WalletGuard } from '../../models/wallets/wallet.guard';
import { IncentiveComponent } from './incentive.component';
import { UnitComponent } from './units/unit/unit.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: IncentiveComponent,
    canActivate: [WalletGuard],
  },
  {
    path: 'units/:unit_id',
    component: UnitComponent,
    canActivate: [WalletGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IncentiveRoutingModule {}
