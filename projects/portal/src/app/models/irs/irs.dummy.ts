import {
  AllTranches200ResponseTranchesInner,
  TranchePoolAPYs200Response,
  TranchePtAPYs200Response,
  TrancheYtAPYs200Response,
  VaultByContract200ResponseVault,
} from 'ununifi-client/esm/openapi';

export const dummyVaults: VaultByContract200ResponseVault[] = [
  {
    strategy_contract: 'ununifi1nc5tatafv6eyq7llkr2gv50ff9e22mnf70qgjlv737ktmt4eswrqhp8g9l',
    name: 'stATOM',
    description: 'stATOM is a stablecoin pegged to the value of ATOM.',
    max_maturity: '31535000',
    cycle: '86400',
    last_tranche_time: '1628582400',
  },
  // {
  //   strategy_contract: 'ununifi1nc5tatafv6eyq7llkr2gv50ff9e22mjq9q4eswrqhp8g9lrmsdrtrl6yk9',
  //   name: 'stOSMO',
  //   description: 'stOSMO is a stablecoin pegged to the value of OSMO.',
  //   max_maturity: '31535000',
  //   cycle: '86400',
  //   last_tranche_time: '1628582400',
  // },
  // {
  //   strategy_contract: 'ununifi1nc5tatafv6eyq7llkrmjq9q4eswrqhp8g9lrmsdrtrl6yk92gv50ff9e22',
  //   name: 'stETH',
  //   description: 'stETH is a stablecoin pegged to the value of ETH.',
  //   max_maturity: '31535000',
  //   cycle: '86400',
  //   last_tranche_time: '1628582400',
  // },
  {
    strategy_contract: 'ununifi1nckr2gv50ff9e22mjq9q4eswrqhp8g9lrmsdrtrl6yk95tatafv6eyq7ll',
    name: 'USDC',
    description: 'USDC is a stablecoin pegged to the value of USD.',
    max_maturity: '31535000',
    cycle: '86400',
    last_tranche_time: '1628582400',
  },
  {
    strategy_contract: 'ununifi1nckr2gv50ff9e22mjq9q4sdrtlrl6yk95tatafv6eyq7leswrqhp8g9lrm',
    name: 'USDT',
    description: 'USDT is a stablecoin pegged to the value of USD.',
    max_maturity: '31535000',
    cycle: '86400',
    last_tranche_time: '1628582400',
  },
];

export const dummyExtendedVaults: (VaultByContract200ResponseVault & {
  denom?: string | undefined;
  maxAPY: number;
})[] = [
  {
    strategy_contract: 'ununifi1nc5tatafv6eyq7llkr2gv50ff9e22mnf70qgjlv737ktmt4eswrqhp8g9l',
    name: 'stATOM',
    description: 'stATOM is a stablecoin pegged to the value of ATOM.',
    max_maturity: '31535000',
    cycle: '86400',
    last_tranche_time: '1628582400',
    denom: 'ustatom',
    maxAPY: 0.1234,
  },
  // {
  //   strategy_contract: 'ununifi1nc5tatafv6eyq7llkr2gv50ff9e22mjq9q4eswrqhp8g9lrmsdrtrl6yk9',
  //   name: 'stOSMO',
  //   description: 'stOSMO is a stablecoin pegged to the value of OSMO.',
  //   max_maturity: '31535000',
  //   cycle: '86400',
  //   last_tranche_time: '1628582400',
  //   denom: 'uosmo',
  //   maxAPY: 0.082,
  // },
  // {
  //   strategy_contract: 'ununifi1nc5tatafv6eyq7llkrmjq9q4eswrqhp8g9lrmsdrtrl6yk92gv50ff9e22',
  //   name: 'stETH',
  //   description: 'stETH is a stablecoin pegged to the value of ETH.',
  //   max_maturity: '31535000',
  //   cycle: '86400',
  //   last_tranche_time: '1628582400',
  //   denom: 'ueth',
  //   maxAPY: 0.071,
  // },
  {
    strategy_contract: 'ununifi1nckr2gv50ff9e22mjq9q4eswrqhp8g9lrmsdrtrl6yk95tatafv6eyq7ll',
    name: 'USDC',
    description: 'USDC is a stablecoin pegged to the value of USD.',
    max_maturity: '31535000',
    cycle: '86400',
    last_tranche_time: '1628582400',
    denom: 'uusdc',
    maxAPY: 0.145,
  },
  {
    strategy_contract: 'ununifi1nckr2gv50ff9e22mjq9q4sdrtlrl6yk95tatafv6eyq7leswrqhp8g9lrm',
    name: 'USDT',
    description: 'USDT is a stablecoin pegged to the value of USD.',
    max_maturity: '31535000',
    cycle: '86400',
    last_tranche_time: '1628582400',
    denom: 'uusdt',
    maxAPY: 0.187,
  },
];

