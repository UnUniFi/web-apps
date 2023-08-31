const restPort = location.protocol === 'https:' ? 1318 : 1317;
const websocketPort = location.protocol === 'https:' ? 26658 : 26657;
const faucetUbtcPort = location.protocol === 'https:' ? 8001 : 8000;
const faucetUguuPort = location.protocol === 'https:' ? 8003 : 8002;
const faucetJpuPort = location.protocol === 'https:' ? 8005 : 8004;
const faucetUethPort = location.protocol === 'https:' ? 8007 : 8006;
const faucetEuuPort = location.protocol === 'https:' ? 8009 : 8008;

const domainCauchyEA = 'a.ununifi-test-v1.cauchye.net';
const domainCauchyEB = 'b.ununifi-test-v1.cauchye.net';
const domainCauchyEC = 'c.ununifi-test-v1.cauchye.net';
const domainCauchyED = 'd.ununifi-test-v1.cauchye.net';

const chainID = 'ununifi-test-v1';
const chainName = 'UnUniFi (test)';

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
        denom: 'ibc/ACBD2CEFAC2CC3ED6EEAF67BBDFDF168F1E4EDA159DFE1CA6B4A57A9CAF4DA11',
        exponent: 0,
        aliases: [],
      },
    ],
    base: 'ibc/ACBD2CEFAC2CC3ED6EEAF67BBDFDF168F1E4EDA159DFE1CA6B4A57A9CAF4DA11',
    name: 'ATOM from Osmosis',
    display: 'ATOM.osmosis',
    symbol: 'ATOM',
  },
  {
    description: 'OSMO from Osmosis (deprecated)',
    denom_units: [
      {
        denom: 'ibc/13B2C536BB057AC79D5616B8EA1B9540EC1F2170718CAFF6F0083C966FFFED0B',
        exponent: 0,
        aliases: [],
      },
    ],
    base: 'ibc/13B2C536BB057AC79D5616B8EA1B9540EC1F2170718CAFF6F0083C966FFFED0B',
    name: 'OSMO',
    display: 'OSMO (deprecated)',
    symbol: 'OSMO',
  },
  {
    description: 'OSMO from Osmosis',
    denom_units: [
      {
        denom: 'ibc/646315E3B0461F5FA4C5C8968A88FC45D4D5D04A45B98F1B8294DD82F386DD85',
        exponent: 0,
        aliases: [],
      },
    ],
    base: 'ibc/646315E3B0461F5FA4C5C8968A88FC45D4D5D04A45B98F1B8294DD82F386DD85',
    name: 'OSMO',
    display: 'OSMO',
    symbol: 'OSMO',
  },
];

const strategiesInfo = [
  {
    id: '0',
    name: 'Osmosis ATOM/OSMO Farm',
    description: '',
    gitUrl: '',
    poolInfo: {
      type: 'osmosis',
      poolId: '1',
    },
  },
  {
    id: '1',
    name: 'Osmosis MARS/OSMO Farm',
    description: '',
    gitUrl: '',
    poolInfo: {
      type: 'osmosis',
      poolId: '9',
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
    extension: {
      faucet: [
        {
          hasFaucet: true,
          faucetURL: `${location.protocol}//${domainCauchyEA}:${faucetUguuPort}`,
          denom: 'uguu',
          creditAmount: 2000000000,
          maxCredit: 2000000000,
        },
      ],
      monitor: undefined,
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
    extension: {
      faucet: [
        {
          hasFaucet: true,
          faucetURL: `${location.protocol}//${domainCauchyEB}:${faucetUguuPort}`,
          denom: 'uguu',
          creditAmount: 2000000000,
          maxCredit: 2000000000,
        },
      ],
      monitor: undefined,
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
    apps,
    denomMetadata,
    strategiesInfo,
    extension: {
      faucet: [
        {
          hasFaucet: true,
          faucetURL: `${location.protocol}//${domainCauchyEC}:${faucetUguuPort}`,
          denom: 'uguu',
          creditAmount: 2000000000,
          maxCredit: 2000000000,
        },
      ],
      monitor: undefined,
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
    apps,
    denomMetadata,
    strategiesInfo,
    extension: {
      faucet: [
        {
          hasFaucet: true,
          faucetURL: `${location.protocol}//${domainCauchyED}:${faucetUguuPort}`,
          denom: 'uguu',
          creditAmount: 2000000000,
          maxCredit: 2000000000,
        },
      ],
      monitor: undefined,
      navigations: [],
      messageModules,
    },
  },
];
