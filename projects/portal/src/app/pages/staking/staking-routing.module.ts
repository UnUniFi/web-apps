import { WalletGuard } from '../../models/wallets/wallet.guard';
import { CreateValidatorComponent } from './create-validator/create-validator.component';
import { StakingComponent } from './staking.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: StakingComponent,
    canActivate: [WalletGuard],
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
