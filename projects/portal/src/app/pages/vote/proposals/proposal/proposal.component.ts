import { ProposalUsecaseService } from './proposal.usecase.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  InlineResponse20026DepositParams,
  InlineResponse20026TallyParams,
  InlineResponse20026VotingParams,
  InlineResponse20027FinalTallyResult,
  InlineResponse20027Proposals,
  InlineResponse20029Deposits,
  InlineResponse20032Votes,
} from '@cosmos-client/core/esm/openapi';
import { GovApplicationService } from 'projects/portal/src/app/models/cosmos/gov.application.service';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-proposal',
  templateUrl: './proposal.component.html',
  styleUrls: ['./proposal.component.css'],
})
export class ProposalComponent implements OnInit {
  proposal$: Observable<InlineResponse20027Proposals | undefined>;
  proposalType$: Observable<string | undefined>;
  deposits$: Observable<InlineResponse20029Deposits[] | undefined>;
  depositParams$: Observable<InlineResponse20026DepositParams | undefined>;
  tally$: Observable<InlineResponse20027FinalTallyResult | undefined>;
  tallyParams$: Observable<InlineResponse20026TallyParams | undefined>;
  votes$: Observable<InlineResponse20032Votes[] | undefined>;
  votingParams$: Observable<InlineResponse20026VotingParams | undefined>;

  constructor(
    private route: ActivatedRoute,
    private readonly govAppService: GovApplicationService,
    private usecase: ProposalUsecaseService,
  ) {
    const proposalID$ = this.route.params.pipe(map((params) => params.id as string));

    this.proposal$ = proposalID$.pipe(mergeMap((id) => this.usecase.proposal$(id)));
    this.proposalType$ = this.proposal$.pipe(map((p) => p?.content && (p.content as any)['@type']));

    this.deposits$ = proposalID$.pipe(mergeMap((id) => this.usecase.deposits$(id)));
    this.depositParams$ = this.usecase.depositsParams$;

    this.tally$ = proposalID$.pipe(mergeMap((id) => this.usecase.tally$(id)));
    this.tallyParams$ = this.usecase.tallyParams$;

    this.votes$ = proposalID$.pipe(mergeMap((id) => this.usecase.votes$(id)));
    this.votingParams$ = this.usecase.votingParams$;
  }

  ngOnInit(): void {}

  onVoteProposal(proposalID: number) {
    this.govAppService.openVoteFormDialog(proposalID);
  }

  onDepositProposal(proposalID: number) {
    this.govAppService.openDepositFormDialog(proposalID);
  }
}
