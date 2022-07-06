import { CosmosSDKService } from './cosmos-sdk.service';
import { Injectable } from '@angular/core';
import { CosmosSDK } from '@cosmos-client/core/cjs/sdk';
import { Observable } from 'rxjs';
import { map, mergeMap, pluck } from 'rxjs/operators';
import ununifi from 'ununifi-client';
import { InlineResponse200, InlineResponse2002Params } from 'ununifi-client/esm/openapi';

@Injectable({ providedIn: 'root' })
export class UnunifiRestService {
  private restSdk$: Observable<CosmosSDK>;

  constructor(private cosmosSDK: CosmosSDKService) {
    this.restSdk$ = this.cosmosSDK.sdk$.pipe(pluck('rest'));
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
}
