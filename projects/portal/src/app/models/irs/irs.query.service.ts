import cosmosclient from '@cosmos-client/core';
import { CosmosSDKService } from '../cosmos-sdk.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, mergeMap, pluck } from 'rxjs/operators';
import ununifi from 'ununifi-client';
import {
  AllTranches200ResponseTranchesInner,
  EstimateMintPtYtPair200Response,
  IrsParams200ResponseParams,
  VaultByContract200ResponseVault,
  VaultDetails200Response,
} from 'ununifi-client/esm/openapi';

@Injectable({
  providedIn: 'root',
})
export class IrsQueryService {
  restSdk$ = this.cosmosSDK.sdk$.pipe(pluck('rest'));

  constructor(private readonly cosmosSDK: CosmosSDKService) { }

  getIRSParam$(): Observable<IrsParams200ResponseParams> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununifi.rest.irs.params(sdk)),
      map((res) => res.data.params!),
    );
  }

  listVaults$(): Observable<VaultByContract200ResponseVault[]> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununifi.rest.irs.vaults(sdk)),
      map((res) => res.data.vaults || []),
    );
  }

  getVaultByContract$(contractAddr: string): Observable<VaultByContract200ResponseVault> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununifi.rest.irs.vaultByContract(sdk, contractAddr)),
      map((res) => res.data.vault!),
    );
  }

  getVaultDetail$(contractAddr: string, maturity: string): Observable<VaultDetails200Response> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununifi.rest.irs.vaultDetails(sdk, contractAddr, maturity)),
      map((res) => res.data),
    );
  }

  listAllTranches$(): Observable<AllTranches200ResponseTranchesInner[]> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununifi.rest.irs.allTranches(sdk)),
      map((res) => res.data.tranches || []),
    );
  }

  listTranchesByContract$(contractAddr: string): Observable<AllTranches200ResponseTranchesInner[]> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununifi.rest.irs.tranches(sdk, contractAddr)),
      map((res) => res.data.tranches || []),
    );
  }

  getTranche$(id: string): Observable<AllTranches200ResponseTranchesInner> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununifi.rest.irs.tranche(sdk, id)),
      map((res) => res.data.tranche!),
    );
  }

  estimateSwapInPool$(poolId: string, denom: string, amount: string): Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununifi.rest.irs.estimateSwapInPool(sdk, poolId, denom, amount)),
      map((res) => res.data.amount!),
    );
  }

  estimateMintPtYtPair$(poolId: string, denom: string, amount: string): Observable<EstimateMintPtYtPair200Response> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununifi.rest.irs.estimateMintPtYtPair(sdk, poolId, denom, amount)),
      map((res) => res.data),
    );
  }

  estimateRedeemYt$(poolId: string, denom: string, amount: string): Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununifi.rest.irs.estimateRedeemYt(sdk, poolId, denom, amount)),
      map((res) => res.data.amount!),
    );
  }
}
