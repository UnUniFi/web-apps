const restPort = location.protocol === 'https:' ? 1318 : 1317;
const websocketPort = location.protocol === 'https:' ? 26658 : 26657;
const faucetUbtcPort = location.protocol === 'https:' ? 8001 : 8000;
const faucetUguuPort = location.protocol === 'https:' ? 8003 : 8002;
const faucetJpuPort = location.protocol === 'https:' ? 8005 : 8004;
const faucetUethPort = location.protocol === 'https:' ? 8007 : 8006;
const faucetEuuPort = location.protocol === 'https:' ? 8009 : 8008;
const developerPort = location.protocol === 'https:' ? 3040 : 3030;

const domainCauchyEA = 'ununifi-alpha-test.cauchye.net';

const chainID = 'ununifi-alpha-test';
const chainName = 'UnUniFi (alpha-test)';

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
  { name: 'Interest Rate Swap', link: '/interest-rate-swap/simple-vaults', icon: 'table_chart' },
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
    description: 'ATOM',
    denom_units: [
      {
        denom: 'uatom',
        exponent: 0,
        aliases: [],
      },
    ],
    base: 'uatom',
    name: 'ATOM native',
    display: 'ATOM',
    symbol: 'ATOM',
  },
  {
    description: 'OSMO',
    denom_units: [
      {
        denom: 'uosmo',
        exponent: 0,
        aliases: [],
      },
    ],
    base: 'uosmo',
    name: 'OSMO native',
    display: 'OSMO',
    symbol: 'OSMO',
  },
  {
    description: 'Ethereum',
    denom_units: [
      {
        denom: 'ueth',
        exponent: 0,
        aliases: [],
      },
    ],
    base: 'ueth',
    name: 'ETH native',
    display: 'ETH',
    symbol: 'ETH',
  },
  {
    description: 'USDT',
    denom_units: [
      {
        denom: 'uusdt',
        exponent: 0,
        aliases: [],
      },
    ],
    base: 'uusdt',
    name: 'USDT native',
    display: 'USDT',
    symbol: 'USDT',
  },
];

const strategiesInfo = [];

const certifiedVaults = [];

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

const irsVaultsImages=[
  {
    contract:'ununifi1nc5tatafv6eyq7llkr2gv50ff9e22mnf70qgjlv737ktmt4eswrqhp8g9l',
    image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3794.png',
    subImage: "https://s2.coinmarketcap.com/static/img/coins/64x64/21781.png"
  },
  {
    contract:'ununifi1nc5tatafv6eyq7llkr2gv50ff9e22mjq9q4eswrqhp8g9lrmsdrtrl6yk9',
    image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/12220.png',
    subImage: "https://s2.coinmarketcap.com/static/img/coins/64x64/21781.png"
  },
  {
    contract:'ununifi1nc5tatafv6eyq7llkrmjq9q4eswrqhp8g9lrmsdrtrl6yk92gv50ff9e22',
    image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
    subImage: "https://s2.coinmarketcap.com/static/img/coins/64x64/21781.png"
  },
  {
    contract:'ununifi1nckr2gv50ff9e22mjq9q4eswrqhp8g9lrmsdrtrl6yk95tatafv6eyq7ll',
    image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png',
    subImage: "https://s2.coinmarketcap.com/static/img/coins/64x64/21781.png"
  },
  {
    contract:'ununifi1nckr2gv50ff9e22mjq9q4sdrtlrl6yk95tatafv6eyq7leswrqhp8g9lrm',
    image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/825.png',
    subImage: "https://s2.coinmarketcap.com/static/img/coins/64x64/21781.png"
  },
]

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
    externalChains,
    irsVaultsImages,
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
];
