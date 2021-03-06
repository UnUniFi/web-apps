import { WalletGuard } from '../../models/wallets/wallet.guard';
import { CreateValidatorMultipleComponent } from './create-validator-multiple/create-validator-multiple.component';
import { CreateValidatorSimpleComponent } from './create-validator-simple/create-validator-simple.component';
import { CreateValidatorComponent } from './create-validator/create-validator.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'create-validator/simple',
    component: CreateValidatorSimpleComponent,
  },
  {
    path: 'create-validator/multiple',
    component: CreateValidatorMultipleComponent,
  },
  {
    path: 'create-validator',
    component: CreateValidatorComponent,
    canActivate: [WalletGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StakingRoutingModule {}
