import { ProposalUseCaseService } from './proposal.usecase.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import cosmosclient from '@cosmos-client/core';
import {
  InlineResponse20026DepositParams,
  InlineResponse20026TallyParams,
  InlineResponse20026VotingParams,
  InlineResponse20027FinalTallyResult,
  InlineResponse20027Proposals,
  InlineResponse20029Deposits,
  InlineResponse20032Votes,
} from '@cosmos-client/core/esm/openapi';
import { CosmosRestService } from 'projects/portal/src/app/models/cosmos-rest.service';
import { GovApplicationService } from 'projects/portal/src/app/models/cosmos/gov.application.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-proposal',
  templateUrl: './proposal.component.html',
  styleUrls: ['./proposal.component.css'],
})
export class ProposalComponent implements OnInit {
  proposal$: Observable<InlineResponse20027Proposals | undefined>;
  proposalType$: Observable<string | undefined>;
  proposalContent$: Observable<cosmosclient.proto.cosmos.gov.v1beta1.TextProposal | undefined>;
  deposits$: Observable<InlineResponse20029Deposits[] | undefined>;
  depositParams$: Observable<InlineResponse20026DepositParams | undefined>;
  tally$: Observable<InlineResponse20027FinalTallyResult | undefined>;
  tallyParams$: Observable<InlineResponse20026TallyParams | undefined>;
  votes$: Observable<InlineResponse20032Votes[] | undefined>;
  votingParams$: Observable<InlineResponse20026VotingParams | undefined>;

  constructor(
    private route: ActivatedRoute,
    private usecase: ProposalUseCaseService,
    private readonly govAppService: GovApplicationService,
    private readonly cosmosRest: CosmosRestService,
  ) {
    const proposalID$ = this.route.params.pipe(map((params) => params.id as string));

    this.proposal$ = this.usecase.proposal$(proposalID$);
    this.proposalType$ = this.usecase.proposalType$(this.proposal$);
    this.deposits$ = this.usecase.deposits$(proposalID$);
    this.depositParams$ = this.usecase.depositsParams$;
    this.tally$ = this.usecase.tally$(proposalID$);
    this.proposalContent$ = this.usecase.proposalContent$(this.proposal$);
    this.tallyParams$ = this.usecase.tallyParams$;
    this.votes$ = this.usecase.votes$(proposalID$);
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
