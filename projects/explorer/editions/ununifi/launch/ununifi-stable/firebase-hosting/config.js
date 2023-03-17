const restPort = location.protocol === 'https:' ? 1318 : 1317;
const websocketPort = location.protocol === 'https:' ? 26658 : 26657;
const faucetUbtcPort = location.protocol === 'https:' ? 8001 : 8000;
const faucetUguuPort = location.protocol === 'https:' ? 8003 : 8002;
const faucetJpuPort = location.protocol === 'https:' ? 8005 : 8004;
const faucetUethPort = location.protocol === 'https:' ? 8007 : 8006;
const faucetEuuPort = location.protocol === 'https:' ? 8009 : 8008;

const domainCauchyEA = 'ununifi-stable.cauchye.net';
const chainID = 'ununifi-stable';
const chainName = 'UnUniFi (Stable)';

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
          creditAmount: 2000000, // amount to credit in max request
          maxCredit: 2000000, // account has already maxCredit balance cannot claim anymore
        },
        {
          hasFaucet: true,
          faucetURL: `${location.protocol}//${domainCauchyEA}:${faucetUguuPort}`,
          denom: 'uguu',
          creditAmount: 2000000,
          maxCredit: 2000000,
        },
        {
          hasFaucet: true,
          faucetURL: `${location.protocol}//${domainCauchyEA}:${faucetUguuPort}`,
          denom: 'uusdc',
          creditAmount: 2000000,
          maxCredit: 2000000,
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
];
