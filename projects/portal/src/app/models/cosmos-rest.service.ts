import { CosmosSDKService } from './cosmos-sdk.service';
import { Injectable } from '@angular/core';
import { cosmosclient, rest } from '@cosmos-client/core';
import { CosmosSDK } from '@cosmos-client/core/cjs/sdk';
import {
  InlineResponse20012 as InlineResponse,
  InlineResponse20026DepositParams,
  InlineResponse20026TallyParams as TallyParams,
  InlineResponse20026VotingParams as VotingParams,
  InlineResponse20027FinalTallyResult as FinalTallyResult,
  InlineResponse20027Proposals as Proposals,
  InlineResponse20029Deposits as Deposits,
  InlineResponse20032Votes as Votes,
  InlineResponse2003Balances as InlineResponseBalances,
} from '@cosmos-client/core/esm/openapi';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap, pluck, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class CosmosRestService {
  private restSdk$: Observable<CosmosSDK>;

  constructor(private cosmosSDK: CosmosSDKService) {
    this.restSdk$ = this.cosmosSDK.sdk$.pipe(pluck('rest'));
  }

  getNodeInfo$(): Observable<InlineResponse> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => rest.tendermint.getNodeInfo(sdk)),
      map((res) => res.data),
    );
  }

  allBalances$(
    cosmosAccAddress: cosmosclient.AccAddress,
  ): Observable<InlineResponseBalances[] | undefined> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => rest.bank.allBalances(sdk, cosmosAccAddress)),
      map((res) => res.data.balances),
      catchError(this._handleError),
    );
  }

  getAccount$(cosmosAccAddress: cosmosclient.AccAddress): Observable<InlineResponse | undefined> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => rest.auth.account(sdk, cosmosAccAddress)),
      tap((res) => console.log(res.data.account)),
      map((res) => res.data.account),
      map((account) => {
        const { protoJSONToInstance, castProtoJSONOfProtoAny } = cosmosclient.codec;
        return (account && protoJSONToInstance(castProtoJSONOfProtoAny(account))) as InlineResponse;
      }),
      catchError(this._handleError),
    );
  }

  getProposals$(): Observable<Proposals[]> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => rest.gov.proposals(sdk)),
      map((result) => result.data.proposals!),
    );
  }

  getProposal$(proposalId: string): Observable<Proposals | undefined> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => rest.gov.proposal(sdk, proposalId)),
      map((result) => result.data.proposal),
      catchError(this._handleError),
    );
  }

  getDeposits$(proposalId: string): Observable<Deposits[] | undefined> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => rest.gov.deposits(sdk, proposalId)),
      map((result) => result.data.deposits),
      catchError(this._handleError),
    );
  }

  getDepositParams$(): Observable<InlineResponse20026DepositParams | undefined> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => rest.gov.params(sdk, 'deposit')),
      map((result) => result.data.deposit_params),
      catchError(this._handleError),
    );
  }

  getTally$(proposalID: string): Observable<FinalTallyResult | undefined> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => rest.gov.tallyresult(sdk, proposalID)),
      map((result) => result.data.tally),
      catchError(this._handleError),
    );
  }

  getTallyParams$(): Observable<TallyParams | undefined> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => rest.gov.params(sdk, 'tallying')),
      map((result) => result.data.tally_params),
      catchError(this._handleError),
    );
  }

  getVote$(proposalId: string): Observable<Votes[] | undefined> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => rest.gov.votes(sdk, proposalId)),
      map((result) => result.data.votes),
      catchError(this._handleError),
    );
  }

  getVoteParams$(): Observable<VotingParams | undefined> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => rest.gov.params(sdk, 'voting')),
      map((result) => result.data.voting_params),
      catchError(this._handleError),
    );
  }

  private _handleError(error: any) {
    console.error(error);
    return of(undefined);
  }
}
