import { CosmosSDKService } from '../cosmos-sdk.service';
import { Injectable } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import { CosmosSDK } from '@cosmos-client/core/cjs/sdk';
import { Observable } from 'rxjs';
import { map, mergeMap, pluck } from 'rxjs/operators';
import ununificlient from 'ununifi-client';
import {
  AddressPositions200ResponsePositionsInner,
  DerivativesParams200ResponseParams,
  EstimateDLPTokenAmount200Response,
  EstimateRedeemTokenAmount200Response,
  PerpetualFutures200Response,
  PerpetualFuturesMarket200Response,
  Pool200Response,
} from 'ununifi-client/esm/openapi';

@Injectable({ providedIn: 'root' })
export class DerivativesQueryService {
  private restSdk$: Observable<CosmosSDK>;

  constructor(private cosmosSDK: CosmosSDKService) {
    this.restSdk$ = this.cosmosSDK.sdk$.pipe(pluck('rest'));
  }

  getDerivativesParams$(): Observable<DerivativesParams200ResponseParams> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununificlient.rest.derivatives.params(sdk)),
      map((res) => res.data.params!),
    );
  }

  getEstimateDLPTokenAmount(
    mintDenom: string,
    amount: string,
  ): Observable<EstimateDLPTokenAmount200Response> {
    return this.restSdk$.pipe(
      mergeMap((sdk) =>
        ununificlient.rest.derivatives.estimateDLPTokenAmount(sdk, mintDenom, amount),
      ),
      map((res) => res.data!),
    );
  }

  getEstimateRedeemTokenAmount(
    redeemDenom: string,
    lptAmount: string,
  ): Observable<EstimateRedeemTokenAmount200Response> {
    return this.restSdk$.pipe(
      mergeMap((sdk) =>
        ununificlient.rest.derivatives.estimateRedeemTokenAmount(sdk, redeemDenom, lptAmount),
      ),
      map((res) => res.data!),
    );
  }

  getNominalAPY$(): Observable<string> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununificlient.rest.derivatives.nominalAPY(sdk)),
      map((res) => res.data.apy!),
    );
  }

  getRealAPY$(): Observable<string> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununificlient.rest.derivatives.realAPY(sdk)),
      map((res) => res.data.apy!),
    );
  }

  getPool$(): Observable<Pool200Response> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununificlient.rest.derivatives.pool(sdk)),
      map((res) => res.data!),
    );
  }

  listAllPositions$(): Observable<any[]> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununificlient.rest.derivatives.allPositions(sdk)),
      map((res) => res.data.positions!),
    );
  }

  listAddressPositions$(address: string): Observable<AddressPositions200ResponsePositionsInner[]> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununificlient.rest.derivatives.addressPositions(sdk, address)),
      map((res) => res.data.positions!),
    );
  }

  getWholePerpetualFutures$(): Observable<PerpetualFutures200Response> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununificlient.rest.derivatives.perpetualFutures(sdk)),
      map((res) => res.data!),
    );
  }

  getPerpetualFuture$(
    denom: string,
    quoteDenom: string,
  ): Observable<PerpetualFuturesMarket200Response> {
    return this.restSdk$.pipe(
      mergeMap((sdk) =>
        ununificlient.rest.derivatives.perpetualFuturesMarket(sdk, denom, quoteDenom),
      ),
      map((res) => res.data!),
    );
  }

  getPerpetualFuturesPositionsTotal(
    positionType: 'POSITION_UNKNOWN' | 'LONG' | 'SHORT',
    address: string,
  ): Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin> {
    return this.restSdk$.pipe(
      mergeMap((sdk) =>
        ununificlient.rest.derivatives.perpetualFuturesPositions(sdk, positionType, address),
      ),
      map((res) => res.data.total_position_size_usd!),
    );
  }

  listDLPRates() {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununificlient.rest.derivatives.dlpTokenRates(sdk)),
      map((res) => res.data.rates!),
    );
  }
}
