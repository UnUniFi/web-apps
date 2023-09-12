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
  { name: 'NFT Backed Loan', link: '/nft-backed-loan', icon: 'loyalty' },
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
    chainId: 'theta-testnet-001',
    chainName: 'Cosmos Hub testnet',
    rpc: 'https://rpc.sentry-01.theta-testnet.polypore.xyz',
    rest: 'https://rest.sentry-01.theta-testnet.polypore.xyz',
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
    chainId: 'osmo-test-5',
    chainName: 'Osmosis testnet',
    rpc: 'https://rpc.osmotest5.osmosis.zone',
    rest: 'https://lcd.osmotest5.osmosis.zone',
    iyaSourcePort: 'transfer',
    iyaSourceChannel: 'channel-1493',
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
          faucetURL: `${location.protocol}//${domainCauchyEA}:${faucetUbtcPort}`,
          denom: 'ubtc',
          creditAmount: 2000000, // amount to credit in max request
          maxCredit: 2000000, // account has already maxCredit balance cannot claim anymore
        },
        {
          hasFaucet: true,
          faucetURL: `${location.protocol}//${domainCauchyEA}:${faucetUguuPort}`,
          denom: 'uguu',
          creditAmount: 2000000000,
          maxCredit: 2000000000,
        },
        {
          hasFaucet: true,
          faucetURL: `${location.protocol}//${domainCauchyEA}:${faucetUguuPort}`,
          denom: 'uusdc',
          creditAmount: 2000000000,
          maxCredit: 2000000000,
        },
      ],
      monitor: undefined,
      nftMint: {
        enabled: true,
        nftClasses: ['ununifi-1AFC3C85B52311F13161F724B284EF900458E3B3'],
      },
      developer: {
        enabled: true,
        developerURL: `${location.protocol}//${domainCauchyEA}:${developerPort}`,
      },
      navigations: [],
      messageModules,
    },
  },
];
