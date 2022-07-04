import { CosmosSDKService } from './cosmos-sdk.service';
import { Injectable } from '@angular/core';
import { cosmosclient, rest } from '@cosmos-client/core';
import { CosmosSDK } from '@cosmos-client/core/cjs/sdk';
import {
  InlineResponse20012 as InlineResponse,
  InlineResponse20027FinalTallyResult as FinalTallyResult,
  InlineResponse20027Proposals as Proposals,
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
      catchError((error) => {
        console.error(error);
        return of(undefined);
      }),
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
      catchError((error) => {
        console.error(error);
        return of(undefined);
      }),
    );
  }

  getProposals$(): Observable<Proposals[]> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => rest.gov.proposals(sdk)),
      map((result) => result.data.proposals!),
    );
  }

  getTally$(proposalID: string): Observable<FinalTallyResult | undefined> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => rest.gov.tallyresult(sdk, proposalID)),
      map((result) => result.data.tally),
      catchError((error) => {
        console.error(error);
        return of(undefined);
      }),
    );
  }
}
