export type OsmosisAPRs = {
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
}[];

export type OsmosisApr = {
  APR: number;
};

export type OsmosisFee = {
  last_update_at: number;
  data: {
    pool_id: number;
    volume_24h: number;
    volume_7d: number;
    fees_spent_24h: number;
    fees_spent_7d: number;
    fees_percentage: string;
  }[];
};

export type OsmosisPool = {
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
  pool_id: string;
  lockable_duration: string;
  gauge_id: string;
}[];

export type OsmosisLockableDurations = {
  lockable_durations: string[];
};
