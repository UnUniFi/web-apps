import { ProposalModule } from '../../views/vote/proposal/proposal.module';
import { VoteModule } from '../../views/vote/vote.module';
import { ProposalComponent } from './proposal/proposal.component';
import { VoteRoutingModule } from './vote-routing.module';
import { VoteComponent } from './vote.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [VoteComponent, ProposalComponent],
  imports: [CommonModule, VoteRoutingModule, VoteModule, ProposalModule],
})
export class AppVoteModule {}
