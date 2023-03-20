import { CosmosSDKService } from '../cosmos-sdk.service';
import { Injectable } from '@angular/core';
import { CosmosSDK } from '@cosmos-client/core/cjs/sdk';
import { Observable } from 'rxjs';
import { map, mergeMap, pluck } from 'rxjs/operators';
import ununificlient from 'ununifi-client';
import {
  MarketAll200ResponseMarketsInner,
  Price200ResponsePrice,
} from 'ununifi-client/esm/openapi';

@Injectable({ providedIn: 'root' })
export class PricefeedQueryService {
  private restSdk$: Observable<CosmosSDK>;

  constructor(private cosmosSDK: CosmosSDKService) {
    this.restSdk$ = this.cosmosSDK.sdk$.pipe(pluck('rest'));
  }

  listAllMarkets$(): Observable<MarketAll200ResponseMarketsInner[]> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununificlient.rest.pricefeed.allMarkets(sdk)),
      map((res) => res.data.markets!),
    );
  }

  listAllPrices$(): Observable<Price200ResponsePrice[]> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununificlient.rest.pricefeed.allPrices(sdk)),
      map((res) => res.data.prices!),
    );
  }

  getPrice$(marketId: string): Observable<Price200ResponsePrice> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununificlient.rest.pricefeed.price(sdk, marketId)),
      map((res) => res.data.price!),
    );
  }
}
