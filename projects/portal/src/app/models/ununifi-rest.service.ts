import { CosmosSDKService } from './cosmos-sdk.service';
import { Injectable } from '@angular/core';
import { CosmosSDK } from '@cosmos-client/core/cjs/sdk';
import { AccAddress } from '@cosmos-client/core/cjs/types';
import { Observable, zip } from 'rxjs';
import { filter, map, mergeMap, pluck } from 'rxjs/operators';
import ununifi from 'ununifi-client';
import {
  AuctionAll200Response,
  AuctionAll200ResponseAuctionsInner,
  AuctionParams200ResponseParams,
  CdpAll200ResponseCdpInner,
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
  // TODO: split this into multiple services for each module (pawn-market-rest, yield-aggregator-rest, derivatives-rest)
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
}
