import { CosmosSDKService } from './cosmos-sdk.service';
import { Injectable } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import { CosmosSDK } from '@cosmos-client/core/cjs/sdk';
import {
  CosmosTxV1beta1GetTxsEventResponse,
  InlineResponse20012 as InlineResponse,
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
      mergeMap((sdk) => cosmosclient.rest.tendermint.getNodeInfo(sdk)),
      map((res) => res.data),
    );
  }

  allBalances$(
    cosmosAccAddress: cosmosclient.AccAddress,
  ): Observable<InlineResponseBalances[] | undefined> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => cosmosclient.rest.bank.allBalances(sdk, cosmosAccAddress)),
      map((res) => res.data.balances),
      catchError(this._handleError),
    );
  }

  getAccount$(cosmosAccAddress: cosmosclient.AccAddress): Observable<InlineResponse | undefined> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => cosmosclient.rest.auth.account(sdk, cosmosAccAddress)),
      tap((res) => console.log(res.data.account)),
      map((res) => res.data.account),
      map((account) => {
        const { protoJSONToInstance, castProtoJSONOfProtoAny } = cosmosclient.codec;
        return (account && protoJSONToInstance(castProtoJSONOfProtoAny(account))) as InlineResponse;
      }),
      catchError(this._handleError),
    );
  }

  getAccountTxsEvent$(address: string): Observable<CosmosTxV1beta1GetTxsEventResponse | undefined> {
    return this.restSdk$.pipe(
      mergeMap((sdk) =>
        cosmosclient.rest.tx.getTxsEvent(
          sdk,
          [`message.sender='${address}'`],
          undefined,
          undefined,
          undefined,
          true,
        ),
      ),
      map((res) => res.data),
      catchError(this._handleError),
    );
  }

  private _handleError(error: any): Observable<undefined> {
    console.error(error);
    return of(undefined);
  }
}
