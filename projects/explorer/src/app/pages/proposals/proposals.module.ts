import { ProposalModule } from '../../views/proposals/proposal/proposal.module';
import { ProposalsModule } from '../../views/proposals/proposals.module';
import { ProposalComponent } from './proposal/proposal.component';
import { ProposalsRoutingModule } from './proposals-routing.module';
import { ProposalsComponent } from './proposals.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [ProposalsComponent, ProposalComponent],
  imports: [CommonModule, ProposalsRoutingModule, ProposalsModule, ProposalModule],
})
export class AppProposalsModule {}