export const dummyTranchePools: AllTranches200ResponseTranchesInner[] = [
  {
    id: '0',
    strategy_contract: 'ununifi1nc5tatafv6eyq7llkr2gv50ff9e22mnf70qgjlv737ktmt4eswrqhp8g9l',
    start_time: '1705490000',
    maturity: '15552000',
    swap_fee: '0.003',
    exit_fee: '0.01',
    total_shares: { denom: 'ustatom', amount: '10000000' },
    pool_assets: [
      { denom: 'ustatom', amount: '5000000' },
      { denom: 'irs/tranche/0/pt', amount: '5000000' },
    ],
  },
  {
    id: '1',
    strategy_contract: 'ununifi1nc5tatafv6eyq7llkr2gv50ff9e22mnf70qgjlv737ktmt4eswrqhp8g9l',
    start_time: '1705490000',
    maturity: '7776000',
    swap_fee: '0.003',
    exit_fee: '0.01',
    total_shares: { denom: 'ustatom', amount: '10000000' },
    pool_assets: [
      { denom: 'ustatom', amount: '5000000' },
      { denom: 'irs/tranche/1/pt', amount: '5000000' },
    ],
  },
  {
    id: '2',
    strategy_contract: 'ununifi1nc5tatafv6eyq7llkr2gv50ff9e22mnf70qgjlv737ktmt4eswrqhp8g9l',
    start_time: '1705490000',
    maturity: '31536000',
    swap_fee: '0.003',
    exit_fee: '0.01',
    total_shares: { denom: 'ustatom', amount: '10000000' },
    pool_assets: [
      { denom: 'ustatom', amount: '5000000' },
      { denom: 'irs/tranche/2/pt', amount: '5000000' },
    ],
  },
  // {
  //   id: '3',
  //   strategy_contract: 'ununifi1nc5tatafv6eyq7llkr2gv50ff9e22mjq9q4eswrqhp8g9lrmsdrtrl6yk9',
  //   start_time: '1705490000',
  //   maturity: '15552000',
  //   swap_fee: '0.003',
  //   exit_fee: '0.01',
  //   total_shares: { denom: 'uosmo', amount: '10000000' },
  //   pool_assets: [
  //     { denom: 'uosmo', amount: '5000000' },
  //     { denom: 'irs/tranche/3/pt', amount: '5000000' },
  //   ],
  // },
  // {
  //   id: '4',
  //   strategy_contract: 'ununifi1nc5tatafv6eyq7llkr2gv50ff9e22mjq9q4eswrqhp8g9lrmsdrtrl6yk9',
  //   start_time: '1705490000',
  //   maturity: '31536000',
  //   swap_fee: '0.003',
  //   exit_fee: '0.01',
  //   total_shares: { denom: 'uosmo', amount: '10000000' },
  //   pool_assets: [
  //     { denom: 'uosmo', amount: '5000000' },
  //     { denom: 'irs/tranche/4/pt', amount: '5000000' },
  //   ],
  // },
  // {
  //   id: '5',
  //   strategy_contract: 'ununifi1nc5tatafv6eyq7llkrmjq9q4eswrqhp8g9lrmsdrtrl6yk92gv50ff9e22',
  //   start_time: '1705490000',
  //   maturity: '15552000',
  //   swap_fee: '0.003',
  //   exit_fee: '0.01',
  //   total_shares: { denom: 'ueth', amount: '10000000' },
  //   pool_assets: [
  //     { denom: 'ueth', amount: '5000000' },
  //     { denom: 'irs/tranche/5/pt', amount: '5000000' },
  //   ],
  // },
  {
    id: '6',
    strategy_contract: 'ununifi1nckr2gv50ff9e22mjq9q4eswrqhp8g9lrmsdrtrl6yk95tatafv6eyq7ll',
    start_time: '1705490000',
    maturity: '15552000',
    swap_fee: '0.003',
    exit_fee: '0.01',
    total_shares: { denom: 'uusdc', amount: '10000000' },
    pool_assets: [
      { denom: 'uusdc', amount: '5000000' },
      { denom: 'irs/tranche/6/pt', amount: '5000000' },
    ],
  },
  {
    id: '7',
    strategy_contract: 'ununifi1nckr2gv50ff9e22mjq9q4eswrqhp8g9lrmsdrtrl6yk95tatafv6eyq7ll',
    start_time: '1705490000',
    maturity: '31536000',
    swap_fee: '0.003',
    exit_fee: '0.01',
    total_shares: { denom: 'uusdc', amount: '10000000' },
    pool_assets: [
      { denom: 'uusdc', amount: '5000000' },
      { denom: 'irs/tranche/7/pt', amount: '5000000' },
    ],
  },
  {
    id: '8',
    strategy_contract: 'ununifi1nckr2gv50ff9e22mjq9q4sdrtlrl6yk95tatafv6eyq7leswrqhp8g9lrm',
    start_time: '1705490000',
    maturity: '15552000',
    swap_fee: '0.003',
    exit_fee: '0.01',
    total_shares: { denom: 'uusdt', amount: '10000000' },
    pool_assets: [
      { denom: 'uusdt', amount: '5000000' },
      { denom: 'irs/tranche/8/pt', amount: '5000000' },
    ],
  },
];

