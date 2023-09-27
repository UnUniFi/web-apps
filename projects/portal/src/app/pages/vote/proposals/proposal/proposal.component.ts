import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  Deposits200ResponseDepositsInner,
  GovParams200ResponseDepositParams,
  GovParams200ResponseTallyParams,
  GovParams200ResponseVotingParams,
  GovV1Proposal200ResponseProposalsInner,
  GovV1Proposal200ResponseProposalsInnerFinalTallyResult,
  GovV1Votes200ResponseVotesInner,
} from '@cosmos-client/core/esm/openapi';
import { CosmosRestService } from 'projects/portal/src/app/models/cosmos-rest.service';
import { GovApplicationService } from 'projects/portal/src/app/models/cosmos/gov.application.service';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-proposal',
  templateUrl: './proposal.component.html',
  styleUrls: ['./proposal.component.css'],
})
export class ProposalComponent implements OnInit {
  proposal$: Observable<GovV1Proposal200ResponseProposalsInner | undefined>;
  deposits$: Observable<Deposits200ResponseDepositsInner[] | undefined>;
  depositParams$: Observable<GovParams200ResponseDepositParams | undefined>;
  tally$: Observable<GovV1Proposal200ResponseProposalsInnerFinalTallyResult | undefined>;
  tallyParams$: Observable<GovParams200ResponseTallyParams | undefined>;
  votes$: Observable<GovV1Votes200ResponseVotesInner[] | undefined>;
  votingParams$: Observable<GovParams200ResponseVotingParams | undefined>;

  constructor(
    private route: ActivatedRoute,
    private readonly govAppService: GovApplicationService,
    private readonly cosmosRest: CosmosRestService,
  ) {
    const proposalID$ = this.route.params.pipe(map((params) => params.id as string));

    this.proposal$ = proposalID$.pipe(mergeMap((id) => this.cosmosRest.getProposal$(id)));
    this.deposits$ = proposalID$.pipe(mergeMap((id) => this.cosmosRest.getDeposits$(id)));
    this.depositParams$ = this.cosmosRest.getDepositParams$();
    this.tally$ = proposalID$.pipe(
      mergeMap((proposalId) => this.cosmosRest.getTallyResult$(proposalId)),
    );
    this.tallyParams$ = this.cosmosRest.getTallyParams$();
    this.votes$ = proposalID$.pipe(mergeMap((proposalId) => this.cosmosRest.getVotes$(proposalId)));
    this.votingParams$ = this.cosmosRest.getVotingParams$();
  }

  ngOnInit(): void {}

  onVoteProposal(proposalID: number) {
    this.govAppService.openVoteFormDialog(proposalID);
  }
  onDepositProposal(proposalID: number) {
    this.govAppService.openDepositFormDialog(proposalID);
  }
}
