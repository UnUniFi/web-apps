import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import cosmosclient from '@cosmos-client/core';
import {
  Deposits200ResponseDepositsInner,
  GovParams200ResponseDepositParams,
  GovParams200ResponseTallyParams,
  GovParams200ResponseVotingParams,
  GovV1Proposal200ResponseProposalsInner,
  GovV1Proposal200ResponseProposalsInnerFinalTallyResult,
  GovV1Votes200ResponseVotesInner,
} from '@cosmos-client/core/esm/openapi';
import { CosmosSDKService } from 'projects/portal/src/app/models';
import { GovApplicationService } from 'projects/portal/src/app/models/cosmos/gov.application.service';
import { Observable, combineLatest, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

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
  tallyTotalCount$: Observable<number>;
  quorum$: Observable<number>;
  threshold$: Observable<number>;
  vetoThreshold$: Observable<number>;

  constructor(
    private route: ActivatedRoute,
    private cosmosSDK: CosmosSDKService,
    private readonly govAppService: GovApplicationService,
  ) {
    const proposalID$ = this.route.params.pipe(map((params) => params.id as string));

    const combined$ = combineLatest([this.cosmosSDK.sdk$, proposalID$]);
    this.proposal$ = combined$.pipe(
      mergeMap(([sdk, id]) => cosmosclient.rest.gov.govV1Proposal(sdk.rest, id)),
      map((result) => result.data.proposal!),
      catchError((error) => {
        console.error(error);
        return of(undefined);
      }),
    );

    this.deposits$ = combined$.pipe(
      mergeMap(([sdk, id]) => cosmosclient.rest.gov.govV1Deposits(sdk.rest, id)),
      map((result) => result.data.deposits!),
      catchError((error) => {
        console.error(error);
        return of(undefined);
      }),
    );

    this.depositParams$ = this.cosmosSDK.sdk$.pipe(
      mergeMap((sdk) => cosmosclient.rest.gov.govV1Params(sdk.rest, 'deposit')),
      map((result) => result.data.deposit_params),
    );

    this.tally$ = combined$.pipe(
      mergeMap(([sdk, address]) => cosmosclient.rest.gov.govV1TallyResult(sdk.rest, address)),
      map((result) => result.data.tally!),
      catchError((error) => {
        console.error(error);
        return of(undefined);
      }),
    );

    this.tallyParams$ = this.cosmosSDK.sdk$.pipe(
      mergeMap((sdk) => cosmosclient.rest.gov.govV1Params(sdk.rest, 'tallying')),
      map((result) => result.data.tally_params),
      catchError((error) => {
        console.error(error);
        return of(undefined);
      }),
    );

    this.votes$ = combined$.pipe(
      mergeMap(([sdk, address]) => cosmosclient.rest.gov.govV1Votes(sdk.rest, address)),
      map((result) => result.data.votes!),
      catchError((error) => {
        console.error(error);
        return of(undefined);
      }),
    );

    this.votingParams$ = this.cosmosSDK.sdk$.pipe(
      mergeMap((sdk) => cosmosclient.rest.gov.govV1Params(sdk.rest, 'voting')),
      map((result) => result.data.voting_params),
      catchError((error) => {
        console.error(error);
        return of(undefined);
      }),
    );

    const pool$ = this.cosmosSDK.sdk$.pipe(
      mergeMap((sdk) => cosmosclient.rest.staking.pool(sdk.rest)),
      map((result) => result.data.pool),
    );

    this.tallyTotalCount$ = this.tally$.pipe(
      map(
        (tally) =>
          Number(tally?.yes_count) +
          Number(tally?.no_count) +
          Number(tally?.no_with_veto_count) +
          Number(tally?.abstain_count),
      ),
    );

    this.quorum$ = combineLatest([this.tallyTotalCount$, pool$]).pipe(
      map(([tallyTotalCount, pool]) => tallyTotalCount / Number(pool?.bonded_tokens)),
    );
    this.threshold$ = this.tally$.pipe(
      map(
        (tally) =>
          Number(tally?.yes_count) /
            (Number(tally?.yes_count) +
              Number(tally?.no_count) +
              Number(tally?.no_with_veto_count)) || 0,
      ),
    );
    this.vetoThreshold$ = this.tally$.pipe(
      map(
        (tally) =>
          Number(tally?.no_with_veto_count) /
            (Number(tally?.yes_count) +
              Number(tally?.no_count) +
              Number(tally?.no_with_veto_count)) || 0,
      ),
    );
  }

  ngOnInit(): void {}

  onVoteProposal(proposalID: number) {
    this.govAppService.openVoteFormDialog(proposalID);
  }
  onDepositProposal(proposalID: number) {
    this.govAppService.openDepositFormDialog(proposalID);
  }
}
