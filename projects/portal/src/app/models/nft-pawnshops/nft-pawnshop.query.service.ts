import { CosmosSDKService } from '../cosmos-sdk.service';
import { Nft, Nfts } from './nft-pawnshop.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import { CosmosSDK } from '@cosmos-client/core/cjs/sdk';
import { Observable } from 'rxjs';
import { map, mergeMap, pluck } from 'rxjs/operators';
import ununifi from 'ununifi-client';
import {
  BidderBids200ResponseBidsInner,
  Liquidation200ResponseLiquidations,
  ListedClass200Response,
  ListedNft200ResponseListing,
  ListedNfts200ResponseListingsInner,
  Loan200Response,
  NftBackedLoanParams200ResponseParams,
} from 'ununifi-client/esm/openapi';

@Injectable({ providedIn: 'root' })
export class NftPawnshopQueryService {
  private restSdk$: Observable<CosmosSDK>;

  constructor(private http: HttpClient, private cosmosSDK: CosmosSDKService) {
    this.restSdk$ = this.cosmosSDK.sdk$.pipe(pluck('rest'));
  }
  getNftBackedLoanParam$(): Observable<NftBackedLoanParams200ResponseParams> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununifi.rest.nftbackedloan.params(sdk)),
      map((res) => res.data.params!),
    );
  }

  getListedNft$(classID: string, nftID: string): Observable<ListedNft200ResponseListing> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununifi.rest.nftbackedloan.listedNft(sdk, classID, nftID)),
      map((res) => res.data.listing!),
    );
  }

  async getNftListing(classID: string, nftID: string): Promise<ListedNft200ResponseListing> {
    const sdk = await this.cosmosSDK.sdk().then((sdk) => sdk.rest);
    const res = await ununifi.rest.nftbackedloan.listedNft(sdk, classID, nftID);
    return res.data.listing!;
  }

  listAllListedNfts$(): Observable<ListedNfts200ResponseListingsInner[]> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununifi.rest.nftbackedloan.listedNfts(sdk)),
      map((res) => res.data.listings!),
    );
  }

  listAllListedClasses$(classID?: string, limit?: number): Observable<ListedClass200Response[]> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununifi.rest.nftbackedloan.listedClasses(sdk, classID, limit)),
      map((res) => res.data.classes!),
    );
  }

  listListedClass$(classID: string, limit?: number): Observable<ListedClass200Response> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununifi.rest.nftbackedloan.listedClass(sdk, classID, limit)),
      map((res) => res.data!),
    );
  }

  listNftBids$(classID: string, nftID: string): Observable<BidderBids200ResponseBidsInner[]> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununifi.rest.nftbackedloan.nftBids(sdk, classID, nftID)),
      map((res) => res.data.bids!),
    );
  }

  listBidderBids$(address: string): Observable<BidderBids200ResponseBidsInner[]> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununifi.rest.nftbackedloan.bidderBids(sdk, address)),
      map((res) => res.data.bids!),
    );
  }

  getLoan$(classID: string, nftID: string): Observable<Loan200Response> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununifi.rest.nftbackedloan.loan(sdk, classID, nftID)),
      map((res) => res.data),
    );
  }

  getLiquidation$(classID: string, nftID: string): Observable<Liquidation200ResponseLiquidations> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununifi.rest.nftbackedloan.liquidation(sdk, classID, nftID)),
      map((res) => res.data.liquidations!),
    );
  }

  listRewards$(address: string): Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin[]> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununifi.rest.nftbackedloan.rewards(sdk, address)),
      map((res) => res.data.rewards!),
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
