export type OsmosisPoolAPRs = {
  totalAPR: number;
  superfluidAPR?: number;
  internalGaugeAPR?: number;
  externalGaugeAPR?: number;
  swapFeeAPR?: number;
};

export type OsmosisAPRsPools = OsmosisAPRsPool[];

export type OsmosisAPRsPool = {
  pool_id: number;
  apr_list: {
    start_date: string;
    denom: string;
    symbol: string;
    apr_1d: number;
    apr_7d: number;
    apr_14d: number;
    apr_superfluid: number;
  }[];
};

export type OsmosisAvgAPR = {
  APR: number;
};

export type OsmosisFees = {
  last_update_at: number;
  data: OsmosisFee[];
};

export type OsmosisFee = {
  pool_id: string;
  volume_24h: number;
  volume_7d: number;
  fees_spent_24h: number;
  fees_spent_7d: number;
  fees_percentage: string;
};

export type OsmosisPoolAssets = {
  symbol: string;
  amount: number;
  denom: string;
  coingecko_id: string;
  liquidity: number;
  liquidity_24h_change: number;
  volume_24h: number;
  volume_24h_change: number;
  price: number;
  price_24h_change: number;
  fees: string;
}[];

export type OsmosisIncentivePools = {
  incentivized_pools: {
    pool_id: string;
    lockable_duration: string;
    gauge_id: string;
  }[];
};

export type OsmosisLockableDurations = {
  lockable_durations: string[];
};

type Distribution = {
  lock_query_type: string;
  denom: string;
  duration: string;
  timestamp: string;
};

type Coin = {
  denom: string;
  amount: string;
};

export type OsmosisActiveGauges = {
  data: {
    id: string;
    is_perpetual: boolean;
    distribute_to: Distribution;
    coins: Coin[];
    start_time: string;
    num_epochs_paid_over: string;
    filled_epochs: string;
    distributed_coins: Coin[];
  }[];
};

type Record = {
  gauge_id: string;
  weight: string;
};

type DistributionInfo = {
  total_weight: string;
  records: Record[];
};

export type OsmosisDistrInfo = {
  distr_info: DistributionInfo;
};

type WeightedDeveloperRewardReceiver = {
  address: string;
  weight: string;
};

type DistributionProportions = {
  staking: string;
  pool_incentives: string;
  developer_rewards: string;
  community_pool: string;
};

export type OsmosisMintParams = {
  params: {
    mint_denom: string;
    genesis_epoch_provisions: string;
    epoch_identifier: string;
    reduction_period_in_epochs: string;
    reduction_factor: string;
    distribution_proportions: DistributionProportions;
    weighted_developer_rewards_receivers: WeightedDeveloperRewardReceiver[];
  };
};
export type OsmosisToken = {
  price: number;
  denom: string;
  symbol: string;
  liquidity: number;
  volume_24h: number;
  volume_24h_change: number;
  name: string;
  price_24h_change: number;
  price_7d_change: number;
  exponent: number;
  display: string;
};

export type TokenStream = {
  name: string;
  symbol: string;
  denom: string;
  price: number;
  price_24h_change: number;
  exponent: number;
  display: string;
};

export type OsmosisGaugeIncentive = {
  gauge: {
    id: string;
    is_perpetual: boolean;
    distribute_to: {
      lock_query_type: string;
      denom: string;
      duration: string;
      timestamp: string;
    };
    coins: {
      denom: string;
      amount: string;
    }[];
    start_time: string;
    num_epochs_paid_over: string;
    filled_epochs: string;
    distributed_coins: {
      denom: string;
      amount: string;
    }[];
  };
};

export type OsmosisSymbolPrice = {
  price: number;
  '24h_change': number;
};
