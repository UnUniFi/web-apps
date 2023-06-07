import { CosmosSDKService } from '../cosmos-sdk.service';
import { Injectable } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import { Observable } from 'rxjs';
import { map, mergeMap, pluck } from 'rxjs/operators';
import ununifi from 'ununifi-client';
import {
  StrategyAll200ResponseStrategiesInner,
  Vault200Response,
  VaultAll200ResponseVaultsInner,
  YieldAggregatorParams200ResponseParams,
} from 'ununifi-client/esm/openapi';

@Injectable({
  providedIn: 'root',
})
export class YieldAggregatorQueryService {
  restSdk$ = this.cosmosSDK.sdk$.pipe(pluck('rest'));

  constructor(private readonly cosmosSDK: CosmosSDKService) {}

  getYieldAggregatorParam$(): Observable<YieldAggregatorParams200ResponseParams> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununifi.rest.yieldaggregator.params(sdk)),
      map((res) => res.data.params!),
    );
  }

  listStrategies$(denom: string): Observable<StrategyAll200ResponseStrategiesInner[]> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununifi.rest.yieldaggregator.strategyAll(sdk, denom)),
      map((res) => res.data.strategies!),
    );
  }

  getStrategy$(denom: string, id: string): Observable<StrategyAll200ResponseStrategiesInner> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununifi.rest.yieldaggregator.strategy(sdk, denom, id)),
      map((res) => res.data.strategy!),
    );
  }

  listVaults$(): Observable<VaultAll200ResponseVaultsInner[]> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununifi.rest.yieldaggregator.vaultAll(sdk)),
      map((res) => res.data.vaults!),
    );
  }

  getVault$(id: string): Observable<Vault200Response> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununifi.rest.yieldaggregator.vault(sdk, id)),
      map((res) => res.data),
    );
  }

  getEstimatedMintAmount$(
    id: string,
    amount: string,
  ): Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununifi.rest.yieldaggregator.estimateMintAmount(sdk, id, amount)),
      map((res) => res.data.mint_amount!),
    );
  }

  getEstimatedRedeemAmount$(
    id: string,
    amount: string,
  ): Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununifi.rest.yieldaggregator.estimateRedeemAmount(sdk, id, amount)),
      map((res) => res.data.redeem_amount!),
    );
  }
}
