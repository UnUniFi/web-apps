const domainCauchyEA = 'ununifi-beta-test-v2.cauchye.net';
// const domainCauchyEB = 'b.private-test.ununifi.cauchye.net';
// const domainCauchyEC = 'c.private-test.ununifi.cauchye.net';
// const domainCauchyED = 'd.private-test.ununifi.cauchye.net';

const chainID = 'ununifi-beta-test-v2';
const chainName = 'UnUniFi (beta-test)';

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
          // Todo: After setup faucet, enable the following faucet.
          // {
          //   hasFaucet: false,
          //   faucetURL: `${location.protocol}//${domainCauchyEA}:${faucetUbtcPort}`,
          //   denom: 'ubtc',
          //   creditAmount: 100, // amount to credit in max request
          //   maxCredit: 99, // account has already maxCredit balance cannot claim anymore
          // },
          // {
          //   hasFaucet: false,
          //   faucetURL: `${location.protocol}//${domainCauchyEA}:${faucetUguuPort}`,
          //   denom: 'uguu',
          //   creditAmount: 2000000,
          //   maxCredit: 1999999,
          // },
          // {
          //   hasFaucet: false,
          //   faucetURL: `${location.protocol}//${domainCauchyEA}:${faucetJpuPort}`,
          //   denom: 'jpu',
          //   creditAmount: 10,
          //   maxCredit: 9,
          // },
          // {
          //   hasFaucet: false,
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
    // // CauchyE B node without Monitor
    // {
    //   id: domainCauchyEB,
    //   restURL: `${location.protocol}//${domainCauchyEB}:${restPort}`,
    //   websocketURL: `${location.protocol.replace(
    //     'http',
    //     'ws',
    //   )}//${domainCauchyEB}:${websocketPort}`,
    //   chainID,
    //   bech32Prefix,
    //   minimumGasPrices: [
    //     {
    //       denom: 'uguu',
    //       amount: 0.015,
    //     },
    //   ],
    //   extension: {
    //     faucet: [
    //       {
    //         hasFaucet: false,
    //         faucetURL: `${location.protocol}//${domainCauchyEB}:${faucetUbtcPort}`,
    //         denom: 'ubtc',
    //         creditAmount: 100, // amount to credit in max request
    //         maxCredit: 99, // account has already maxCredit balance cannot claim anymore
    //       },
    //       {
    //         hasFaucet: false,
    //         faucetURL: `${location.protocol}//${domainCauchyEB}:${faucetUguuPort}`,
    //         denom: 'uguu',
    //         creditAmount: 2000000,
    //         maxCredit: 1999999,
    //       },
    //       {
    //         hasFaucet: false,
    //         faucetURL: `${location.protocol}//${domainCauchyEB}:${faucetJpuPort}`,
    //         denom: 'jpu',
    //         creditAmount: 10,
    //         maxCredit: 9,
    //       },
    //       {
    //         hasFaucet: false,
    //         faucetURL: `${location.protocol}//${domainCauchyEB}:${faucetUethPort}`,
    //         denom: 'ueth',
    //         creditAmount: 1000,
    //         maxCredit: 999,
    //       },
    //       {
    //         hasFaucet: false,
    //         faucetURL: `${location.protocol}//${domainCauchyEB}:${faucetEuuPort}`,
    //         denom: 'euu',
    //         creditAmount: 10,
    //         maxCredit: 9,
    //       },
    //     ],
    //     monitor: undefined,
    //     navigations: [],
    //     messageModules,
    //   },
    // },
    // // CauchyE C node without Monitor
    // {
    //   id: domainCauchyEC,
    //   restURL: `${location.protocol}//${domainCauchyEC}:${restPort}`,
    //   websocketURL: `${location.protocol.replace(
    //     'http',
    //     'ws',
    //   )}//${domainCauchyEC}:${websocketPort}`,
    //   chainID: 'ununifi-8-private-test',
    //   bech32Prefix,
    //   minimumGasPrices: [
    //     {
    //       denom: 'uguu',
    //       amount: 0.015,
    //     },
    //   ],
    //   extension: {
    //     faucet: [
    //       {
    //         hasFaucet: false,
    //         faucetURL: `${location.protocol}//${domainCauchyEC}:${faucetUbtcPort}`,
    //         denom: 'ubtc',
    //         creditAmount: 100, // amount to credit in max request
    //         maxCredit: 99, // account has already maxCredit balance cannot claim anymore
    //       },
    //       {
    //         hasFaucet: false,
    //         faucetURL: `${location.protocol}//${domainCauchyEC}:${faucetUguuPort}`,
    //         denom: 'uguu',
    //         creditAmount: 2000000,
    //         maxCredit: 1999999,
    //       },
    //       {
    //         hasFaucet: false,
    //         faucetURL: `${location.protocol}//${domainCauchyEC}:${faucetJpuPort}`,
    //         denom: 'jpu',
    //         creditAmount: 10,
    //         maxCredit: 9,
    //       },
    //       {
    //         hasFaucet: false,
    //         faucetURL: `${location.protocol}//${domainCauchyEC}:${faucetUethPort}`,
    //         denom: 'ueth',
    //         creditAmount: 1000,
    //         maxCredit: 999,
    //       },
    //       {
    //         hasFaucet: false,
    //         faucetURL: `${location.protocol}//${domainCauchyEC}:${faucetEuuPort}`,
    //         denom: 'euu',
    //         creditAmount: 10,
    //         maxCredit: 9,
    //       },
    //     ],
    //     monitor: undefined,
    //     navigations: [],
    //     messageModules,
    //   },
    // },
    // // CauchyE D node without Monitor
    // {
    //   id: domainCauchyED,
    //   restURL: `${location.protocol}//${domainCauchyED}:${restPort}`,
    //   websocketURL: `${location.protocol.replace(
    //     'http',
    //     'ws',
    //   )}//${domainCauchyED}:${websocketPort}`,
    //   chainID,
    //   bech32Prefix,
    //   minimumGasPrices: [
    //     {
    //       denom: 'uguu',
    //       amount: 0.015,
    //     },
    //   ],
    //   extension: {
    //     faucet: [
    //       {
    //         hasFaucet: false,
    //         faucetURL: `${location.protocol}//${domainCauchyED}:${faucetUbtcPort}`,
    //         denom: 'ubtc',
    //         creditAmount: 100, // amount to credit in max request
    //         maxCredit: 99, // account has already maxCredit balance cannot claim anymore
    //       },
    //       {
    //         hasFaucet: false,
    //         faucetURL: `${location.protocol}//${domainCauchyED}:${faucetUguuPort}`,
    //         denom: 'uguu',
    //         creditAmount: 2000000,
    //         maxCredit: 1999999,
    //       },
    //       {
    //         hasFaucet: false,
    //         faucetURL: `${location.protocol}//${domainCauchyED}:${faucetJpuPort}`,
    //         denom: 'jpu',
    //         creditAmount: 10,
    //         maxCredit: 9,
    //       },
    //       {
    //         hasFaucet: false,
    //         faucetURL: `${location.protocol}//${domainCauchyED}:${faucetUethPort}`,
    //         denom: 'ueth',
    //         creditAmount: 1000,
    //         maxCredit: 999,
    //       },
    //       {
    //         hasFaucet: false,
    //         faucetURL: `${location.protocol}//${domainCauchyED}:${faucetEuuPort}`,
    //         denom: 'euu',
    //         creditAmount: 10,
    //         maxCredit: 9,
    //       },
    //     ],
    //     monitor: undefined,
    //     navigations: [],
    //     messageModules,
    //   },
    // },
  ],
};
