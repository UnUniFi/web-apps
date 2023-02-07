import { CosmosSDKService } from '../cosmos-sdk.service';
import { Injectable } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import { CosmosSDK } from '@cosmos-client/core/cjs/sdk';
import { Observable } from 'rxjs';
import { map, mergeMap, pluck } from 'rxjs/operators';
import ununifi from 'ununifi-client';
import {
  BidderBids200ResponseBidsInner,
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

  getNftListing(classID: string, nftID: string): Observable<ListedNfts200ResponseListingsInner> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununifi.rest.nftmarket.nftListing(sdk, classID, nftID)),
      map((res) => res.data.listing!),
    );
  }

  listAllListedNfts(): Observable<ListedNfts200ResponseListingsInner[]> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununifi.rest.nftmarket.listedNfts(sdk)),
      map((res) => res.data.listings!),
    );
  }

  listAllListedClasses(): Observable<ListedClass200Response[]> {
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

  listNftBids(classID: string, nftID: string): Observable<BidderBids200ResponseBidsInner[]> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununifi.rest.nftmarket.nftBids(sdk, classID, nftID)),
      map((res) => res.data.bids!),
    );
  }

  listBidderBids(address: string): Observable<BidderBids200ResponseBidsInner[]> {
    return this.restSdk$.pipe(
      mergeMap((sdk) =>
        ununifi.rest.nftmarket.bidderBids(sdk, cosmosclient.AccAddress.fromString(address)),
      ),
      map((res) => res.data.bids!),
    );
  }

  // To do update @cosmosclient/core
  listOwnNfts(address: string): Observable<string> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => cosmosclient.rest.nft.DUMMY),
      map((res) => res),
    );
  }
}
