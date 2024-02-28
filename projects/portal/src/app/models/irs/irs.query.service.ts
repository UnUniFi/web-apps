import { CosmosSDKService } from '../cosmos-sdk.service';
import { Injectable } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import { Observable } from 'rxjs';
import { map, mergeMap, pluck } from 'rxjs/operators';
import ununifi from 'ununifi-client';
import {
  AllTranches200ResponseTranchesInner,
  EstimateMintLiquidityPoolToken200Response,
  EstimateMintPtYtPair200Response,
  EstimateRedeemPtYtPair200Response,
  IrsParams200ResponseParams,
  TranchePoolAPYs200Response,
  TranchePtAPYs200Response,
  TrancheYtAPYs200Response,
  VaultByContract200ResponseVault,
  VaultDetails200Response,
} from 'ununifi-client/esm/openapi';

@Injectable({
  providedIn: 'root',
})
export class IrsQueryService {
  restSdk$ = this.cosmosSDK.sdk$.pipe(pluck('rest'));

  constructor(private readonly cosmosSDK: CosmosSDKService) {}

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

  estimateSwapInPool$(
    poolId: string,
    denom: string,
    amount: string,
  ): Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununifi.rest.irs.estimateSwapInPool(sdk, poolId, denom, amount)),
      map((res) => res.data.amount!),
    );
  }

  estimateMintPtYtPair$(
    poolId: string,
    denom: string,
    amount: string,
  ): Observable<EstimateMintPtYtPair200Response> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununifi.rest.irs.estimateMintPtYtPair(sdk, poolId, denom, amount)),
      map((res) => res.data),
    );
  }

  estimateRedeemPtYtPair$(
    poolId: string,
    denom: string,
    amount: string,
  ): Observable<EstimateRedeemPtYtPair200Response> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununifi.rest.irs.estimateRedeemPtYtPair(sdk, poolId, denom, amount)),
      map((res) => res.data!),
    );
  }

  estimateMintLiquidity(
    poolId: string,
    denom: string,
    amount: string,
  ): Observable<EstimateMintLiquidityPoolToken200Response> {
    return this.restSdk$.pipe(
      mergeMap((sdk) =>
        ununifi.rest.irs.estimateMintLiquidityPoolToken(sdk, poolId, denom, amount),
      ),
      map((res) => res.data!),
    );
  }

  estimateRedeemLiquidity(
    poolId: string,
    amount: string,
  ): Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin[]> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununifi.rest.irs.estimateRedeemLiquidityPoolToken(sdk, poolId, amount)),
      map((res) => res.data.redeem_amount!),
    );
  }

  estimateSwapToYt$(
    poolId: string,
    denom: string,
    amount: string,
  ): Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununifi.rest.irs.estimateSwapToYt(sdk, poolId, denom, amount)),
      map((res) => res.data.yt_amount!),
    );
  }

  estimateRequiredDepositSwapToYt$(
    poolId: string,
    amount: string,
  ): Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununifi.rest.irs.estimateRequiredDepositSwapToYt(sdk, poolId, amount)),
      map((res) => res.data.required_deposit_amount!),
    );
  }

  estimateRedeemMaturedYt$(
    poolId: string,
    ytAmount: string,
  ): Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununifi.rest.irs.estimateRedeemMaturedYt(sdk, poolId, ytAmount)),
      map((res) => res.data.redeem_amount!),
    );
  }

  async getTranchePtAPYs(poolId: string): Promise<TranchePtAPYs200Response | undefined> {
    const sdk = await this.cosmosSDK.sdk().then((sdk) => sdk.rest);
    try {
      const res = await ununifi.rest.irs.tranchePtAPYs(sdk, poolId);
      return res.data;
    } catch (error) {
      return undefined;
    }
  }

  getTranchePtAPYs$(poolId: string) {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununifi.rest.irs.tranchePtAPYs(sdk, poolId)),
      map((res) => res.data),
    );
  }

  async getTrancheYtAPYs(poolId: string): Promise<TrancheYtAPYs200Response | undefined> {
    const sdk = await this.cosmosSDK.sdk().then((sdk) => sdk.rest);
    try {
      const res = await ununifi.rest.irs.trancheYtAPYs(sdk, poolId);
      return res.data;
    } catch (error) {
      return undefined;
    }
  }

  getTrancheYtAPYs$(poolId: string) {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununifi.rest.irs.trancheYtAPYs(sdk, poolId)),
      map((res) => res.data),
    );
  }

  async getTranchePoolAPYs(poolId: string): Promise<TranchePoolAPYs200Response | undefined> {
    const sdk = await this.cosmosSDK.sdk().then((sdk) => sdk.rest);
    try {
      const res = await ununifi.rest.irs.tranchePoolAPYs(sdk, poolId);
      return res.data;
    } catch (error) {
      return undefined;
    }
  }

  getTranchePoolAPYs$(poolId: string) {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununifi.rest.irs.tranchePoolAPYs(sdk, poolId)),
      map((res) => res.data),
    );
  }
}
