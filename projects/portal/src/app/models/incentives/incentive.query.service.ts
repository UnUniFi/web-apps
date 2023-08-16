import { CosmosSDKService } from '../cosmos-sdk.service';
import { Injectable } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import { CosmosSDK } from '@cosmos-client/core/cjs/sdk';
import { Observable } from 'rxjs';
import { map, mergeMap, pluck } from 'rxjs/operators';
import ununifi from 'ununifi-client';
import {
  AllRewards200ResponseRewardRecord,
  EcosystemIncentiveParams200ResponseParams,
} from 'ununifi-client/esm/openapi';

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

  getAllRewards$(subjectAddr: string): Observable<AllRewards200ResponseRewardRecord> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununifi.rest.ecosystemIncentive.allRewards(sdk, subjectAddr)),
      map((res) => res.data.reward_record!),
    );
  }

  getReward$(
    subjectAddr: string,
    denom: string,
  ): Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununifi.rest.ecosystemIncentive.reward(sdk, subjectAddr, denom)),
      map((res) => res.data.reward!),
    );
  }
}
