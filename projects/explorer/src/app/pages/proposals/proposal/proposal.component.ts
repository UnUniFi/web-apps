import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import conmosclient from '@cosmos-client/core';
import {
  InlineResponse20027Proposals,
  InlineResponse20029Deposits,
  InlineResponse20027FinalTallyResult,
  InlineResponse20032Votes,
  InlineResponse20026DepositParams,
  InlineResponse20026TallyParams,
  InlineResponse20026VotingParams,
} from '@cosmos-client/core/esm/openapi';
import { CosmosSDKService } from 'projects/explorer/src/app/models/cosmos-sdk.service';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

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

  constructor(private route: ActivatedRoute, private cosmosSDK: CosmosSDKService) {
    const proposalID$ = this.route.params.pipe(map((params) => params.id));

    const combined$ = combineLatest([this.cosmosSDK.sdk$, proposalID$]);
    this.proposal$ = combined$.pipe(
      mergeMap(([sdk, address]) => conmosclient.rest.gov.proposal(sdk.rest, address)),
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
      mergeMap(([sdk, address]) => conmosclient.rest.gov.deposits(sdk.rest, address)),
      map((result) => result.data.deposits!),
      catchError((error) => {
        console.error(error);
        return of(undefined);
      }),
    );

    this.depositParams$ = this.cosmosSDK.sdk$.pipe(
      mergeMap((sdk) => conmosclient.rest.gov.params(sdk.rest, 'deposit')),
      map((result) => result.data.deposit_params),
    );

    this.tally$ = combined$.pipe(
      mergeMap(([sdk, address]) => conmosclient.rest.gov.tallyresult(sdk.rest, address)),
      map((result) => result.data.tally!),
      catchError((error) => {
        console.error(error);
        return of(undefined);
      }),
    );

    this.tallyParams$ = this.cosmosSDK.sdk$.pipe(
      mergeMap((sdk) => conmosclient.rest.gov.params(sdk.rest, 'tallying')),
      map((result) => result.data.tally_params),
      catchError((error) => {
        console.error(error);
        return of(undefined);
      }),
    );

    this.votes$ = combined$.pipe(
      mergeMap(([sdk, address]) => conmosclient.rest.gov.votes(sdk.rest, address)),
      map((result) => result.data.votes!),
      catchError((error) => {
        console.error(error);
        return of(undefined);
      }),
    );

    this.votingParams$ = this.cosmosSDK.sdk$.pipe(
      mergeMap((sdk) => conmosclient.rest.gov.params(sdk.rest, 'voting')),
      map((result) => result.data.voting_params),
      catchError((error) => {
        console.error(error);
        return of(undefined);
      }),
    );
  }

  ngOnInit(): void { }
}
