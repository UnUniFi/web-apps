import { CosmosSDKService } from '../cosmos-sdk.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import { CosmosSDK } from '@cosmos-client/core/cjs/sdk';
import { Observable } from 'rxjs';
import { map, mergeMap, pluck } from 'rxjs/operators';
import ununifi from 'ununifi-client';
import {
  EcosystemincentiveParams200ResponseParams,
  IncentiveUnit200ResponseIncentiveUnit,
  IncentiveUnitIdsByAddr200ResponseIncentiveUnitIdsByAddr,
} from 'ununifi-client/esm/openapi';

@Injectable({ providedIn: 'root' })
export class IncentiveQueryService {
  private restSdk$: Observable<CosmosSDK>;

  constructor(private http: HttpClient, private cosmosSDK: CosmosSDKService) {
    this.restSdk$ = this.cosmosSDK.sdk$.pipe(pluck('rest'));
  }
  getEcosystemIncentiveParams$(): Observable<EcosystemincentiveParams200ResponseParams> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununifi.rest.ecosystemIncentive.params(sdk)),
      map((res) => res.data.params!),
    );
  }

  getIncentiveUnit$(incentiveUnitId: string): Observable<IncentiveUnit200ResponseIncentiveUnit> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununifi.rest.ecosystemIncentive.incentiveUnit(sdk, incentiveUnitId)),
      map((res) => res.data.incentive_unit!),
    );
  }

  getAllRewards$(subjectAddr: string): Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin[]> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununifi.rest.ecosystemIncentive.allRewards(sdk, subjectAddr)),
      map((res) => res.data.rewards?.rewards!),
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

  getRecordedIncentiveUnitId$(classId: string, nftId: string): Observable<string> {
    return this.restSdk$.pipe(
      mergeMap((sdk) =>
        ununifi.rest.ecosystemIncentive.recordedIncentiveUnitId(sdk, classId, nftId),
      ),
      map((res) => res.data.incentive_unit_id!),
    );
  }

  listIncentiveUnitIdsByAddr$(
    address: string,
  ): Observable<IncentiveUnitIdsByAddr200ResponseIncentiveUnitIdsByAddr> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununifi.rest.ecosystemIncentive.incentiveUnitIdsByAddr(sdk, address)),
      map((res) => res.data.incentive_unit_ids_by_addr!),
    );
  }
}
