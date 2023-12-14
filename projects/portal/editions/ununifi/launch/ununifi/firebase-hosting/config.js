const restPort = location.protocol === 'https:' ? 1318 : 1317;
const websocketPort = location.protocol === 'https:' ? 26658 : 26657;
const faucetUbtcPort = location.protocol === 'https:' ? 8000 : 7000;
const faucetUguuPort = location.protocol === 'https:' ? 8002 : 7002;

const domainCauchyEA = 'a.lcd.ununifi.cauchye.net';
const domainCauchyEB = 'b.lcd.ununifi.cauchye.net';
const domainCauchyEC = 'ununifi.mainnet.lcd-01.kabab.io';
const domainCauchyED = 'ununifi.mainnet.lcd-02.kabab.io';

const chainID = 'ununifi-beta-v1';
const chainName = 'UnUniFi';

const bech32Prefix = {
  accAddr: 'ununifi',
  accPub: 'ununifipub',
  valAddr: 'ununifivaloper',
  valPub: 'ununifivaloperpub',
  consAddr: 'ununifivalcons',
  consPub: 'ununifivalconspub',
};

const messageModules = [
  'bank',
  'auth',
  'crisis',
  'distribution',
  'evidence',
  'genaccounts',
  'gov',
  'ibc',
  'slashing',
  'staking',
  'auction',
  'ununifidist',
  'cdp',
  'incentive',
  'pricefeed',
];

const apps = [
  { name: 'Utilities', link: '/', icon: 'assistant' },
  // { name: 'NFT Backed Loan', link: '/nft-backed-loan', icon: 'loyalty' },
  { name: 'Yield Aggregator', link: '/yield-aggregator/vaults', icon: 'pie_chart' },
  // { name: 'Derivatives', link: '/derivatives/perpetual-futures', icon: 'show_chart' },
];

const denomMetadata = [
  {
    description: 'The governance token of UnUniFi protocol.',
    denom_units: [
      {
        denom: 'uguu',
        exponent: 0,
      },
      {
        denom: 'guu',
        exponent: 6,
      },
    ],
    base: 'uguu',
    name: 'UnUniFi',
    display: 'GUU',
    symbol: 'GUU',
  },
  {
    description: 'The governance token of OSMOSIS.',
    denom_units: [
      {
        denom: 'uosmo',
        exponent: 0,
      },
      {
        denom: 'osmo',
        exponent: 6,
      },
    ],
    base: 'uosmo',
    name: 'OSMOSIS',
    display: 'OSMO',
    symbol: 'OSMO',
  },
  {
    description: 'The governance token of Cosmos Hub.',
    denom_units: [
      {
        denom: 'uatom',
        exponent: 0,
      },
      {
        denom: 'atom',
        exponent: 6,
      },
    ],
    base: 'uatom',
    name: 'COSMOS',
    display: 'ATOM',
    symbol: 'ATOM',
  },
  {
    description: 'The first cryptocurrency invented in 2008',
    denom_units: [
      {
        denom: 'ubtc',
        exponent: 0,
        aliases: [],
      },
      {
        denom: 'btc',
        exponent: 6,
        aliases: [],
      },
    ],
    base: 'ubtc',
    display: 'BTC',
    name: 'Bitcoin',
    symbol: 'BTC',
  },
  {
    description: 'The currency of the U.S.A.',
    denom_units: [
      {
        denom: 'uusd',
        exponent: 0,
        aliases: [],
      },
      {
        denom: 'usd',
        exponent: 6,
        aliases: [],
      },
    ],
    base: 'uusd',
    display: 'USD',
    name: 'US Dollar',
    symbol: 'USD',
  },
  {
    description: 'Stablecoin pegged to the USD',
    denom_units: [
      {
        denom: 'uusdc',
        exponent: 0,
        aliases: [],
      },
      {
        denom: 'uusdc',
        exponent: 6,
        aliases: [],
      },
    ],
    base: 'uusdc',
    display: 'USDC',
    name: 'USD Coin',
    symbol: 'USDC',
  },
  {
    description: 'Derivatives Liquidity Provider Token',
    denom_units: [
      {
        denom: 'udlp',
        exponent: 0,
        aliases: [],
      },
      {
        denom: 'dlp',
        exponent: 6,
        aliases: [],
      },
    ],
    base: 'udlp',
    name: 'Liquidity Provider',
    display: 'DLP',
    symbol: 'DLP',
  },
  {
    description: 'ATOM from Osmosis',
    denom_units: [
      {
        denom: 'ibc/20D06D04E1BC1FAC482FECC06C2E2879A596904D64D8BA3285B4A3789DEAF910',
        exponent: 0,
        aliases: [],
      },
    ],
    base: 'ibc/20D06D04E1BC1FAC482FECC06C2E2879A596904D64D8BA3285B4A3789DEAF910',
    name: 'ATOM from Osmosis',
    display: 'ATOM.osmosis',
    symbol: 'ATOM',
  },
  {
    description: 'USDC from Osmosis',
    denom_units: [
      {
        denom: 'ibc/A01367FF44D9DE359A984FC14EC5227AA96ED08B8B4B31B539BB63B9B9305F80',
        exponent: 0,
        aliases: [],
      },
    ],
    base: 'ibc/A01367FF44D9DE359A984FC14EC5227AA96ED08B8B4B31B539BB63B9B9305F80',
    name: 'USDC from Osmosis',
    display: 'USDC.osmosis',
    symbol: 'USDC',
  },
  {
    description: 'OSMO from Osmosis',
    denom_units: [
      {
        denom: 'ibc/05AC4BBA78C5951339A47DD1BC1E7FC922A9311DF81C85745B1C162F516FF2F1',
        exponent: 0,
        aliases: [],
      },
    ],
    base: 'ibc/05AC4BBA78C5951339A47DD1BC1E7FC922A9311DF81C85745B1C162F516FF2F1',
    name: 'OSMO from Osmosis',
    display: 'OSMO.osmosis',
    symbol: 'OSMO',
  },
  {
    description: 'ATOM from CosmosHub',
    denom_units: [
      {
        denom: 'ibc/25418646C017D377ADF3202FF1E43590D0DAE3346E594E8D78176A139A928F88',
        exponent: 0,
        aliases: [],
      },
    ],
    base: 'ibc/25418646C017D377ADF3202FF1E43590D0DAE3346E594E8D78176A139A928F88',
    name: 'ATOM from CosmosHub',
    display: 'ATOM.cosmoshub',
    symbol: 'ATOM',
  },
];

