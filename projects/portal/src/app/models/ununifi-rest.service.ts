import { CosmosSDKService } from './cosmos-sdk.service';
import { Injectable } from '@angular/core';
import { CosmosSDK } from '@cosmos-client/core/cjs/sdk';
import { AccAddress } from '@cosmos-client/core/cjs/types';
import { Observable, zip } from 'rxjs';
import { filter, map, mergeMap, pluck } from 'rxjs/operators';
import ununifi from 'ununifi-client';
import {
  InlineResponse200,
  InlineResponse20013Price,
  InlineResponse2002Params,
  InlineResponse2004Cdp1,
  InlineResponse200Auctions,
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
  ): Observable<InlineResponse2004Cdp1 | undefined> {
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

  getAuctionParams$(): Observable<InlineResponse2002Params> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununifi.rest.auction.params(sdk)),
      map((res) => res.data.params!),
    );
  }

  getAllAuctions$(
    paginationOffset?: bigint | undefined,
    paginationLimit?: bigint | undefined,
  ): Observable<InlineResponse200> {
    return this.restSdk$.pipe(
      mergeMap((sdk) =>
        ununifi.rest.auction.allAuctions(sdk, undefined, paginationOffset, paginationLimit, true),
      ),
      map((res) => res.data),
    );
  }

  getAuction$(id: string): Observable<InlineResponse200Auctions | undefined> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununifi.rest.auction.auction(sdk, id)),
      map((res) => res.data.auction),
    );
  }

  getPrice$(marketID: string): Observable<InlineResponse20013Price> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununifi.rest.pricefeed.price(sdk, marketID)),
      map((res) => res.data.price!),
    );
  }
}
