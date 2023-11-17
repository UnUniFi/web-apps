import { CacheService } from '../../query.cache.service';
import {
  OsmosisAvgAPR,
  OsmosisAPRsPools,
  OsmosisFees,
  OsmosisPoolAssets,
  OsmosisIncentivePools,
  OsmosisLockableDurations,
  OsmosisActiveGauges,
  OsmosisDistrInfo,
  OsmosisMintParams,
  OsmosisToken,
  OsmosisFee,
  OsmosisAPRsPool,
} from './osmosis-pool.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OsmosisQueryService {
  poolsFees$: Observable<OsmosisFees>;
  // pools$: Observable<{ [poolId: string]: OsmosisPoolAssets }>;
  stakingApr$: Observable<string>;
  aprs$: Observable<OsmosisAPRsPools>;
  mintParams$: Observable<OsmosisMintParams>;
  epochProvisions$: Observable<{ epoch_provisions: string }>;
  activeGauges$: Observable<OsmosisActiveGauges>;
  distrInfo$: Observable<OsmosisDistrInfo>;
  lockableDuration$: Observable<OsmosisLockableDurations>;
  incentivizedPools$: Observable<OsmosisIncentivePools>;
  tokens$: Observable<OsmosisToken[]>;

  constructor(private http: HttpClient, private cacheService: CacheService) {
    const poolsFeesUrl = 'https://api-osmosis.imperator.co/fees/v1/pools';
    this.poolsFees$ = this.http.get<OsmosisFees>(poolsFeesUrl);
    // const poolsUrl = 'https://api-osmosis.imperator.co/pools/v2/all?low_liquidity=false';
    // this.pools$ = this.http.get<{ [poolId: string]: OsmosisPoolAssets }>(poolsUrl);
    const stakingAprUrl = 'https://api-osmosis.imperator.co/apr/v2/staking';
    this.stakingApr$ = this.http.get<string>(stakingAprUrl);
    const aprsUrl = 'https://api-osmosis.imperator.co/apr/v2/all';
    this.aprs$ = this.http.get<OsmosisAPRsPools>(aprsUrl);
    const mintParamsUrl = 'https://lcd-osmosis.keplr.app/osmosis/mint/v1beta1/params';
    this.mintParams$ = this.http.get<OsmosisMintParams>(mintParamsUrl);
    const epochProvisionsUrl =
      'https://lcd-osmosis.keplr.app/osmosis/mint/v1beta1/epoch_provisions';
    this.epochProvisions$ = this.http.get<{ epoch_provisions: string }>(epochProvisionsUrl);
    const activeGaugesUrl = 'https://app.osmosis.zone/api/active-gauges';
    this.activeGauges$ = this.http.get<OsmosisActiveGauges>(activeGaugesUrl);
    const distrInfoUrl = 'https://lcd-osmosis.keplr.app/osmosis/pool-incentives/v1beta1/distr_info';
    this.distrInfo$ = this.http.get<OsmosisDistrInfo>(distrInfoUrl);
    const lockableDurationUrl =
      'https://lcd-osmosis.keplr.app/osmosis/pool-incentives/v1beta1/lockable_durations';
    this.lockableDuration$ = this.http.get<OsmosisLockableDurations>(lockableDurationUrl);
    const incentivizedPoolsUrl =
      'https://lcd-osmosis.keplr.app/osmosis/pool-incentives/v1beta1/incentivized_pools';
    this.incentivizedPools$ = this.http.get<OsmosisIncentivePools>(incentivizedPoolsUrl);
    const tokensUrl = 'https://api-osmosis.imperator.co/tokens/v2/all';
    this.tokens$ = this.http.get<OsmosisToken[]>(tokensUrl);
  }

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
    try {
      const fees = await this.poolsFees$.toPromise();
      const fee = fees.data.find((f) => f.pool_id === poolId);
      console.log(fee);
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

  async getAPRs(poolId: string): Promise<OsmosisAPRsPool | undefined> {
    const cacheKey = 'aprs_' + poolId;
    if (this.cacheService.has(cacheKey)) {
      return this.cacheService.get(cacheKey);
    }
    try {
      const aprs = await this.aprs$.toPromise();
      const apr = aprs.find((a) => a.pool_id === Number(poolId));
      this.cacheService.set(cacheKey, apr);
      return apr;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  async getStakingAPR(): Promise<string | undefined> {
    const cacheKey = 'stakingAPR';
    if (this.cacheService.has(cacheKey)) {
      return this.cacheService.get(cacheKey);
    }
    try {
      const apr = await this.stakingApr$.toPromise();
      this.cacheService.set(cacheKey, apr);
      return apr;
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
    try {
      const mintParams = await this.mintParams$.toPromise();
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
    try {
      const epochProvision = await this.epochProvisions$.toPromise();
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
    try {
      const gauges = await this.activeGauges$.toPromise();
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
    try {
      const distrInfo = await this.distrInfo$.toPromise();
      this.cacheService.set(cacheKey, distrInfo);
      return distrInfo;
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
    try {
      const pools = await this.incentivizedPools$.toPromise();
      this.cacheService.set(cacheKey, pools);
      return pools;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  async getTokenByDenom(denom: string): Promise<OsmosisToken | undefined> {
    const cacheKey = 'token_' + denom;
    if (this.cacheService.has(cacheKey)) {
      return this.cacheService.get(cacheKey);
    }
    try {
      const tokens = await this.tokens$.toPromise();
      const token = tokens.find((t) => t.denom === denom);
      this.cacheService.set(cacheKey, token);
      return token;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  async getTokenBySymbol(symbol: string): Promise<OsmosisToken | undefined> {
    const cacheKey = 'token_' + symbol;
    if (this.cacheService.has(cacheKey)) {
      return this.cacheService.get(cacheKey);
    }
    try {
      const tokens = await this.tokens$.toPromise();
      const token = tokens.find((t) => t.symbol === symbol);
      this.cacheService.set(cacheKey, token);
      return token;
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
