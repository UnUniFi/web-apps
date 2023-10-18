import { AccountComponent } from './account/account.component';
import { AddressComponent } from './yieldaggregator/address/address.component';
import { YieldaggregatorComponent } from './yieldaggregator/yieldaggregator.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'yield-aggregator',
    component: YieldaggregatorComponent,
  },
  {
    path: 'yield-aggregator/:address',
    component: AddressComponent,
  },
  {
    path: ':address',
    component: AccountComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountsRoutingModule {}
