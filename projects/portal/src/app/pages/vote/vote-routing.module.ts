import { WalletGuard } from '../../models/wallets/wallet.guard';
import { ProposalComponent } from './proposals/proposal/proposal.component';
import { ProposalsComponent } from './proposals/proposals.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'proposals',
    component: ProposalsComponent,
    canActivate: [WalletGuard],
  },
  {
    path: 'proposals/:address',
    component: ProposalComponent,
    canActivate: [WalletGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VoteRoutingModule {}
