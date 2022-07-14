const restPort = location.protocol === 'https:' ? 1318 : 1317;
const websocketPort = location.protocol === 'https:' ? 26658 : 26657;
const faucetUbtcPort = location.protocol === 'https:' ? 8001 : 8000;
const faucetUguuPort = location.protocol === 'https:' ? 8003 : 8002;
const faucetJpuPort = location.protocol === 'https:' ? 8005 : 8004;
const faucetUethPort = location.protocol === 'https:' ? 8007 : 8006;
const faucetEuuPort = location.protocol === 'https:' ? 8009 : 8008;

const domainCauchyEA = 'ununifi-alpha-test-v2.cauchye.net';
const domainCauchyEB = 'ununifi-alpha-test-v2.cauchye.net';
const domainCauchyEC = 'ununifi-alpha-test-v2.cauchye.net';
const domainCauchyED = 'ununifi-alpha-test-v2.cauchye.net';

const chainID = 'ununifi-alpha-test-v2';
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
      faucet: [
        {
          hasFaucet: true,
          faucetURL: `${location.protocol}//${domainCauchyEA}:${faucetUbtcPort}`,
          denom: 'ubtc',
          creditAmount: 100, // amount to credit in max request
          maxCredit: 99, // account has already maxCredit balance cannot claim anymore
        },
        {
          hasFaucet: true,
          faucetURL: `${location.protocol}//${domainCauchyEA}:${faucetUguuPort}`,
          denom: 'uguu',
          creditAmount: 100,
          maxCredit: 99,
        },
        // {
        //   hasFaucet: false,
        //   faucetURL: `${location.protocol}//${domainCauchyEA}:${faucetJpuPort}`,
        //   denom: 'jpu',
        //   creditAmount: 10,
        //   maxCredit: 9,
        // },
        // {
        //   hasFaucet: true,
        //   faucetURL: `${location.protocol}//${domainCauchyEA}:${faucetUethPort}`,
        //   denom: 'ueth',
        //   creditAmount: 1000,
        //   maxCredit: 999,
        // },
        // {
        //   hasFaucet: false,
        //   faucetURL: `${location.protocol}//${domainCauchyEA}:${faucetEuuPort}`,
        //   denom: 'euu',
        //   creditAmount: 10,
        //   maxCredit: 9,
        // },
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
    extension: {
      faucet: [
        {
          hasFaucet: true,
          faucetURL: `${location.protocol}//${domainCauchyEB}:${faucetUbtcPort}`,
          denom: 'ubtc',
          creditAmount: 100, // amount to credit in max request
          maxCredit: 99, // account has already maxCredit balance cannot claim anymore
        },
        {
          hasFaucet: true,
          faucetURL: `${location.protocol}//${domainCauchyEB}:${faucetUguuPort}`,
          denom: 'uguu',
          creditAmount: 100,
          maxCredit: 99,
        },
        // {
        //   hasFaucet: false,
        //   faucetURL: `${location.protocol}//${domainCauchyEB}:${faucetJpuPort}`,
        //   denom: 'jpu',
        //   creditAmount: 10,
        //   maxCredit: 9,
        // },
        // {
        //   hasFaucet: true,
        //   faucetURL: `${location.protocol}//${domainCauchyEB}:${faucetUethPort}`,
        //   denom: 'ueth',
        //   creditAmount: 1000,
        //   maxCredit: 999,
        // },
        // {
        //   hasFaucet: false,
        //   faucetURL: `${location.protocol}//${domainCauchyEB}:${faucetEuuPort}`,
        //   denom: 'euu',
        //   creditAmount: 10,
        //   maxCredit: 9,
        // },
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
    extension: {
      faucet: [
        {
          hasFaucet: true,
          faucetURL: `${location.protocol}//${domainCauchyEC}:${faucetUbtcPort}`,
          denom: 'ubtc',
          creditAmount: 100, // amount to credit in max request
          maxCredit: 99, // account has already maxCredit balance cannot claim anymore
        },
        {
          hasFaucet: true,
          faucetURL: `${location.protocol}//${domainCauchyEC}:${faucetUguuPort}`,
          denom: 'uguu',
          creditAmount: 100,
          maxCredit: 99,
        },
        // {
        //   hasFaucet: false,
        //   faucetURL: `${location.protocol}//${domainCauchyEC}:${faucetJpuPort}`,
        //   denom: 'jpu',
        //   creditAmount: 10,
        //   maxCredit: 9,
        // },
        // {
        //   hasFaucet: true,
        //   faucetURL: `${location.protocol}//${domainCauchyEC}:${faucetUethPort}`,
        //   denom: 'ueth',
        //   creditAmount: 1000,
        //   maxCredit: 999,
        // },
        // {
        //   hasFaucet: false,
        //   faucetURL: `${location.protocol}//${domainCauchyEC}:${faucetEuuPort}`,
        //   denom: 'euu',
        //   creditAmount: 10,
        //   maxCredit: 9,
        // },
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
    extension: {
      faucet: [
        {
          hasFaucet: true,
          faucetURL: `${location.protocol}//${domainCauchyED}:${faucetUbtcPort}`,
          denom: 'ubtc',
          creditAmount: 100, // amount to credit in max request
          maxCredit: 99, // account has already maxCredit balance cannot claim anymore
        },
        {
          hasFaucet: true,
          faucetURL: `${location.protocol}//${domainCauchyED}:${faucetUguuPort}`,
          denom: 'uguu',
          creditAmount: 100,
          maxCredit: 99,
        },
        // {
        //   hasFaucet: false,
        //   faucetURL: `${location.protocol}//${domainCauchyED}:${faucetJpuPort}`,
        //   denom: 'jpu',
        //   creditAmount: 10,
        //   maxCredit: 9,
        // },
        // {
        //   hasFaucet: true,
        //   faucetURL: `${location.protocol}//${domainCauchyED}:${faucetUethPort}`,
        //   denom: 'ueth',
        //   creditAmount: 1000,
        //   maxCredit: 999,
        // },
        // {
        //   hasFaucet: false,
        //   faucetURL: `${location.protocol}//${domainCauchyED}:${faucetEuuPort}`,
        //   denom: 'euu',
        //   creditAmount: 10,
        //   maxCredit: 9,
        // },
      ],
      monitor: undefined,
      navigations: [],
      messageModules,
    },
  },
];
