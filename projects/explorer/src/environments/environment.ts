const domainCauchyEA = 'ununifi-alpha-test-v3.cauchye.net';
const domainCauchyEB = 'ununifi-alpha-test-v3.cauchye.net';
const domainCauchyEC = 'ununifi-alpha-test-v3.cauchye.net';
const domainCauchyED = 'ununifi-alpha-test-v3.cauchye.net';

const chainID = 'ununifi-alpha-test-v3';
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

export const environment = {
  production: false,
  port: {
    'http:': {
      rest: 1317,
      websocket: 26657,
      ubtc: 8000,
      uguu: 8002,
      jpu: 8004,
      ueth: 8006,
      euu: 8008,
    },
    'https:': {
      rest: 1318,
      websocket: 26658,
      ubtc: 8001,
      uguu: 8003,
      jpu: 8005,
      ueth: 8007,
      euu: 8009,
    },
  },
  configs: [
    // CauchyE A node without Monitor
    {
      id: domainCauchyEA,
      restURL: `https://${domainCauchyEA}`,
      websocketURL: `wss://${domainCauchyEA}`,
      chainID,
      chainName,
      bech32Prefix,
      minimumGasPrices: [
        {
          denom: 'uguu',
          amount: '0.015',
        },
      ],
      extension: {
        faucet: [
          {
            hasFaucet: true,
            faucetURL: `https://${domainCauchyEA}`,
            denom: 'ubtc',
            creditAmount: 100, // amount to credit in max request
            maxCredit: 99, // account has already maxCredit balance cannot claim anymore
          },
          {
            hasFaucet: true,
            faucetURL: `https://${domainCauchyEA}`,
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
      restURL: `https://${domainCauchyEB}`,
      websocketURL: `wss://${domainCauchyEB}`,
      chainID,
      chainName,
      bech32Prefix,
      minimumGasPrices: [
        {
          denom: 'uguu',
          amount: '0.015',
        },
      ],
      extension: {
        faucet: [
          {
            hasFaucet: true,
            faucetURL: `https://${domainCauchyEB}`,
            denom: 'ubtc',
            creditAmount: 100, // amount to credit in max request
            maxCredit: 99, // account has already maxCredit balance cannot claim anymore
          },
          {
            hasFaucet: true,
            faucetURL: `https://${domainCauchyEB}`,
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
      restURL: `https://${domainCauchyEC}`,
      websocketURL: `wss://${domainCauchyEC}`,
      chainID,
      chainName,
      bech32Prefix,
      minimumGasPrices: [
        {
          denom: 'uguu',
          amount: '0.015',
        },
      ],
      extension: {
        faucet: [
          {
            hasFaucet: true,
            faucetURL: `https://${domainCauchyEC}`,
            denom: 'ubtc',
            creditAmount: 100, // amount to credit in max request
            maxCredit: 99, // account has already maxCredit balance cannot claim anymore
          },
          {
            hasFaucet: true,
            faucetURL: `https://${domainCauchyEC}`,
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
      restURL: `https://${domainCauchyED}`,
      websocketURL: `wss://${domainCauchyED}`,
      chainID,
      chainName,
      bech32Prefix,
      minimumGasPrices: [
        {
          denom: 'uguu',
          amount: '0.015',
        },
      ],
      extension: {
        faucet: [
          {
            hasFaucet: true,
            faucetURL: `https://${domainCauchyED}`,
            denom: 'ubtc',
            creditAmount: 100, // amount to credit in max request
            maxCredit: 99, // account has already maxCredit balance cannot claim anymore
          },
          {
            hasFaucet: true,
            faucetURL: `https://${domainCauchyED}`,
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
  ],
};
