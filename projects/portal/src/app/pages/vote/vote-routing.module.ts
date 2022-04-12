import { WalletGuard } from '../../models/wallets/wallet.guard';
import { ProposalComponent } from './proposal/proposal.component';
import { VoteComponent } from './vote.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: VoteComponent,
    canActivate: [WalletGuard],
  },
  {
    path: 'validators',
    children: [{ path: ':address', component: ProposalComponent }],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VoteRoutingModule {}
