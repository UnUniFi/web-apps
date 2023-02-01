import { CosmosSDKService } from './cosmos-sdk.service';
import { Injectable } from '@angular/core';
import { CosmosSDK } from '@cosmos-client/core/cjs/sdk';
import { AccAddress } from '@cosmos-client/core/cjs/types';
import { Observable, zip } from 'rxjs';
import { filter, map, mergeMap, pluck } from 'rxjs/operators';
import ununifi from 'ununifi-client';
import {
  AllPositions200ResponsePositionsInner,
  AuctionAll200Response,
  AuctionAll200ResponseAuctionsInner,
  AuctionParams200ResponseParams,
  CdpAll200ResponseCdpInner,
  CdpAll200ResponseCdpInnerCdpCollateral,
  DerivativesParams200ResponseParams,
  EcosystemincentiveParams200ResponseParams,
  IncentiveUnit200ResponseIncentiveUnit,
  PerpetualFutures200Response,
  PerpetualFuturesMarket200Response,
  Pool200Response,
  Price200ResponsePrice,
} from 'ununifi-client/esm/openapi';

export const getCollateralParamsStream = (
  collateralType: Observable<string>,
  cdpParams: Observable<ununifi.proto.ununifi.cdp.IParams>,
) =>
  zip(collateralType, cdpParams).pipe(
    map(([collateralType, params]) => {
      return params.collateral_params?.find((param) => param.type === collateralType);
    }),
    filter(
      (collateralParams): collateralParams is ununifi.proto.ununifi.cdp.CollateralParam =>
        collateralParams !== undefined,
    ),
  );

@Injectable({ providedIn: 'root' })
export class UnunifiRestService {
  private restSdk$: Observable<CosmosSDK>;

  constructor(private cosmosSDK: CosmosSDKService) {
    this.restSdk$ = this.cosmosSDK.sdk$.pipe(pluck('rest'));
  }

  getCdpParams$(): Observable<ununifi.proto.ununifi.cdp.IParams | undefined> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununifi.rest.cdp.params(sdk)),
      map((res) => res.data.params),
    );
  }

  getCdp$(
    address: AccAddress,
    collateralType: string,
  ): Observable<CdpAll200ResponseCdpInner | undefined> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununifi.rest.cdp.cdp(sdk, address, collateralType)),
      map((res) => res.data.cdp || undefined),
    );
  }

  getAllDeposits$(address: AccAddress, collateralType: string) {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununifi.rest.cdp.allDeposits(sdk, address, collateralType)),
      map((res) => res.data.deposits!),
    );
  }

  getAuctionParams$(): Observable<AuctionParams200ResponseParams> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununifi.rest.auction.params(sdk)),
      map((res) => res.data.params!),
    );
  }

  getAllAuctions$(
    paginationOffset?: bigint | undefined,
    paginationLimit?: bigint | undefined,
  ): Observable<AuctionAll200Response> {
    return this.restSdk$.pipe(
      mergeMap((sdk) =>
        ununifi.rest.auction.allAuctions(sdk, undefined, paginationOffset, paginationLimit, true),
      ),
      map((res) => res.data),
    );
  }

  getAuction$(id: string): Observable<AuctionAll200ResponseAuctionsInner | undefined> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununifi.rest.auction.auction(sdk, id)),
      map((res) => res.data.auction),
    );
  }

  getPrice$(marketID: string): Observable<Price200ResponsePrice> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununifi.rest.pricefeed.price(sdk, marketID)),
      map((res) => res.data.price!),
    );
  }

  getEcosystemIncentiveParams$(): Observable<EcosystemincentiveParams200ResponseParams> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununifi.rest.ecosystemIncentive.params(sdk)),
      map((res) => res.data.params!),
    );
  }

  getIncentiveUnit$(incentiveUnitId: string): Observable<IncentiveUnit200ResponseIncentiveUnit> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununifi.rest.ecosystemIncentive.incentiveUnit(sdk, incentiveUnitId)),
      map((res) => res.data.incentive_unit!),
    );
  }

  getAllRewards$(subjectAddr: string): Observable<CdpAll200ResponseCdpInnerCdpCollateral[]> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununifi.rest.ecosystemIncentive.allRewards(sdk, subjectAddr)),
      map((res) => res.data.rewards?.rewards!),
    );
  }

  getReward$(
    subjectAddr: string,
    denom: string,
  ): Observable<CdpAll200ResponseCdpInnerCdpCollateral> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununifi.rest.ecosystemIncentive.reward(sdk, subjectAddr, denom)),
      map((res) => res.data.reward!),
    );
  }

  getRecordedIncentiveUnitId$(classId: string, nftId: string): Observable<string> {
    return this.restSdk$.pipe(
      mergeMap((sdk) =>
        ununifi.rest.ecosystemIncentive.recordedIncentiveUnitId(sdk, classId, nftId),
      ),
      map((res) => res.data.incentive_unit_id!),
    );
  }

  getDerivativesParams$(): Observable<DerivativesParams200ResponseParams> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununifi.rest.derivatives.params(sdk)),
      map((res) => res.data.params!),
    );
  }

  getNominalAPY$(): Observable<string> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununifi.rest.derivatives.nominalAPY(sdk)),
      map((res) => res.data.apy!),
    );
  }

  getRealAPY$(): Observable<string> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununifi.rest.derivatives.realAPY(sdk)),
      map((res) => res.data.apy!),
    );
  }

  getPool$(): Observable<Pool200Response> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununifi.rest.derivatives.pool(sdk)),
      map((res) => res.data!),
    );
  }

  listAllPositions$(): Observable<AllPositions200ResponsePositionsInner[]> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununifi.rest.derivatives.allPositions(sdk)),
      map((res) => res.data.positions!),
    );
  }

  listAddressPositions$(address: string): Observable<AllPositions200ResponsePositionsInner[]> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununifi.rest.derivatives.positions(sdk, address)),
      map((res) => res.data.positions!),
    );
  }

  getWholePerpetualFutures$(): Observable<PerpetualFutures200Response> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununifi.rest.derivatives.wholePerpetualFutures(sdk)),
      map((res) => res.data!),
    );
  }

  getPerpetualFuture$(
    denom: string,
    quoteDenom: string,
  ): Observable<PerpetualFuturesMarket200Response> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununifi.rest.derivatives.perpetualFuture(sdk, denom, quoteDenom)),
      map((res) => res.data!),
    );
  }
}
