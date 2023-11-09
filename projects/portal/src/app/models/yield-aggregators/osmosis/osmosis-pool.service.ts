import {
  OsmosisApr as OsmosisAvgApr,
  OsmosisAPRs,
  OsmosisFee,
  OsmosisPool as OsmosisPoolAssets,
  OsmosisIncentivePools,
  OsmosisLockableDurations,
} from './osmosis-pool.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class OsmosisPoolService {
  constructor(private http: HttpClient) {}

  async getPoolApr(poolId: string): Promise<number> {
    // average APR
    const avgApr = await this.getAvgApr(poolId);
    if (avgApr) {
      return avgApr;
    }

    // aggregate APR
    const aggregateApr = await this.aggregateApr(poolId);
    if (aggregateApr) {
      return aggregateApr;
    }

    // swap fee APR
    const swapFeeApr = await this.getSwapFeeApr(poolId);
    if (swapFeeApr) {
      return swapFeeApr;
    }
    return 0;
  }

  async getAvgApr(poolId: string): Promise<number | undefined> {
    const url = 'https://api-osmosis-chain.imperator.co/cl/v1/apr/avg/' + poolId;
    try {
      const res = await this.http.get(url).toPromise();
      const apr = res as OsmosisAvgApr;
      return Number(apr.APR) / 100;
    } catch (error) {
      return undefined;
    }
  }

  async getSwapFeeApr(poolId: string): Promise<number | undefined> {
    const feeUrl = 'https://api-osmosis.imperator.co/fees/v1/' + poolId;
    const poolUrl = 'https://api-osmosis.imperator.co/pools/v2/' + poolId;
    try {
      const resFee = await this.http.get(feeUrl).toPromise();
      const fee = resFee as OsmosisFee;
      const feeYear = Number(fee.data[0].fees_spent_7d / 7) * 365;
      const resPool = await this.http.get(poolUrl).toPromise();
      const assets = resPool as OsmosisPoolAssets;
      let tvl = 0;
      for (const asset of assets) {
        tvl += asset.amount * asset.price;
      }
      return feeYear / tvl;
    } catch (error) {
      return undefined;
    }
  }

  async aggregateApr(poolId: string): Promise<number | undefined> {
    try {
      const superfluid = await this.getSuperfluidApr(poolId);
      if (!superfluid) {
        return;
      }
      // todo calculate daily reward
      const dailyReward = 0;
      const swapFee = await this.getSwapFeeApr(poolId);
      if (!swapFee) {
        return;
      }
      return superfluid + dailyReward + swapFee;
    } catch (error) {
      return;
    }
  }

  async getSuperfluidApr(poolId: string): Promise<number | undefined> {
    const url = 'https://api-osmosis.imperator.co/apr/v2/' + poolId;
    try {
      const res = await this.http.get(url).toPromise();
      const apr = res as OsmosisAPRs;
      const superfluid = Number(apr[0].apr_list[0].apr_superfluid) / 100;
      return superfluid;
    } catch (error) {
      return undefined;
    }
  }

  async getActiveGauges(poolId: string) {
    'https://app.osmosis.zone/api/active-gauges';
  }

  async getLockableDuration() {
    const url = 'https://lcd-osmosis.keplr.app/osmosis/pool-incentives/v1beta1/lockable_durations';
    try {
      const res = await this.http.get(url).toPromise();
      const apr = res as OsmosisLockableDurations;
      return apr;
    } catch (error) {
      return undefined;
    }
  }

  async getIncentivePools() {
    const url = 'https://lcd-osmosis.keplr.app/osmosis/pool-incentives/v1beta1/incentivized_pools';
    try {
      const res = await this.http.get(url).toPromise();
      const apr = res as OsmosisIncentivePools;
      return apr;
    } catch (error) {
      return undefined;
    }
  }

  // deprecated
  async getAllOsmoAPRs(): Promise<OsmosisAPRs> {
    const url = 'https://api-osmosis.imperator.co/apr/v2/all';
    return this.http
      .get(url)
      .toPromise()
      .then((res: any) => {
        const pools = res as OsmosisAPRs;
        return pools;
      });
  }

  // deprecated
  async getOsmoAPR(poolId: string): Promise<OsmosisAPRs> {
    const url = 'https://api-osmosis.imperator.co/apr/v2/' + poolId;
    return this.http
      .get(url)
      .toPromise()
      .then((res: any) => {
        const pool = res as OsmosisAPRs;
        return pool;
      });
  }
}
