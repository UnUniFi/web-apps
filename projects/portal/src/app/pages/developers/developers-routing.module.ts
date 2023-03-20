import { WalletDeveloperGuard } from '../../models/wallets/wallet-developer.guard';
import { DevelopersComponent } from './developers.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: DevelopersComponent,
    canActivate: [WalletDeveloperGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DevelopersRoutingModule {}
