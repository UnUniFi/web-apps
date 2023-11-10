import { OsmosisAPRs } from './osmosis-pool.model';
import { OsmosisQueryService } from './osmosis.query.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class OsmosisPoolService {
  constructor(private http: HttpClient, private readonly osmosisQuery: OsmosisQueryService) {}

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
    const apr = await this.osmosisQuery.getAvgApr(poolId);
    if (!apr) {
      return;
    }
    return Number(apr.APR) / 100;
  }

  async getSwapFeeApr(poolId: string): Promise<number | undefined> {
    try {
      const fee = await this.osmosisQuery.getFee(poolId);
      if (!fee) {
        return;
      }
      const feeYear = Number(fee.data[0].fees_spent_7d / 7) * 365;
      const assets = await this.osmosisQuery.getPool(poolId);
      if (!assets) {
        return;
      }
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
      console.log('super: ' + superfluid);
      const liquidityIncentiveApr = await this.getInternalLiquidityIncentiveApr(poolId);
      console.log('internal_liquidity: ' + liquidityIncentiveApr);
      const activeGaugeApr = await this.getExternalLiquidityIncentiveApr(poolId);
      console.log('external_liquidity: ' + activeGaugeApr);

      const swapFee = await this.getSwapFeeApr(poolId);
      console.log('swap: ' + swapFee);
      if (
        superfluid === undefined &&
        liquidityIncentiveApr === undefined &&
        swapFee === undefined
      ) {
        return;
      }
      return (
        (superfluid || 0) + (liquidityIncentiveApr || 0) + (activeGaugeApr || 0) + (swapFee || 0)
      );
    } catch (error) {
      console.error(error);
      return;
    }
  }

  async getSuperfluidApr(poolId: string): Promise<number | undefined> {
    const aprs = await this.osmosisQuery.getAprs(poolId);
    if (!aprs) {
      return;
    }
    const superfluid = Number(aprs[0].apr_list[0].apr_superfluid) / 100;
    return superfluid;
  }

  async getInternalLiquidityIncentiveApr(poolId: string): Promise<number | undefined> {
    try {
      const incentivePools = await this.osmosisQuery.getIncentivePools();
      const gaugeId = incentivePools?.incentivized_pools.find(
        (p) => p.pool_id === poolId,
      )?.gauge_id;
      if (!gaugeId) {
        console.log('gaugeId not found');
        return;
      }
      const distrInfo = await this.osmosisQuery.getDistInfo();
      const totalWight = distrInfo?.distr_info.total_weight;
      if (!totalWight) {
        console.log('totalWight not found');
        return;
      }
      const potWeight = distrInfo?.distr_info.records.find((r) => r.gauge_id === gaugeId)?.weight;
      if (!potWeight) {
        console.log('potWeight not found');
        return;
      }
      const epochProvision = await this.osmosisQuery.getEpochProvisions();
      const mintParams = await this.osmosisQuery.getMintParams();
      if (!mintParams?.params.mint_denom) {
        console.log('mint denom not found');
        return;
      }
      const stream = await this.osmosisQuery.getDenomStream(mintParams.params.mint_denom);
      const price = stream?.price;
      if (!price) {
        console.log('price not found');
        return;
      }
      const yearProvision = Number(epochProvision?.epoch_provisions) * 365;
      const yearProvisionToPots =
        yearProvision * Number(mintParams?.params.distribution_proportions.pool_incentives);

      const yearProvisionToPot = (yearProvisionToPots * Number(potWeight)) / Number(totalWight);
      const yearProvisionToPotPrice = (yearProvisionToPot * price) / Math.pow(10, 6);
      const assets = await this.osmosisQuery.getPool(poolId);
      if (!assets) {
        console.log('assets not found');
        return;
      }
      let tvl = 0;
      for (const asset of assets) {
        tvl += asset.amount * asset.price;
      }
      if (tvl === 0) {
        console.log('no tvl');
        return;
      }
      const apr = yearProvisionToPotPrice / tvl;
      return apr;
    } catch (error) {
      console.error(error);
      return;
    }
  }

  async getExternalLiquidityIncentiveApr(poolId: string): Promise<number | undefined> {
    try {
      const activeGauge = await this.osmosisQuery.getActiveGauges();
      const gauges = activeGauge?.data.filter((gauge) => {
        if (gauge.distribute_to.denom.includes('gamm/pool/')) {
          const distributePoolId = gauge.distribute_to.denom.split('/')[2];
          return poolId === distributePoolId;
        }

        if (gauge.distribute_to.denom.includes('cl/pool/')) {
          const distributePoolId = gauge.distribute_to.denom.split('/')[2];
          return poolId === distributePoolId;
        }

        return false;
      });
      if (!gauges?.length) {
        console.log('gauges not found');
        return;
      }
      const assets = await this.osmosisQuery.getPool(poolId);
      if (!assets) {
        console.log('assets not found');
        return;
      }
      let tvl = 0;
      for (const asset of assets) {
        tvl += asset.amount * asset.price;
      }
      if (tvl === 0) {
        console.log('no tvl');
        return;
      }

      let totalApr = 0;
      for (const gauge of gauges || []) {
        console.log(gauge.id);
        const remainingEpoch = parseInt(gauge.num_epochs_paid_over) - parseInt(gauge.filled_epochs);
        if (remainingEpoch <= 0) {
          continue;
        }
        const yearProvision = 365 / remainingEpoch;

        const coins = gauge.coins;
        for (const coin of coins) {
          const symbol = await this.osmosisQuery.getSymbol(coin.denom);
          if (!symbol) {
            continue;
          }
          const price = await this.osmosisQuery.getPrice(symbol.symbol);
          if (!price) {
            continue;
          }
          const externalIncentivePrice = (Number(coin.amount) * price.price) / Math.pow(10, 6);
          const apr = (externalIncentivePrice * yearProvision) / tvl;
          totalApr += apr;
        }
      }

      return totalApr;
    } catch (error) {
      console.error(error);
      return;
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
