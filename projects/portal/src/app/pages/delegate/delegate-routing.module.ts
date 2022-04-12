import { WalletGuard } from '../../models/wallets/wallet.guard';
import { DelegateComponent } from './delegate.component';
import { ValidatorComponent } from './validator/validator.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: DelegateComponent,
    canActivate: [WalletGuard],
  },
  {
    path: 'validators',
    children: [{ path: ':address', component: ValidatorComponent }],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DelegateRoutingModule {}
