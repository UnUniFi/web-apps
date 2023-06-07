import { CosmosSDKService } from '../cosmos-sdk.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import { CosmosSDK } from '@cosmos-client/core/cjs/sdk';
import { Observable } from 'rxjs';
import { map, mergeMap, pluck } from 'rxjs/operators';
import ununifi from 'ununifi-client';
import {
  EcosystemIncentiveParams200ResponseParams,
  RecipientContainer200ResponseRecipientContainer,
} from 'ununifi-client/esm/openapi';

@Injectable({ providedIn: 'root' })
export class IncentiveQueryService {
  private restSdk$: Observable<CosmosSDK>;

  constructor(private http: HttpClient, private cosmosSDK: CosmosSDKService) {
    this.restSdk$ = this.cosmosSDK.sdk$.pipe(pluck('rest'));
  }
  getEcosystemIncentiveParams$(): Observable<EcosystemIncentiveParams200ResponseParams> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununifi.rest.ecosystemincentive.params(sdk)),
      map((res) => res.data.params!),
    );
  }

  getRecipientContainer$(id: string): Observable<RecipientContainer200ResponseRecipientContainer> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununifi.rest.ecosystemincentive.recipientContainer(sdk, id)),
      map((res) => res.data.recipient_container!),
    );
  }

  getAllRewards$(subjectAddr: string): Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin[]> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununifi.rest.ecosystemincentive.allRewards(sdk, subjectAddr)),
      map((res) => res.data.rewards?.rewards!),
    );
  }

  getReward$(
    subjectAddr: string,
    denom: string,
  ): Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununifi.rest.ecosystemincentive.reward(sdk, subjectAddr, denom)),
      map((res) => res.data.reward!),
    );
  }

  belongingRecipientContainerIdsByAddr$(address: string): Observable<string[]> {
    return this.restSdk$.pipe(
      mergeMap((sdk) =>
        ununifi.rest.ecosystemincentive.belongingRecipientContainerIdsByAddr(sdk, address),
      ),
      map((res) => res.data.recipient_container_ids!),
    );
  }
}
