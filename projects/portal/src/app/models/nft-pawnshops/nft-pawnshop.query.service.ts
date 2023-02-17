import { CosmosSDKService } from '../cosmos-sdk.service';
import { Nft, Nfts } from './nft-pawnshop.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CosmosSDK } from '@cosmos-client/core/cjs/sdk';
import { Observable } from 'rxjs';
import { map, mergeMap, pluck } from 'rxjs/operators';
import ununifi from 'ununifi-client';
import {
  BidderBids200ResponseBidsInner,
  Liquidation200ResponseLiquidations,
  ListedClass200Response,
  ListedNfts200ResponseListingsInner,
  Loan200Response,
  Loans200ResponseLoansInner,
  NftmarketParams200ResponseParams,
} from 'ununifi-client/esm/openapi';

@Injectable({ providedIn: 'root' })
export class NftPawnshopQueryService {
  private restSdk$: Observable<CosmosSDK>;

  constructor(private http: HttpClient, private cosmosSDK: CosmosSDKService) {
    this.restSdk$ = this.cosmosSDK.sdk$.pipe(pluck('rest'));
  }
  getNftmarketParam$(): Observable<NftmarketParams200ResponseParams> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununifi.rest.nftmarket.params(sdk)),
      map((res) => res.data.params!),
    );
  }

  getNftListing$(classID: string, nftID: string): Observable<ListedNfts200ResponseListingsInner> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununifi.rest.nftmarket.nftListing(sdk, classID, nftID)),
      map((res) => res.data.listing!),
    );
  }

  async getNftListing(classID: string, nftID: string): Promise<ListedNfts200ResponseListingsInner> {
    const sdk = await this.cosmosSDK.sdk().then((sdk) => sdk.rest);
    const res = await ununifi.rest.nftmarket.nftListing(sdk, classID, nftID);
    return res.data.listing!;
  }

  listAllListedNfts$(): Observable<ListedNfts200ResponseListingsInner[]> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununifi.rest.nftmarket.listedNfts(sdk)),
      map((res) => res.data.listings!),
    );
  }

  listAllListedClasses$(): Observable<ListedClass200Response[]> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununifi.rest.nftmarket.listedClasses(sdk)),
      map((res) => res.data.classes!),
    );
  }

  listListedClass$(classID: string, limit: number): Observable<ListedClass200Response> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununifi.rest.nftmarket.listedClass(sdk, classID, limit)),
      map((res) => res.data!),
    );
  }

  listNftBids$(classID: string, nftID: string): Observable<BidderBids200ResponseBidsInner[]> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununifi.rest.nftmarket.nftBids(sdk, classID, nftID)),
      map((res) => res.data.bids!),
    );
  }

  listBidderBids$(address: string): Observable<BidderBids200ResponseBidsInner[]> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununifi.rest.nftmarket.bidderBids(sdk, address)),
      map((res) => res.data.bids!),
    );
  }

  listAllLoans$(): Observable<Loans200ResponseLoansInner[]> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununifi.rest.nftmarket.loans(sdk)),
      map((res) => res.data.loans!),
    );
  }

  getLoan$(classID: string, nftID: string): Observable<Loan200Response> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununifi.rest.nftmarket.loan(sdk, classID, nftID)),
      map((res) => res.data),
    );
  }

  getLiquidation$(classID: string, nftID: string): Observable<Liquidation200ResponseLiquidations> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununifi.rest.nftmarket.liquidation(sdk, classID, nftID)),
      map((res) => res.data.liquidations!),
    );
  }

  // To do update @cosmosclient/core
  getNft$(classID: string, nftID: string): Observable<Nft> {
    return this.restSdk$.pipe(
      mergeMap((sdk) =>
        this.http.get(sdk.url + '/cosmos/nft/v1beta1/nfts/' + classID + '/' + nftID),
      ),
    );
  }

  async getNft(classID: string, nftID: string): Promise<Nft> {
    const sdk = await this.cosmosSDK.sdk().then((sdk) => sdk.rest);
    const res = await this.http
      .get(sdk.url + '/cosmos/nft/v1beta1/nfts/' + classID + '/' + nftID)
      .toPromise();
    return res;
  }

  listOwnNfts$(address: string): Observable<Nfts> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => this.http.get(sdk.url + '/cosmos/nft/v1beta1/nfts?owner=' + address)),
    );
  }
}
