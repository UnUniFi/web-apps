const restPort = location.protocol === 'https:' ? 1318 : 1317;
const websocketPort = location.protocol === 'https:' ? 26658 : 26657;
const faucetUbtcPort = location.protocol === 'https:' ? 8001 : 8000;
const faucetUguuPort = location.protocol === 'https:' ? 8003 : 8002;
const faucetJpuPort = location.protocol === 'https:' ? 8005 : 8004;
const faucetUethPort = location.protocol === 'https:' ? 8007 : 8006;
const faucetEuuPort = location.protocol === 'https:' ? 8009 : 8008;
const developerPort = location.protocol === 'https:' ? 3040 : 3030;

const domainCauchyEA = 'gluon-beta.cauchye.net';

const chainID = 'gluon-test-1';
const chainName = 'Gluon (beta)';

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
  { name: 'Interest Rate Swap', link: '/interest-rate-swap/simple-vaults', icon: 'table_chart' },
];

const denomMetadata = [
  {
    description: 'The governance token of Gluon.',
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
    name: 'Gluon',
    display: 'GLU',
    symbol: 'GLU',
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
        denom: 'usdc',
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
    description: 'Stablecoin pegged to ATOM',
    denom_units: [
      {
        denom: 'ustatom',
        exponent: 0,
        aliases: [],
      },

    ],
    base: 'ustatom',
    display: 'stATOM',
    name: 'stATOM',
    symbol: 'stATOM',
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
    contract:'ununifi14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9sm5z28e',
    image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3794.png',
    subImage: "https://s2.coinmarketcap.com/static/img/coins/64x64/21781.png"
  },
  {
    contract:'ununifi1nc5tatafv6eyq7llkr2gv50ff9e22mnf70qgjlv737ktmt4eswrqhp8g9l',
    image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3794.png',
    subImage: "https://s2.coinmarketcap.com/static/img/coins/64x64/21781.png"
  }
]

const configs = [
  // CauchyE A node without Monitor
  {
    id: domainCauchyEA,
    rpc: `${location.protocol}//${domainCauchyEA}`,
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
          creditAmount: 2000000000000,
          maxCredit: 2000000000000,
        },
        {
          hasFaucet: true,
          faucetURL: `${location.protocol}//${domainCauchyEA}:${faucetUguuPort}`,
          denom: 'ustatom',
          creditAmount: 2000000000000,
          maxCredit: 2000000000000,
        },
      ],
      monitor: undefined,
      navigations: [],
      messageModules,
    },
  },
];
