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

const yieldAggregatorContractAddress =
  'ununifi1v6qjx5smfdxnh5gr8vprswl60rstyprj3wh4gz5mg7gcl7mtl5xqd9l8a9';

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
    description: 'IBC token from transfer/channel-996/uatom',
    denom_units: [
      {
        denom: 'uatom',
        exponent: 0,
        aliases: [],
      },
    ],
    base: 'ibc/ACBD2CEFAC2CC3ED6EEAF67BBDFDF168F1E4EDA159DFE1CA6B4A57A9CAF4DA11',
    name: 'transfer/channel-996/uatom',
    display: 'ATOM.osmosis',
    symbol: 'ATOM',
  },
  {
    description: 'IBC token from transfer/channel-996/uosmo (deprecated)',
    denom_units: [
      {
        denom: 'uosmo',
        exponent: 0,
        aliases: [],
      },
    ],
    base: 'ibc/13B2C536BB057AC79D5616B8EA1B9540EC1F2170718CAFF6F0083C966FFFED0B',
    name: 'IBC token from transfer/channel-996/uosmo (deprecated)',
    display: 'OSMO (deprecated)',
    symbol: 'OSMO',
  },
  {
    description: 'IBC token from transfer/channel-1493/uosmo',
    denom_units: [
      {
        denom: 'uosmo',
        exponent: 0,
        aliases: [],
      },
    ],
    base: 'ibc/646315E3B0461F5FA4C5C8968A88FC45D4D5D04A45B98F1B8294DD82F386DD85',
    name: 'transfer/channel-1493/uosmo IBC token',
    display: 'OSMO',
    symbol: 'OSMO',
  },
];

const strategiesInfo = [
  {
    id: '0',
    denom: 'ibc/13B2C536BB057AC79D5616B8EA1B9540EC1F2170718CAFF6F0083C966FFFED0B',
    name: 'MARS/OSMO strategy',
    description: '',
    gitUrl: '',
    poolInfo: {
      type: 'osmosis',
      poolId: '907',
    },
  },
  {
    id: '0',
    denom: 'ibc/646315E3B0461F5FA4C5C8968A88FC45D4D5D04A45B98F1B8294DD82F386DD85',
    name: 'MARS/OSMO strategy v2',
    description: '',
    gitUrl: '',
    poolInfo: {
      type: 'osmosis',
      poolId: '907',
    },
  },
  {
    id: '1',
    denom: 'ibc/646315E3B0461F5FA4C5C8968A88FC45D4D5D04A45B98F1B8294DD82F386DD85',
    name: 'ATOM/OSMO strategy v2',
    description: '',
    gitUrl: '',
    poolInfo: {
      type: 'osmosis',
      poolId: '1',
    },
  },
  {
    id: '0',
    denom: 'ibc/ACBD2CEFAC2CC3ED6EEAF67BBDFDF168F1E4EDA159DFE1CA6B4A57A9CAF4DA11',
    name: 'Osmosis ATOM/OSMO Farm',
    description: '',
    gitUrl: '',
    poolInfo: {
      type: 'osmosis',
      poolId: '1',
    },
  },
];

const externalChains = [
  {
    chainId: 'theta-testnet-001',
    chainName: 'cosmoshub(test)',
    display: 'Cosmoshub Theta Testnet',
    disabled: true,
    cosmos: true,
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
    chainId: 'osmo-test-5',
    chainName: 'osmosis(test)',
    display: 'Osmosis testnet 5',
    disabled: true,
    cosmos: true,
    rpc: 'https://rpc.osmotest5.osmosis.zone',
    rest: 'https://lcd.osmotest5.osmosis.zone',
    ibcSourcePort: 'transfer',
    ibcSourceChannel: 'channel-1493',
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
    availableTokens: [
      {
        symbol: 'OSMO',
        denom: 'uosmo',
        contractAddress: '',
        decimal: 6,
      },
    ],
  },
  {
    chainId: '5',
    chainName: 'ethereum-2',
    display: 'Ethereum Goerli Testnet',
    disabled: true,
    cosmos: false,
    yieldAggregatorContractAddress: '0x75d8dCEa1Fa5E47526020eE8ADbfAbd583A9a134',
    availableTokens: [
      {
        symbol: 'aUSDC',
        denom: 'uausdc',
        contractAddress: '0x254d06f33bDc5b8ee05b2ea472107E300226659A',
        decimal: 6,
      },
    ],
  },
  {
    chainId: '80001',
    chainName: 'Polygon',
    display: 'Polygon Mumbai Testnet',
    disabled: true,
    cosmos: false,
    yieldAggregatorContractAddress: '0xa5609cb1af27a7C29466A83FC46D84F32e197D4e',
    availableTokens: [
      {
        symbol: 'aUSDC',
        denom: 'uausdc',
        contractAddress: '0x2c852e740B62308c46DD29B982FBb650D063Bd07',
        decimal: 6,
      },
    ],
  },
  {
    chainId: '43113',
    chainName: 'Avalanche',
    display: 'Avalanche Fuji Testnet',
    disabled: true,
    cosmos: false,
    yieldAggregatorContractAddress: '',
    availableTokens: [
      {
        symbol: 'aUSDC',
        denom: 'uausdc',
        contractAddress: '0x57F1c63497AEe0bE305B8852b354CEc793da43bB',
        decimal: 6,
      },
    ],
  },
  {
    chainId: '421613',
    chainName: 'arbitrum',
    display: 'Arbitrum Goerli Testnet',
    disabled: true,
    cosmos: false,
    yieldAggregatorContractAddress: '',
    availableTokens: [
      {
        symbol: 'aUSDC',
        denom: 'uausdc',
        contractAddress: '0x254d06f33bDc5b8ee05b2ea472107E300226659A',
        decimal: 6,
      },
    ],
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
    externalChains,
    yieldAggregatorContractAddress,
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
    externalChains,
    yieldAggregatorContractAddress,
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
    externalChains,
    yieldAggregatorContractAddress,
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
    externalChains,
    yieldAggregatorContractAddress,
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
