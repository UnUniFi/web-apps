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
    display: 'guu',
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
    display: 'osmo',
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
    display: 'atom',
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
    description: 'Decentralized Liquidity Provider Token',
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
    display: 'dlp',
    symbol: 'DLP',
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
    denomMetadata,
    extension: {
      faucet: [
        {
          hasFaucet: true,
          faucetURL: `${location.protocol}//${domainCauchyEA}:${faucetUguuPort}`,
          denom: 'uguu',
          creditAmount: 100000,
          maxCredit: 100000,
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
    denomMetadata,
    extension: {
      faucet: [
        {
          hasFaucet: true,
          faucetURL: `${location.protocol}//${domainCauchyEB}:${faucetUguuPort}`,
          denom: 'uguu',
          creditAmount: 100000,
          maxCredit: 100000,
        },
      ],
      // monitor: {},
      navigations: [],
      messageModules,
    },
  },
  // CauchyE C node without Monitor
  {
    id: domainCauchyEC,
    restURL: `${location.protocol}//${domainCauchyEC}:${restPort}`,
    websocketURL: `${location.protocol.replace('http', 'ws')}//${domainCauchyEC}:${websocketPort}`,
    chainID,
    chainName,
    bech32Prefix,
    minimumGasPrices: [
      {
        denom: 'uguu',
        amount: 0.015,
      },
    ],
    denomMetadata,
    extension: {
      faucet: [],
      // monitor: {},
      navigations: [],
      messageModules,
    },
  },
  // CauchyE D node without Monitor
  {
    id: domainCauchyED,
    restURL: `${location.protocol}//${domainCauchyED}:${restPort}`,
    websocketURL: `${location.protocol.replace('http', 'ws')}//${domainCauchyED}:${websocketPort}`,
    chainID,
    chainName,
    bech32Prefix,
    minimumGasPrices: [
      {
        denom: 'uguu',
        amount: 0.015,
      },
    ],
    denomMetadata,
    extension: {
      faucet: [],
      // monitor: {},
      navigations: [],
      messageModules,
    },
  },
];
