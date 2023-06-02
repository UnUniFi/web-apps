import { ProposalUseCaseService } from './proposal.usecase.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import cosmosclient from '@cosmos-client/core';
import {
  Deposits200ResponseDepositsInner,
  GovParams200ResponseDepositParams,
  GovParams200ResponseTallyParams,
  GovParams200ResponseVotingParams,
  Proposals200ResponseProposalsInner,
  Proposals200ResponseProposalsInnerFinalTallyResult,
  Votes200ResponseVotesInner,
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
  proposal$: Observable<Proposals200ResponseProposalsInner | undefined>;
  proposalType$: Observable<string | undefined>;
  proposalContent$: Observable<any | undefined>;
  deposits$: Observable<Deposits200ResponseDepositsInner[] | undefined>;
  depositParams$: Observable<GovParams200ResponseDepositParams | undefined>;
  tally$: Observable<Proposals200ResponseProposalsInnerFinalTallyResult | undefined>;
  tallyParams$: Observable<GovParams200ResponseTallyParams | undefined>;
  votes$: Observable<Votes200ResponseVotesInner[] | undefined>;
  votingParams$: Observable<GovParams200ResponseVotingParams | undefined>;

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
    // todo set type proposal content
    this.proposalContent$ = this.proposal$.pipe(map((proposal) => proposal && proposal.content));
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
