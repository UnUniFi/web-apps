import { ProposalComponent } from './proposal/proposal.component';
import { ProposalsComponent } from './proposals.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: ProposalsComponent,
  },
  {
    path: ':id',
    component: ProposalComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProposalsRoutingModule {}
