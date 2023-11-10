import {
  OsmosisAvgAPR,
  OsmosisAPRs,
  OsmosisFee,
  OsmosisPoolAssets,
  OsmosisIncentivePools,
  OsmosisLockableDurations,
  OsmosisActiveGauges,
  OsmosisDistrInfo,
  OsmosisMintParams,
  TokenStream,
  OsmosisSymbolPrice,
} from './osmosis-pool.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class OsmosisQueryService {
  constructor(private http: HttpClient) {}

  async getAvgAPR(poolId: string): Promise<OsmosisAvgAPR | undefined> {
    const url = 'https://api-osmosis-chain.imperator.co/cl/v1/apr/avg/' + poolId;
    try {
      const res = await this.http.get(url).toPromise();
      const apr = res as OsmosisAvgAPR;
      return apr;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  async getFee(poolId: string) {
    const url = 'https://api-osmosis.imperator.co/fees/v1/' + poolId;
    try {
      const res = await this.http.get(url).toPromise();
      const fee = res as OsmosisFee;
      return fee;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  async getPool(poolId: string) {
    const url = 'https://api-osmosis.imperator.co/pools/v2/' + poolId;
    try {
      const res = await this.http.get(url).toPromise();
      const fee = res as OsmosisPoolAssets;
      return fee;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  async getAPRs(poolId: string): Promise<OsmosisAPRs | undefined> {
    const url = 'https://api-osmosis.imperator.co/apr/v2/' + poolId;
    try {
      const res = await this.http.get(url).toPromise();
      const aprs = res as OsmosisAPRs;
      return aprs;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  async getDenomStream(denom: string) {
    const url = 'https://api-osmosis.imperator.co/stream/token/v1/denom?denom=' + denom;
    try {
      const res = await this.http.get(url).toPromise();
      const epochProvision = res as TokenStream;
      return epochProvision;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  async getMintParams() {
    const url = 'https://lcd-osmosis.keplr.app/osmosis/mint/v1beta1/params';
    try {
      const res = await this.http.get(url).toPromise();
      const epochProvision = res as OsmosisMintParams;
      return epochProvision;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  async getEpochProvisions() {
    const url = 'https://lcd-osmosis.keplr.app/osmosis/mint/v1beta1/epoch_provisions';
    try {
      const res = await this.http.get(url).toPromise();
      const epochProvision = res as { epoch_provisions: string };
      return epochProvision;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  async getActiveGauges() {
    const url = 'https://app.osmosis.zone/api/active-gauges';
    try {
      const res = await this.http.get(url).toPromise();
      const apr = res as OsmosisActiveGauges;
      return apr;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  async getDistInfo() {
    const url = 'https://lcd-osmosis.keplr.app/osmosis/pool-incentives/v1beta1/distr_info';
    try {
      const res = await this.http.get(url).toPromise();
      const apr = res as OsmosisDistrInfo;
      return apr;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  async getLockableDuration() {
    const url = 'https://lcd-osmosis.keplr.app/osmosis/pool-incentives/v1beta1/lockable_durations';
    try {
      const res = await this.http.get(url).toPromise();
      const apr = res as OsmosisLockableDurations;
      return apr;
    } catch (error) {
      console.error(error);
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
      console.error(error);
      return undefined;
    }
  }

  async getGaugeIncentive(gaugeId: string) {
    const url = 'https://lcd-osmosis.keplr.app/osmosis/incentives/v1beta1/gauge_by_id/' + gaugeId;
    try {
      const res = await this.http.get(url).toPromise();
      const apr = res as OsmosisIncentivePools;
      return apr;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  async getSymbol(denom: string) {
    const url = 'https://api-osmosis.imperator.co/search/v1/symbol?denom=' + denom;
    try {
      const res = await this.http.get(url).toPromise();
      const symbol = res as { symbol: string };
      return symbol;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  async getPrice(symbol: string) {
    const url = 'https://api-osmosis.imperator.co/tokens/v2/price/' + symbol;
    try {
      const res = await this.http.get(url).toPromise();
      const symbol = res as OsmosisSymbolPrice;
      return symbol;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }
}
