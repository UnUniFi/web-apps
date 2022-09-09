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

export const environment = {
  production: true,
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
          // {
          //   hasFaucet: true,
          //   faucetURL: `${location.protocol}//${domainCauchyEA}:${faucetUbtcPort}`,
          //   denom: 'ubtc',
          //   creditAmount: 100, // amount to credit in max request
          //   maxCredit: 99, // account has already maxCredit balance cannot claim anymore
          // },
          {
            hasFaucet: true,
            faucetURL: `https://${domainCauchyEA}`,
            denom: 'uguu',
            creditAmount: 100,
            maxCredit: 99,
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
          // {
          //   hasFaucet: true,
          //   faucetURL: `${location.protocol}//${domainCauchyEB}:${faucetUbtcPort}`,
          //   denom: 'ubtc',
          //   creditAmount: 100, // amount to credit in max request
          //   maxCredit: 99, // account has already maxCredit balance cannot claim anymore
          // },
          {
            hasFaucet: true,
            faucetURL: `https://${domainCauchyEB}`,
            denom: 'uguu',
            creditAmount: 100,
            maxCredit: 99,
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
          // {
          //   hasFaucet: true,
          //   faucetURL: `${location.protocol}//${domainCauchyEC}:${faucetUbtcPort}`,
          //   denom: 'ubtc',
          //   creditAmount: 100, // amount to credit in max request
          //   maxCredit: 99, // account has already maxCredit balance cannot claim anymore
          // },
          {
            hasFaucet: true,
            faucetURL: `https://${domainCauchyEC}`,
            denom: 'uguu',
            creditAmount: 100,
            maxCredit: 99,
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
          // {
          //   hasFaucet: true,
          //   faucetURL: `${location.protocol}//${domainCauchyED}:${faucetUbtcPort}`,
          //   denom: 'ubtc',
          //   creditAmount: 100, // amount to credit in max request
          //   maxCredit: 99, // account has already maxCredit balance cannot claim anymore
          // },
          {
            hasFaucet: true,
            faucetURL: `https://${domainCauchyED}`,
            denom: 'uguu',
            creditAmount: 100,
            maxCredit: 99,
          },
        ],
        monitor: undefined,
        navigations: [],
        messageModules,
      },
    },
  ],
};
