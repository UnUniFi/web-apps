import { CosmosSDKService } from './cosmos-sdk.service';
import { Injectable } from '@angular/core';
import { CosmosSDK } from '@cosmos-client/core/cjs/sdk';
import { Observable, zip } from 'rxjs';
import { filter, map, mergeMap, pluck } from 'rxjs/operators';
import ununifi from 'ununifi-client';
import {
  ListedClass200Response,
  ListedNfts200ResponseListingsInner,
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

  getAllListedClasses(): Observable<ListedClass200Response[]> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununifi.rest.nftmarket.listedClasses(sdk)),
      map((res) => res.data.classes!),
    );
  }

  getAllListedNfts(): Observable<ListedNfts200ResponseListingsInner[]> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununifi.rest.nftmarket.listedNfts(sdk)),
      map((res) => res.data.listings!),
    );
  }

  getNftListing(classID: string, nftID: string): Observable<ListedNfts200ResponseListingsInner> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununifi.rest.nftmarket.nftListing(sdk, classID, nftID)),
      map((res) => res.data.listing!),
    );
  }
}
