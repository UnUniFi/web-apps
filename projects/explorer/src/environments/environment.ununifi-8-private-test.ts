const domainCauchyEA = 'a.private-test.ununifi.cauchye.net';
const domainCauchyEB = 'b.private-test.ununifi.cauchye.net';
const domainCauchyEC = 'c.private-test.ununifi.cauchye.net';
const domainCauchyED = 'd.private-test.ununifi.cauchye.net';

const chainID = 'ununifi-8-private-test';
const chainName = 'UnUniFi (ununifi-8-private-test)';

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
            creditAmount: 2000000,
            maxCredit: 1999999,
          },
          {
            hasFaucet: false,
            faucetURL: `https://${domainCauchyEA}`,
            denom: 'jpu',
            creditAmount: 10,
            maxCredit: 9,
          },
          {
            hasFaucet: true,
            faucetURL: `https://${domainCauchyEA}`,
            denom: 'ueth',
            creditAmount: 1000,
            maxCredit: 999,
          },
          {
            hasFaucet: false,
            faucetURL: `https://${domainCauchyEA}`,
            denom: 'euu',
            creditAmount: 10,
            maxCredit: 9,
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
            creditAmount: 2000000,
            maxCredit: 1999999,
          },
          {
            hasFaucet: false,
            faucetURL: `https:${domainCauchyEB}`,
            denom: 'jpu',
            creditAmount: 10,
            maxCredit: 9,
          },
          {
            hasFaucet: true,
            faucetURL: `https:${domainCauchyEB}`,
            denom: 'ueth',
            creditAmount: 1000,
            maxCredit: 999,
          },
          {
            hasFaucet: false,
            faucetURL: `https:${domainCauchyEB}`,
            denom: 'euu',
            creditAmount: 10,
            maxCredit: 9,
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
            creditAmount: 2000000,
            maxCredit: 1999999,
          },
          {
            hasFaucet: false,
            faucetURL: `https://${domainCauchyEC}`,
            denom: 'jpu',
            creditAmount: 10,
            maxCredit: 9,
          },
          {
            hasFaucet: true,
            faucetURL: `https://${domainCauchyEC}`,
            denom: 'ueth',
            creditAmount: 1000,
            maxCredit: 999,
          },
          {
            hasFaucet: false,
            faucetURL: `https://${domainCauchyEC}`,
            denom: 'euu',
            creditAmount: 10,
            maxCredit: 9,
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
            creditAmount: 2000000,
            maxCredit: 1999999,
          },
          {
            hasFaucet: false,
            faucetURL: `https://${domainCauchyED}`,
            denom: 'jpu',
            creditAmount: 10,
            maxCredit: 9,
          },
          {
            hasFaucet: true,
            faucetURL: `https://${domainCauchyED}`,
            denom: 'ueth',
            creditAmount: 1000,
            maxCredit: 999,
          },
          {
            hasFaucet: false,
            faucetURL: `https://${domainCauchyED}`,
            denom: 'euu',
            creditAmount: 10,
            maxCredit: 9,
          },
        ],
        monitor: undefined,
        navigations: [],
        messageModules,
      },
    },
  ],
};
