const restPort = location.protocol === 'https:' ? 1318 : 1317;
const websocketPort = location.protocol === 'https:' ? 26658 : 26657;
const faucetUbtcPort = location.protocol === 'https:' ? 8001 : 8000;
const faucetUguuPort = location.protocol === 'https:' ? 8003 : 8002;
const faucetJpuPort = location.protocol === 'https:' ? 8005 : 8004;
const faucetUethPort = location.protocol === 'https:' ? 8007 : 8006;
const faucetEuuPort = location.protocol === 'https:' ? 8009 : 8008;

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
  configs: [
    // CauchyE A node without Monitor
    {
      id: domainCauchyEA,
      restURL: `${location.protocol}//${domainCauchyEA}:${restPort}`,
      websocketURL: `${location.protocol.replace(
        'http',
        'ws',
      )}//${domainCauchyEA}:${websocketPort}`,
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
        ],
        monitor: undefined,
        navigations: [],
        messageModules,
      },
    },
  ],
};