export const dummyFixedAPYs: TranchePtAPYs200Response[] = [
  {
    pt_apy: '0.1234',
  },
  {
    pt_apy: '0.108',
  },
  {
    pt_apy: '0.084',
  },
  {
    pt_apy: '0.04',
  },
  {
    pt_apy: '0.064',
  },
  {
    pt_apy: '0.036',
  },
  {
    pt_apy: '0.099999',
  },
  {
    pt_apy: '0.0802',
  },
  {
    pt_apy: '0.124',
  },
];

export const dummyPoolAPYs: TranchePoolAPYs200Response[] = [
  {
    liquidity_apy: '0.1234',
    discount_pt_apy: '0.108',
    ut_percentage_in_pool: '0.6',
    pt_percentage_in_pool: '0.4',
  },
  {
    liquidity_apy: '0.108',
    discount_pt_apy: '0.084',
    ut_percentage_in_pool: '0.6',
    pt_percentage_in_pool: '0.4',
  },
  {
    liquidity_apy: '0.084',
    discount_pt_apy: '0.04',
    ut_percentage_in_pool: '0.6',
    pt_percentage_in_pool: '0.4',
  },
  {
    liquidity_apy: '0.17',
    discount_pt_apy: '0.064',
    ut_percentage_in_pool: '0.6',
    pt_percentage_in_pool: '0.4',
  },
  {
    liquidity_apy: '0.064',
    discount_pt_apy: '0.036',
    ut_percentage_in_pool: '0.6',
    pt_percentage_in_pool: '0.4',
  },
  {
    liquidity_apy: '0.036',
    discount_pt_apy: '0.099999',
    ut_percentage_in_pool: '0.6',
    pt_percentage_in_pool: '0.4',
  },
  {
    liquidity_apy: '0.099999',
    discount_pt_apy: '0.0802',
    ut_percentage_in_pool: '0.6',
    pt_percentage_in_pool: '0.4',
  },
  {
    liquidity_apy: '0.0802',
    discount_pt_apy: '0.124',
    ut_percentage_in_pool: '0.6',
    pt_percentage_in_pool: '0.4',
  },
  {
    liquidity_apy: '0.124',
    discount_pt_apy: '0.1234',
    ut_percentage_in_pool: '0.6',
    pt_percentage_in_pool: '0.4',
  },
];

export const dummyVaultsMaxAPYs: number[] = [0.1234, 0.064, 0.036, 0.1, 0.124];

export const dummyLongAPYs: TrancheYtAPYs200Response[] = [
  {
    yt_apy: '0.245',
  },
  {
    yt_apy: '0.306',
  },
  {
    yt_apy: '0.211',
  },
  {
    yt_apy: '0.12',
  },
  {
    yt_apy: '0.1',
  },
  {
    yt_apy: '0.136',
  },
  {
    yt_apy: '0.12345567',
  },
  {
    yt_apy: '0.145',
  },
  {
    yt_apy: '0.267',
  },
];
