const restPort = location.protocol === 'https:' ? 1318 : 1317;
const websocketPort = location.protocol === 'https:' ? 26658 : 26657;
const faucetUbtcPort = location.protocol === 'https:' ? 8001 : 8000;
const faucetUguuPort = location.protocol === 'https:' ? 8003 : 8002;
const faucetJpuPort = location.protocol === 'https:' ? 8005 : 8004;
const faucetUethPort = location.protocol === 'https:' ? 8007 : 8006;
const faucetEuuPort = location.protocol === 'https:' ? 8009 : 8008;

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
    extension: {
      faucet: [],
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
    extension: {
      faucet: [],
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
    extension: {
      faucet: [],
      // monitor: {},
      navigations: [],
      messageModules,
    },
  },
];
