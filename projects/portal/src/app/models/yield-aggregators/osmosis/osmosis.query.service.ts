import { CacheService } from '../../query.cache.service';
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
  constructor(private http: HttpClient, private cacheService: CacheService) {}

  async getAvgAPR(poolId: string): Promise<OsmosisAvgAPR | undefined> {
    const cacheKey = 'avgAPR_' + poolId;
    if (this.cacheService.has(cacheKey)) {
      return this.cacheService.get(cacheKey);
    }
    const url = 'https://api-osmosis-chain.imperator.co/cl/v1/apr/avg/' + poolId;
    try {
      const res = await this.http.get(url).toPromise();
      const apr = res as OsmosisAvgAPR;
      this.cacheService.set(cacheKey, apr);
      return apr;
    } catch (error) {
      console.error(error);
      this.cacheService.set(cacheKey, undefined);
      return undefined;
    }
  }

  async getFee(poolId: string): Promise<OsmosisFee | undefined> {
    const cacheKey = 'fee_' + poolId;
    if (this.cacheService.has(cacheKey)) {
      return this.cacheService.get(cacheKey);
    }
    const url = 'https://api-osmosis.imperator.co/fees/v1/' + poolId;
    try {
      const res = await this.http.get(url).toPromise();
      const fee = res as OsmosisFee;
      this.cacheService.set(cacheKey, fee);
      return fee;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  async getPool(poolId: string): Promise<OsmosisPoolAssets | undefined> {
    const cacheKey = 'pool_' + poolId;
    if (this.cacheService.has(cacheKey)) {
      return this.cacheService.get(cacheKey);
    }
    const url = 'https://api-osmosis.imperator.co/pools/v2/' + poolId;
    try {
      const res = await this.http.get(url).toPromise();
      const pool = res as OsmosisPoolAssets;
      this.cacheService.set(cacheKey, pool);
      return pool;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  async getAPRs(poolId: string): Promise<OsmosisAPRs | undefined> {
    const cacheKey = 'aprs_' + poolId;
    if (this.cacheService.has(cacheKey)) {
      return this.cacheService.get(cacheKey);
    }
    const url = 'https://api-osmosis.imperator.co/apr/v2/' + poolId;
    try {
      const res = await this.http.get(url).toPromise();
      const aprs = res as OsmosisAPRs;
      this.cacheService.set(cacheKey, aprs);
      return aprs;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  async getDenomStream(denom: string): Promise<TokenStream | undefined> {
    const cacheKey = 'denomStream_' + denom;
    if (this.cacheService.has(cacheKey)) {
      return this.cacheService.get(cacheKey);
    }
    const url = 'https://api-osmosis.imperator.co/stream/token/v1/denom?denom=' + denom;
    try {
      const res = await this.http.get(url).toPromise();
      const denomStream = res as TokenStream;
      this.cacheService.set(cacheKey, denomStream);
      return denomStream;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  async getMintParams(): Promise<OsmosisMintParams | undefined> {
    const cacheKey = 'mintParams';
    if (this.cacheService.has(cacheKey)) {
      return this.cacheService.get(cacheKey);
    }
    const url = 'https://lcd-osmosis.keplr.app/osmosis/mint/v1beta1/params';
    try {
      const res = await this.http.get(url).toPromise();
      const mintParams = res as OsmosisMintParams;
      this.cacheService.set(cacheKey, mintParams);
      return mintParams;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  async getEpochProvisions(): Promise<{ epoch_provisions: string } | undefined> {
    const cacheKey = 'epochProvisions';
    if (this.cacheService.has(cacheKey)) {
      return this.cacheService.get(cacheKey);
    }
    const url = 'https://lcd-osmosis.keplr.app/osmosis/mint/v1beta1/epoch_provisions';
    try {
      const res = await this.http.get(url).toPromise();
      const epochProvision = res as { epoch_provisions: string };
      this.cacheService.set(cacheKey, epochProvision);
      return epochProvision;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  async getActiveGauges(): Promise<OsmosisActiveGauges | undefined> {
    const cacheKey = 'activeGauges';
    if (this.cacheService.has(cacheKey)) {
      return this.cacheService.get(cacheKey);
    }
    const url = 'https://app.osmosis.zone/api/active-gauges';
    try {
      const res = await this.http.get(url).toPromise();
      const gauges = res as OsmosisActiveGauges;
      this.cacheService.set(cacheKey, gauges);
      return gauges;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  async getDistrInfo(): Promise<OsmosisDistrInfo | undefined> {
    const cacheKey = 'distrInfo';
    if (this.cacheService.has(cacheKey)) {
      return this.cacheService.get(cacheKey);
    }
    const url = 'https://lcd-osmosis.keplr.app/osmosis/pool-incentives/v1beta1/distr_info';
    try {
      const res = await this.http.get(url).toPromise();
      const distrInfo = res as OsmosisDistrInfo;
      this.cacheService.set(cacheKey, distrInfo);
      return distrInfo;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  async getLockableDuration(): Promise<OsmosisLockableDurations | undefined> {
    const cacheKey = 'lockableDuration';
    if (this.cacheService.has(cacheKey)) {
      return this.cacheService.get(cacheKey);
    }
    const url = 'https://lcd-osmosis.keplr.app/osmosis/pool-incentives/v1beta1/lockable_durations';
    try {
      const res = await this.http.get(url).toPromise();
      const lockableDuration = res as OsmosisLockableDurations;
      this.cacheService.set(cacheKey, lockableDuration);
      return lockableDuration;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  async getIncentivePools(): Promise<OsmosisIncentivePools | undefined> {
    const cacheKey = 'incentivePools';
    if (this.cacheService.has(cacheKey)) {
      return this.cacheService.get(cacheKey);
    }
    const url = 'https://lcd-osmosis.keplr.app/osmosis/pool-incentives/v1beta1/incentivized_pools';
    try {
      const res = await this.http.get(url).toPromise();
      const pools = res as OsmosisIncentivePools;
      this.cacheService.set(cacheKey, pools);
      return pools;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  async getGaugeIncentive(gaugeId: string): Promise<OsmosisIncentivePools | undefined> {
    const cacheKey = 'gaugeIncentive_' + gaugeId;
    const url = 'https://lcd-osmosis.keplr.app/osmosis/incentives/v1beta1/gauge_by_id/' + gaugeId;
    try {
      const res = await this.http.get(url).toPromise();
      const incentivePools = res as OsmosisIncentivePools;
      this.cacheService.set(cacheKey, incentivePools);
      return incentivePools;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  async getSymbol(denom: string): Promise<{ symbol: string } | undefined> {
    const cacheKey = 'symbol_' + denom;
    if (this.cacheService.has(cacheKey)) {
      return this.cacheService.get(cacheKey);
    }
    const url = 'https://api-osmosis.imperator.co/search/v1/symbol?denom=' + denom;
    try {
      const res = await this.http.get(url).toPromise();
      const symbol = res as { symbol: string };
      this.cacheService.set(cacheKey, symbol);
      return symbol;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  async getPrice(symbol: string): Promise<OsmosisSymbolPrice | undefined> {
    const cacheKey = 'price_' + symbol;
    if (this.cacheService.has(cacheKey)) {
      return this.cacheService.get(cacheKey);
    }
    const url = 'https://api-osmosis.imperator.co/tokens/v2/price/' + symbol;
    try {
      const res = await this.http.get(url).toPromise();
      const price = res as OsmosisSymbolPrice;
      this.cacheService.set(cacheKey, price);
      return price;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  async getSupply(
    denom: string,
  ): Promise<{ amount: { denom: string; amount: string } } | undefined> {
    const cacheKey = 'supply_' + denom;
    if (this.cacheService.has(cacheKey)) {
      return this.cacheService.get(cacheKey);
    }
    const url = 'https://lcd-osmosis.keplr.app/cosmos/bank/v1beta1/supply/' + denom;
    try {
      const res = await this.http.get(url).toPromise();
      const supply = res as { amount: { denom: string; amount: string } };
      this.cacheService.set(cacheKey, supply);
      return supply;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }
}
