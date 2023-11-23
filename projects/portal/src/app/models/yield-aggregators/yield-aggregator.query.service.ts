import { CosmosSDKService } from '../cosmos-sdk.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, mergeMap, pluck } from 'rxjs/operators';
import ununifi from 'ununifi-client';
import {
  DenomInfos200ResponseInfoInner,
  EstimateMintAmount200Response,
  EstimateRedeemAmount200Response,
  StrategyAll200ResponseStrategiesInner,
  SymbolInfos200ResponseInfoInner,
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
      mergeMap((sdk) => ununifi.rest.yieldAggregator.params(sdk)),
      map((res) => res.data.params!),
    );
  }

  listStrategies$(denom?: string): Observable<StrategyAll200ResponseStrategiesInner[]> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununifi.rest.yieldAggregator.strategyAll(sdk, denom)),
      map((res) => res.data.strategies!),
    );
  }

  getStrategy$(id: string, denom?: string): Observable<StrategyAll200ResponseStrategiesInner> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununifi.rest.yieldAggregator.strategy(sdk, id, denom)),
      map((res) => res.data.strategy!),
    );
  }

  listVaults$(): Observable<VaultAll200ResponseVaultsInner[]> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununifi.rest.yieldAggregator.vaultAll(sdk)),
      map((res) => res.data.vaults!),
    );
  }

  getVault$(id: string): Observable<Vault200Response> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununifi.rest.yieldAggregator.vault(sdk, id)),
      map((res) => res.data),
    );
  }

  getEstimatedMintAmount$(id: string, amount?: string): Observable<EstimateMintAmount200Response> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununifi.rest.yieldAggregator.estimateMintAmount(sdk, id, amount)),
      map((res) => res.data!),
    );
  }

  getEstimatedRedeemAmount$(
    id: string,
    amount?: string,
  ): Observable<EstimateRedeemAmount200Response> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununifi.rest.yieldAggregator.estimateRedeemAmount(sdk, id, amount)),
      map((res) => res.data!),
    );
  }

  async getEstimatedRedeemAmount(
    id: string,
    amount?: string,
  ): Promise<EstimateRedeemAmount200Response> {
    const sdk = await this.cosmosSDK.sdk().then((sdk) => sdk.rest);
    const res = await ununifi.rest.yieldAggregator.estimateRedeemAmount(sdk, id, amount);
    return res.data!;
  }

  listDenomInfos$(): Observable<DenomInfos200ResponseInfoInner[]> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununifi.rest.yieldAggregator.denomInfos(sdk)),
      map((res) => res.data.info!),
    );
  }

  listSymbolInfos$(): Observable<SymbolInfos200ResponseInfoInner[]> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununifi.rest.yieldAggregator.symbolInfos(sdk)),
      map((res) => res.data.info!),
    );
  }
}
