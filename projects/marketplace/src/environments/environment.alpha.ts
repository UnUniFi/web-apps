const domainCauchyEA = 'ununifi-alpha-test-v3.cauchye.net';

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
