import { OsmosisAPRs, OsmosisPoolAPRs } from './osmosis-pool.model';
import { OsmosisQueryService } from './osmosis.query.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class OsmosisPoolService {
  constructor(private http: HttpClient, private readonly osmosisQuery: OsmosisQueryService) {}

  async getPoolAPR(poolId: string): Promise<OsmosisPoolAPRs> {
    // average APR
    const avgAPR = await this.getAvgAPR(poolId);
    if (avgAPR) {
      return { totalAPR: avgAPR };
    }

    // aggregate APR
    const aggregateAPR = await this.aggregateAPR(poolId);
    if (aggregateAPR) {
      return aggregateAPR;
    }

    // swap fee APR
    // const swapFeeAPR = await this.getSwapFeeAPR(poolId);
    // if (swapFeeAPR) {
    //   return swapFeeAPR;
    // }
    return { totalAPR: 0 };
  }

  async getAvgAPR(poolId: string): Promise<number | undefined> {
    const apr = await this.osmosisQuery.getAvgAPR(poolId);
    if (!apr) {
      return;
    }
    return Number(apr.APR) / 100;
  }

  async getSwapFeeAPR(poolId: string): Promise<number | undefined> {
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

  async aggregateAPR(poolId: string): Promise<OsmosisPoolAPRs | undefined> {
    try {
      const superfluidAPR = await this.getSuperfluidAPR(poolId);
      const internalGaugeAPR = await this.getInternalLiquidityIncentiveAPR(poolId);
      const externalGaugeAPR = await this.getExternalLiquidityIncentiveAPR(poolId);

      const swapFeeAPR = await this.getSwapFeeAPR(poolId);
      const totalAPR =
        (superfluidAPR || 0) +
        (internalGaugeAPR || 0) +
        (externalGaugeAPR || 0) +
        (swapFeeAPR || 0);
      return {
        totalAPR,
        superfluidAPR,
        internalGaugeAPR,
        externalGaugeAPR,
        swapFeeAPR,
      };
    } catch (error) {
      console.error(error);
      return;
    }
  }

  async getSuperfluidAPR(poolId: string): Promise<number | undefined> {
    const aprs = await this.osmosisQuery.getAPRs(poolId);
    if (!aprs) {
      return;
    }
    const superfluid = Number(aprs[0].apr_list[0].apr_superfluid) / 100;
    const params = await this.osmosisQuery.getMintParams();
    const epochProvision = await this.osmosisQuery.getEpochProvisions();
    const mintingEpochProvision =
      Number(epochProvision?.epoch_provisions) *
      Number(params?.params.distribution_proportions.staking);
    const yearMintingProvision = mintingEpochProvision * 365;
    const supply = await this.osmosisQuery.getSupply('uosmo');
    const inflatedSuperfluid =
      superfluid * (1 + yearMintingProvision / Number(supply?.amount.amount));
    return inflatedSuperfluid;
  }

  async getInternalLiquidityIncentiveAPR(poolId: string): Promise<number | undefined> {
    try {
      const incentivePools = await this.osmosisQuery.getIncentivePools();
      const gaugeId = incentivePools?.incentivized_pools.find(
        (p) => p.pool_id === poolId,
      )?.gauge_id;
      if (!gaugeId) {
        return;
      }
      const distrInfo = await this.osmosisQuery.getDistrInfo();
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

  async getExternalLiquidityIncentiveAPR(poolId: string): Promise<number | undefined> {
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

      let totalAPR = 0;
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
          totalAPR += apr;
        }
      }

      return totalAPR;
    } catch (error) {
      console.error(error);
      return;
    }
  }
}
