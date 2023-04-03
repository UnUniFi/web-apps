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
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-proposal',
  templateUrl: './proposal.component.html',
  styleUrls: ['./proposal.component.css'],
})
export class ProposalComponent implements OnInit {
  proposal$: Observable<Proposals200ResponseProposalsInner | undefined>;
  proposalType$: Observable<string | undefined>;
  proposalContent$: Observable<cosmosclient.proto.cosmos.gov.v1beta1.TextProposal | undefined>;
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
    this.proposalContent$ = this.usecase.proposalContent$(this.proposal$);
    this.tallyParams$ = this.usecase.tallyParams$;
    this.votes$ = this.usecase.votes$(proposalID$);
    this.votingParams$ = this.usecase.votingParams$;
    this.proposal$ = of({
      proposal_id: '1',
      content: { type_url: 'cosmos.gov.v1beta1.TextProposal', value: 'test' },
      status: 'PROPOSAL_STATUS_DEPOSIT_PERIOD',
      final_tally_result: { yes: '30', abstain: '1', no: '3', no_with_veto: '1' },
      submit_time: '2021-05-01T00:00:00Z',
      deposit_end_time: '2021-05-01T00:00:00Z',
      total_deposit: [{ denom: 'uguu', amount: '1' }],
      voting_start_time: '2021-05-01T00:00:00Z',
      voting_end_time: '2021-05-01T00:00:00Z',
    });
    this.tally$ = of({ yes: '50', no: '30', abstain: '0', no_with_veto: '5' });
  }

  ngOnInit(): void {}

  onVoteProposal(proposalID: number) {
    this.govAppService.openVoteFormDialog(proposalID);
  }
  onDepositProposal(proposalID: number) {
    this.govAppService.openDepositFormDialog(proposalID);
  }
}
