import { CosmosSDKService } from '../cosmos-sdk.service';
import { Injectable } from '@angular/core';
import { CosmosSDK } from '@cosmos-client/core/cjs/sdk';
import { Observable } from 'rxjs';
import { map, mergeMap, pluck } from 'rxjs/operators';
import ununifi from 'ununifi-client';
import {
  ListedClass200Response,
  ListedNfts200ResponseListingsInner,
  NftmarketParams200ResponseParams,
} from 'ununifi-client/esm/openapi';

@Injectable({ providedIn: 'root' })
export class NftPawnshopQueryService {
  private restSdk$: Observable<CosmosSDK>;

  constructor(private cosmosSDK: CosmosSDKService) {
    this.restSdk$ = this.cosmosSDK.sdk$.pipe(pluck('rest'));
  }
  getNftmarketParam(): Observable<NftmarketParams200ResponseParams> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununifi.rest.nftmarket.params(sdk)),
      map((res) => res.data.params!),
    );
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

  listListedNfts(): Observable<ListedNfts200ResponseListingsInner[]> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununifi.rest.nftmarket.listedNfts(sdk)),
      map((res) => res.data.listings!),
    );
  }

  listListedClasses(): Observable<ListedClass200Response[]> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununifi.rest.nftmarket.listedClasses(sdk)),
      map((res) => res.data.classes!),
    );
  }

  listListedClass(classID: string, limit: number): Observable<ListedClass200Response> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununifi.rest.nftmarket.listedClass(sdk, classID, limit)),
      map((res) => res.data!),
    );
  }
}
