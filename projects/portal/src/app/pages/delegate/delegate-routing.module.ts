import { WalletGuard } from '../../models/wallets/wallet.guard';
import { ValidatorComponent } from './validator/validator.component';
import { ValidatorsComponent } from './validators/validators.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'validators',
    component: ValidatorsComponent,
    canActivate: [WalletGuard],
    children: [{ path: ':address', component: ValidatorComponent }],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DelegateRoutingModule {}
