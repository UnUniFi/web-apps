import { CosmosSDKService } from '../cosmos-sdk.service';
import { Injectable } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import { CosmosSDK } from '@cosmos-client/core/cjs/sdk';
import { Observable } from 'rxjs';
import { map, mergeMap, pluck } from 'rxjs/operators';
import ununifi from 'ununifi-client';
import { EcosystemIncentiveParams200ResponseParams } from 'ununifi-client/esm/openapi';

@Injectable({ providedIn: 'root' })
export class IncentiveQueryService {
  private restSdk$: Observable<CosmosSDK>;

  constructor(private cosmosSDK: CosmosSDKService) {
    this.restSdk$ = this.cosmosSDK.sdk$.pipe(pluck('rest'));
  }
  getEcosystemIncentiveParams$(): Observable<EcosystemIncentiveParams200ResponseParams> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununifi.rest.ecosystemIncentive.params(sdk)),
      map((res) => res.data.params!),
    );
  }

  getEcosystemRewards$(
    address: string,
    denom?: string,
  ): Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin[]> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununifi.rest.ecosystemIncentive.ecosystemRewards(sdk, address, denom)),
      map((res) => res.data.rewards!),
    );
  }
}
