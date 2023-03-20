import { ProposalModule } from '../../views/vote/proposals/proposal/proposal.module';
import { VoteModule } from '../../views/vote/proposals/proposals.module';
import { ProposalComponent } from './proposals/proposal/proposal.component';
import { ProposalsComponent } from './proposals/proposals.component';
import { VoteRoutingModule } from './vote-routing.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

// TODO: should be renamed to AppGovModule
// TODO: move into model/cosmos/gov
@NgModule({
  declarations: [ProposalsComponent, ProposalComponent],
  imports: [CommonModule, VoteRoutingModule, VoteModule, ProposalModule],
})
export class AppVoteModule {}
