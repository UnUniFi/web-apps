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
  'nft',
  'wasm',
  'yieldaggregator',
  // 'derivatives',
  // 'pricefeed',
  // 'nftbackedloan',
  // 'nftfactory',
  // 'ecosystemincentive',
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
];

const externalChains = [
  {
    id: 'cosmoshub',
    chainId: 'cosmoshub-4',
    chainName: 'Cosmos Hub',
    rpc: 'https://rpc-cosmoshub.keplr.app',
    rest: 'https://lcd-cosmoshub.keplr.app',
    bip44: { coinType: 118 },
    bech32Config: {
      bech32PrefixAccAddr: 'cosmos',
      bech32PrefixAccPub: 'cosmospub',
      bech32PrefixConsAddr: 'cosmosvalcons',
      bech32PrefixConsPub: 'cosmosvalconspub',
      bech32PrefixValAddr: 'cosmosvaloper',
      bech32PrefixValPub: 'cosmosvaloperpub',
    },
    currencies: [
      {
        coinDecimals: 6,
        coinDenom: 'ATOM',
        coinGeckoId: 'cosmos',
        coinMinimalDenom: 'uatom',
        coinImageUrl:
          'https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/cosmoshub/uatom.png',
      },
    ],
    feeCurrencies: [
      {
        coinDecimals: 6,
        coinDenom: 'ATOM',
        coinGeckoId: 'cosmos',
        coinMinimalDenom: 'uatom',
        coinImageUrl:
          'https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/cosmoshub/uatom.png',
        gasPriceStep: {
          average: 0.025,
          high: 0.03,
          low: 0.01,
        },
      },
    ],
    stakeCurrency: {
      coinDecimals: 6,
      coinDenom: 'ATOM',
      coinGeckoId: 'cosmos',
      coinMinimalDenom: 'uatom',
      coinImageUrl:
        'https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/cosmoshub/uatom.png',
    },
  },
  {
    id: 'osmosis',
    chainId: 'osmosis-1',
    chainName: 'Osmosis',
    rpc: 'https://rpc-osmosis.keplr.app',
    rest: 'https://lcd-osmosis.keplr.app',
    bip44: { coinType: 118 },
    bech32Config: {
      bech32PrefixAccAddr: 'osmo',
      bech32PrefixAccPub: 'osmopub',
      bech32PrefixValAddr: 'osmovaloper',
      bech32PrefixValPub: 'osmovaloperpub',
      bech32PrefixConsAddr: 'osmovalcons',
      bech32PrefixConsPub: 'osmovalconspub',
    },
    currencies: [
      {
        coinDenom: 'OSMO',
        coinMinimalDenom: 'uosmo',
        coinDecimals: 6,
        coinGeckoId: 'osmosis',
        coinImageUrl:
          'https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/osmosis/uosmo.png',
      },
      {
        coinDenom: 'ION',
        coinMinimalDenom: 'uion',
        coinDecimals: 6,
        coinGeckoId: 'ion',
        coinImageUrl:
          'https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/osmosis/uion.png',
      },
    ],
    feeCurrencies: [
      {
        coinDenom: 'OSMO',
        coinMinimalDenom: 'uosmo',
        coinDecimals: 6,
        coinGeckoId: 'osmosis',
        coinImageUrl:
          'https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/osmosis/uosmo.png',
        gasPriceStep: {
          low: 0.0025,
          average: 0.025,
          high: 0.04,
        },
      },
    ],
    stakeCurrency: {
      coinDenom: 'OSMO',
      coinMinimalDenom: 'uosmo',
      coinDecimals: 6,
      coinGeckoId: 'osmosis',
      coinImageUrl:
        'https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/osmosis/uosmo.png',
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
    externalChains,
    extension: {
      faucet: [
        {
          hasFaucet: true,
          faucetURL: `${location.protocol}//${domainCauchyEA}:${faucetUguuPort}`,
          denom: 'uguu',
          creditAmount: 100,
          maxCredit: 100,
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
    extension: {
      faucet: [
        {
          hasFaucet: true,
          faucetURL: `${location.protocol}//${domainCauchyEB}:${faucetUguuPort}`,
          denom: 'uguu',
          creditAmount: 100,
          maxCredit: 100,
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
    apps,
    denomMetadata,
    externalChains,
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
    apps,
    denomMetadata,
    extension: {
      faucet: [],
      // monitor: {},
      navigations: [],
      messageModules,
    },
  },
];
