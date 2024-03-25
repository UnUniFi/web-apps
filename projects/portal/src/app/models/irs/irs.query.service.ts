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

  getIRSParam$(): Observable<IrsParams200ResponseParams | undefined> {
    return this.restSdk$.pipe(
      mergeMap(async (sdk) => {
        try {
          const res = await ununifi.rest.irs.params(sdk);
          if (!res.data.params) {
            throw new Error('No IRS params');
          }
          return res.data.params;
        } catch (e) {
          console.error('Failed to get IRS params', e);
          return undefined;
        }
      }),
    );
  }

  listVaults$(): Observable<VaultByContract200ResponseVault[] | undefined> {
    return this.restSdk$.pipe(
      mergeMap(async (sdk) => {
        try {
          const res = await ununifi.rest.irs.vaults(sdk);
          if (!res.data.vaults) {
            throw new Error('No IRS vault');
          }
          return res.data.vaults;
        } catch (e) {
          console.error('Failed to get IRS vaults', e);
          return undefined;
        }
      }),
    );
  }

  getVaultByContract$(
    contractAddr: string,
  ): Observable<VaultByContract200ResponseVault | undefined> {
    return this.restSdk$.pipe(
      mergeMap(async (sdk) => {
        try {
          const res = await ununifi.rest.irs.vaultByContract(sdk, contractAddr);
          if (!res.data.vault) {
            throw new Error('No IRS vault');
          }
          return res.data.vault;
        } catch (e) {
          console.error('Failed to get IRS vault', e);
          return undefined;
        }
      }),
    );
  }

  getVaultDetail$(
    contractAddr: string,
    maturity: string,
  ): Observable<VaultDetails200Response | undefined> {
    return this.restSdk$.pipe(
      mergeMap(async (sdk) => {
        try {
          const res = await ununifi.rest.irs.vaultDetails(sdk, contractAddr, maturity);
          return res.data;
        } catch (e) {
          console.error('Failed to get IRS vault detail', e);
          return undefined;
        }
      }),
    );
  }

  listAllTranches$(): Observable<AllTranches200ResponseTranchesInner[] | undefined> {
    return this.restSdk$.pipe(
      mergeMap(async (sdk) => {
        try {
          const res = await ununifi.rest.irs.allTranches(sdk);
          if (!res.data.tranches) {
            throw new Error('No IRS tranche');
          }
          return res.data.tranches;
        } catch (e) {
          console.error('Failed to get IRS tranches', e);
          return undefined;
        }
      }),
    );
  }

  listTranchesByContract$(
    contractAddr: string,
  ): Observable<AllTranches200ResponseTranchesInner[] | undefined> {
    return this.restSdk$.pipe(
      mergeMap(async (sdk) => {
        try {
          const res = await ununifi.rest.irs.tranches(sdk, contractAddr);
          if (!res.data.tranches) {
            throw new Error('No IRS tranche');
          }
          return res.data.tranches;
        } catch (e) {
          console.error('Failed to get IRS tranches', e);
          return undefined;
        }
      }),
    );
  }

  getTranche$(id: string): Observable<AllTranches200ResponseTranchesInner | undefined> {
    return this.restSdk$.pipe(
      mergeMap(async (sdk) => {
        try {
          const res = await ununifi.rest.irs.tranche(sdk, id);
          if (!res.data.tranche) {
            throw new Error('No IRS tranche');
          }
          return res.data.tranche;
        } catch (e) {
          console.error('Failed to get IRS tranche', e);
          return undefined;
        }
      }),
    );
  }

  async estimateSwapInPool(
    poolId: string,
    denom: string,
    amount: string,
  ): Promise<cosmosclient.proto.cosmos.base.v1beta1.ICoin | undefined> {
    const sdk = await this.cosmosSDK.sdk().then((sdk) => sdk.rest);
    try {
      const res = await ununifi.rest.irs.estimateSwapInPool(sdk, poolId, denom, amount);
      return res.data.amount;
    } catch (error) {
      return undefined;
    }
  }

  estimateSwapInPool$(
    poolId: string,
    denom: string,
    amount: string,
  ): Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin | undefined> {
    return this.restSdk$.pipe(
      mergeMap(async (sdk) => {
        try {
          const res = await ununifi.rest.irs.estimateSwapInPool(sdk, poolId, denom, amount);
          if (!res.data.amount) {
            throw new Error('No estimated swap amount');
          }
          return res.data.amount;
        } catch (e) {
          console.error('Failed to estimate', e);
          return undefined;
        }
      }),
    );
  }

  estimateMintPtYtPair$(
    poolId: string,
    denom: string,
    amount: string,
  ): Observable<EstimateMintPtYtPair200Response | undefined> {
    return this.restSdk$.pipe(
      mergeMap(async (sdk) => {
        try {
          const res = await ununifi.rest.irs.estimateMintPtYtPair(sdk, poolId, denom, amount);
          return res.data;
        } catch (e) {
          console.error('Failed to estimate', e);
          return undefined;
        }
      }),
    );
  }

  estimateRedeemPtYtPair$(
    poolId: string,
    denom: string,
    amount: string,
  ): Observable<EstimateRedeemPtYtPair200Response | undefined> {
    return this.restSdk$.pipe(
      mergeMap(async (sdk) => {
        try {
          const res = await ununifi.rest.irs.estimateRedeemPtYtPair(sdk, poolId, denom, amount);
          return res.data;
        } catch (e) {
          console.error('Failed to estimate', e);
          return undefined;
        }
      }),
    );
  }

  estimateMintLiquidity(
    poolId: string,
    denom: string,
    amount: string,
  ): Observable<EstimateMintLiquidityPoolToken200Response | undefined> {
    return this.restSdk$.pipe(
      mergeMap(async (sdk) => {
        try {
          const res = await ununifi.rest.irs.estimateMintLiquidityPoolToken(
            sdk,
            poolId,
            denom,
            amount,
          );
          return res.data;
        } catch (e) {
          console.error('Failed to estimate', e);
          return undefined;
        }
      }),
    );
  }

  estimateRedeemLiquidity$(
    poolId: string,
    amount: string,
  ): Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin[] | undefined> {
    return this.restSdk$.pipe(
      mergeMap(async (sdk) => {
        try {
          const res = await ununifi.rest.irs.estimateRedeemLiquidityPoolToken(sdk, poolId, amount);
          if (!res.data.redeem_amount) {
            throw new Error('No estimated swap amount');
          }
          return res.data.redeem_amount;
        } catch (e) {
          console.error('Failed to estimate', e);
          return undefined;
        }
      }),
    );
  }

  estimateSwapToYt$(
    poolId: string,
    denom: string,
    amount: string,
  ): Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin | undefined> {
    return this.restSdk$.pipe(
      mergeMap(async (sdk) => {
        try {
          const res = await ununifi.rest.irs.estimateSwapToYt(sdk, poolId, denom, amount);
          if (!res.data.yt_amount) {
            throw new Error('No estimated swap amount');
          }
          return res.data.yt_amount;
        } catch (e) {
          console.error('Failed to estimate', e);
          return undefined;
        }
      }),
    );
  }

  estimateRequiredDepositSwapToYt$(
    poolId: string,
    amount: string,
  ): Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin | undefined> {
    return this.restSdk$.pipe(
      mergeMap(async (sdk) => {
        try {
          const res = await ununifi.rest.irs.estimateRequiredDepositSwapToYt(sdk, poolId, amount);
          if (!res.data.required_deposit_amount) {
            throw new Error('No estimated swap amount');
          }
          return res.data.required_deposit_amount;
        } catch (e) {
          console.error('Failed to estimate', e);
          return undefined;
        }
      }),
    );
  }

  estimateRedeemMaturedYt$(
    poolId: string,
    ytAmount: string,
  ): Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin | undefined> {
    return this.restSdk$.pipe(
      mergeMap(async (sdk) => {
        try {
          const res = await ununifi.rest.irs.estimateRedeemMaturedYt(sdk, poolId, ytAmount);
          if (!res.data.redeem_amount) {
            throw new Error('No estimated swap amount');
          }
          return res.data.redeem_amount;
        } catch (e) {
          console.error('Failed to estimate', e);
          return undefined;
        }
      }),
    );
  }

  async getTranchePtAPYs(
    poolId: string,
    depositAmount?: string,
  ): Promise<TranchePtAPYs200Response | undefined> {
    const sdk = await this.cosmosSDK.sdk().then((sdk) => sdk.rest);
    try {
      const res = await ununifi.rest.irs.tranchePtAPYs(sdk, poolId, depositAmount);
      return res.data;
    } catch (error) {
      return undefined;
    }
  }

  getTranchePtAPYs$(
    poolId: string,
    depositAmount?: string,
  ): Observable<TranchePtAPYs200Response | undefined> {
    return this.restSdk$.pipe(
      mergeMap(async (sdk) => {
        try {
          const res = await ununifi.rest.irs.tranchePtAPYs(sdk, poolId, depositAmount);
          return res.data;
        } catch (e) {
          console.error('Failed to get PT APY', e);
          return undefined;
        }
      }),
    );
  }

  async getTrancheYtAPYs(
    poolId: string,
    desiredYtAmount?: string,
  ): Promise<TrancheYtAPYs200Response | undefined> {
    const sdk = await this.cosmosSDK.sdk().then((sdk) => sdk.rest);
    try {
      const res = await ununifi.rest.irs.trancheYtAPYs(sdk, poolId, desiredYtAmount);
      return res.data;
    } catch (error) {
      return undefined;
    }
  }

  getTrancheYtAPYs$(
    poolId: string,
    desiredYtAmount?: string,
  ): Observable<TrancheYtAPYs200Response | undefined> {
    return this.restSdk$.pipe(
      mergeMap(async (sdk) => {
        try {
          const res = await ununifi.rest.irs.trancheYtAPYs(sdk, poolId, desiredYtAmount);
          return res.data;
        } catch (e) {
          console.error('Failed to get YT APY', e);
          return undefined;
        }
      }),
    );
  }

  async getTranchePoolAPYs(
    poolId: string,
    depositAmount?: string,
  ): Promise<TranchePoolAPYs200Response | undefined> {
    const sdk = await this.cosmosSDK.sdk().then((sdk) => sdk.rest);
    try {
      const res = await ununifi.rest.irs.tranchePoolAPYs(sdk, poolId, depositAmount);
      return res.data;
    } catch (error) {
      return undefined;
    }
  }

  getTranchePoolAPYs$(
    poolId: string,
    depositAmount?: string,
  ): Observable<TranchePoolAPYs200Response | undefined> {
    return this.restSdk$.pipe(
      mergeMap(async (sdk) => {
        try {
          const res = await ununifi.rest.irs.tranchePoolAPYs(sdk, poolId, depositAmount);
          return res.data;
        } catch (e) {
          console.error('Failed to get pool APY', e);
          return undefined;
        }
      }),
    );
  }
}
