import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { rest } from '@cosmos-client/core';
import {
  InlineResponse20052Proposals,
  InlineResponse20054Deposits,
  InlineResponse20052FinalTallyResult,
  InlineResponse20057Votes,
  InlineResponse20051DepositParams,
  InlineResponse20051TallyParams,
  InlineResponse20051VotingParams,
} from '@cosmos-client/core/esm/openapi';
import { CosmosSDKService } from 'projects/explorer/src/app/models/cosmos-sdk.service';
import { GovApplicationService } from 'projects/portal/src/app/models/cosmos/gov.application.service';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-proposal',
  templateUrl: './proposal.component.html',
  styleUrls: ['./proposal.component.css'],
})
export class ProposalComponent implements OnInit {
  proposal$: Observable<InlineResponse20052Proposals | undefined>;
  proposalType$: Observable<string | undefined>;
  deposits$: Observable<InlineResponse20054Deposits[] | undefined>;
  depositParams$: Observable<InlineResponse20051DepositParams | undefined>;
  tally$: Observable<InlineResponse20052FinalTallyResult | undefined>;
  tallyParams$: Observable<InlineResponse20051TallyParams | undefined>;
  votes$: Observable<InlineResponse20057Votes[] | undefined>;
  votingParams$: Observable<InlineResponse20051VotingParams | undefined>;

  constructor(
    private route: ActivatedRoute,
    private cosmosSDK: CosmosSDKService,
    private readonly govAppService: GovApplicationService,
  ) {
    const proposalID$ = this.route.params.pipe(map((params) => params.id));

    const combined$ = combineLatest([this.cosmosSDK.sdk$, proposalID$]);
    this.proposal$ = combined$.pipe(
      mergeMap(([sdk, id]) => rest.gov.proposal(sdk.rest, id)),
      map((result) => result.data.proposal!),
      catchError((error) => {
        console.error(error);
        return of(undefined);
      }),
    );

    this.proposalType$ = this.proposal$.pipe(
      map((proposal) => {
        if (proposal && proposal.content) {
          return (proposal.content as any)['@type'];
        }
      }),
    );

    this.deposits$ = combined$.pipe(
      mergeMap(([sdk, proposalID]) => rest.gov.deposits(sdk.rest, proposalID)),
      map((result) => result.data.deposits!),
      catchError((error) => {
        console.error(error);
        return of(undefined);
      }),
    );

    this.depositParams$ = this.cosmosSDK.sdk$.pipe(
      mergeMap((sdk) => rest.gov.params(sdk.rest, 'deposit')),
      map((result) => result.data.deposit_params),
    );

    this.tally$ = combined$.pipe(
      mergeMap(([sdk, proposalID]) => rest.gov.tallyresult(sdk.rest, proposalID)),
      map((result) => result.data.tally!),
      catchError((error) => {
        console.error(error);
        return of(undefined);
      }),
    );

    this.tallyParams$ = this.cosmosSDK.sdk$.pipe(
      mergeMap((sdk) => rest.gov.params(sdk.rest, 'tallying')),
      map((result) => result.data.tally_params),
      catchError((error) => {
        console.error(error);
        return of(undefined);
      }),
    );

    this.votes$ = combined$.pipe(
      mergeMap(([sdk, proposalID]) => rest.gov.votes(sdk.rest, proposalID)),
      map((result) => result.data.votes!),
      catchError((error) => {
        console.error(error);
        return of(undefined);
      }),
    );

    this.votingParams$ = this.cosmosSDK.sdk$.pipe(
      mergeMap((sdk) => rest.gov.params(sdk.rest, 'voting')),
      map((result) => result.data.voting_params),
      catchError((error) => {
        console.error(error);
        return of(undefined);
      }),
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