const certifiedVaults = ['5', '6', '7'];

const strategiesInfo = [
  {
    id: '0',
    denom: 'ibc/20D06D04E1BC1FAC482FECC06C2E2879A596904D64D8BA3285B4A3789DEAF910',
    name: 'Osmosis ATOM/OSMO LP Strategy',
    description: '',
    gitUrl: '',
    unbondingTimeSec: '1209600',
    poolInfo: {
      type: 'osmosis',
      poolId: '1',
      apr: 0.215,
    },
  },
  {
    id: '1',
    denom: 'ibc/20D06D04E1BC1FAC482FECC06C2E2879A596904D64D8BA3285B4A3789DEAF910',
    name: 'Osmosis stATOM/ATOM Strategy (ATOM deposit)',
    description: '',
    gitUrl: '',
    unbondingTimeSec: '1209600',
    poolInfo: {
      type: 'osmosis',
      poolId: '803',
    },
  },
  {
    id: '0',
    denom: 'ibc/05AC4BBA78C5951339A47DD1BC1E7FC922A9311DF81C85745B1C162F516FF2F1',
    name: 'Osmosis ATOM/OSMO strategy (OSMO deposit)',
    description: '',
    gitUrl: '',
    unbondingTimeSec: '1209600',
    poolInfo: {
      type: 'osmosis',
      poolId: '1',
    },
  },
  {
    id: '1',
    denom: 'ibc/05AC4BBA78C5951339A47DD1BC1E7FC922A9311DF81C85745B1C162F516FF2F1',
    name: 'Osmosis AKT/OSMO strategy (OSMO deposit)',
    description: '',
    gitUrl: '',
    unbondingTimeSec: '1209600',
    poolInfo: {
      type: 'osmosis',
      poolId: '3',
    },
  },
];

const configs = [
  // CauchyE A node without Monitor
  {
    id: domainCauchyEA,
    restURL: `${location.protocol}//${domainCauchyEA}:${restPort}`,
    websocketURL: `${location.protocol.replace('http', 'ws')}//${domainCauchyEA}:${websocketPort}`,
    chainID,
    chainName,
    bech32Prefix,
    minimumGasPrices: [
      {
        denom: 'uguu',
        amount: 0.015,
      },
    ],
    apps,
    denomMetadata,
    strategiesInfo,
    certifiedVaults,
    extension: {
      faucet: [
        {
          hasFaucet: true,
          faucetURL: `${location.protocol}//${domainCauchyEA}:${faucetUguuPort}`,
          denom: 'uguu',
          creditAmount: 2000,
          maxCredit: 2000,
        },
      ],
      // monitor: {},
      navigations: [],
      messageModules,
    },
  },
  // CauchyE B node without Monitor
  {
    id: domainCauchyEB,
    restURL: `${location.protocol}//${domainCauchyEB}:${restPort}`,
    websocketURL: `${location.protocol.replace('http', 'ws')}//${domainCauchyEB}:${websocketPort}`,
    chainID,
    chainName,
    bech32Prefix,
    minimumGasPrices: [
      {
        denom: 'uguu',
        amount: 0.015,
      },
    ],
    apps,
    denomMetadata,
    strategiesInfo,
    certifiedVaults,
    extension: {
      faucet: [
        {
          hasFaucet: true,
          faucetURL: `${location.protocol}//${domainCauchyEB}:${faucetUguuPort}`,
          denom: 'uguu',
          creditAmount: 2000,
          maxCredit: 2000,
        },
      ],
      // monitor: {},
      navigations: [],
      messageModules,
    },
  },
];
