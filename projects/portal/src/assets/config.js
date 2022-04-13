const restPort = location.protocol === "https:" ? 1318 : 1317;
const websocketPort = location.protocol === "https:" ? 26658 : 26657;
const faucetUbtcPort = location.protocol === "https:" ? 8001 : 8000;
const faucetUguuPort = location.protocol === "https:" ? 8003 : 8002;
const faucetJpuPort = location.protocol === "https:" ? 8005 : 8004;
const faucetUethPort = location.protocol === "https:" ? 8007 : 8006;
const faucetEuuPort = location.protocol === "https:" ? 8009 : 8008;

const configs = [
  // A node without Monitor
  {
    id: 'a.private-test.ununifi.cauchye.net',
    restURL: `${location.protocol}//a.private-test.ununifi.cauchye.net:${restPort}`,
    websocketURL: `${location.protocol.replace(
      'http',
      'ws',
    )}//a.private-test.ununifi.cauchye.net:${websocketPort}`,
    chainID: 'ununifi-8-private-test',
    bech32Prefix: {
      accAddr: 'ununifi',
      accPub: 'ununifipub',
      valAddr: 'ununifivaloper',
      valPub: 'ununifivaloperpub',
      consAddr: 'ununifivalcons',
      consPub: 'ununifivalconspub',
    },
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
          faucetURL: `${location.protocol}//a.private-test.ununifi.cauchye.net:${faucetUbtcPort}`,
          denom: 'ubtc',
          creditAmount: 100, // amount to credit in max request
          maxCredit: 99, // account has already maxCredit balance cannot claim anymore
        },
        {
          hasFaucet: true,
          faucetURL: `${location.protocol}//a.private-test.ununifi.cauchye.net:${faucetUguuPort}`,
          denom: 'uguu',
          creditAmount: 2000000,
          maxCredit: 1999999,
        },
        {
          hasFaucet: false,
          faucetURL: `${location.protocol}//a.private-test.ununifi.cauchye.net:${faucetJpuPort}`,
          denom: 'jpu',
          creditAmount: 10,
          maxCredit: 9,
        },
        {
          hasFaucet: true,
          faucetURL: `${location.protocol}//a.private-test.ununifi.cauchye.net:${faucetUethPort}`,
          denom: 'ueth',
          creditAmount: 1000,
          maxCredit: 999,
        },
        {
          hasFaucet: false,
          faucetURL: `${location.protocol}//a.private-test.ununifi.cauchye.net:${faucetEuuPort}`,
          denom: 'euu',
          creditAmount: 10,
          maxCredit: 9,
        },
      ],
      monitor: {},
      navigations: [],
      messageModules: [
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
      ],
    },
  },
  // B node without Monitor
  {
    id: 'b.private-test.ununifi.cauchye.net',
    restURL: `${location.protocol}//b.private-test.ununifi.cauchye.net:${restPort}`,
    websocketURL: `${location.protocol.replace(
      'http',
      'ws',
    )}//b.private-test.ununifi.cauchye.net:${websocketPort}`,
    chainID: 'ununifi-8-private-test',
    bech32Prefix: {
      accAddr: 'ununifi',
      accPub: 'ununifipub',
      valAddr: 'ununifivaloper',
      valPub: 'ununifivaloperpub',
      consAddr: 'ununifivalcons',
      consPub: 'ununifivalconspub',
    },
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
          faucetURL: `${location.protocol}//b.private-test.ununifi.cauchye.net:${faucetUbtcPort}`,
          denom: 'ubtc',
          creditAmount: 100, // amount to credit in max request
          maxCredit: 99, // account has already maxCredit balance cannot claim anymore
        },
        {
          hasFaucet: true,
          faucetURL: `${location.protocol}//b.private-test.ununifi.cauchye.net:${faucetUguuPort}`,
          denom: 'uguu',
          creditAmount: 2000000,
          maxCredit: 1999999,
        },
        {
          hasFaucet: false,
          faucetURL: `${location.protocol}//b.private-test.ununifi.cauchye.net:${faucetJpuPort}`,
          denom: 'jpu',
          creditAmount: 10,
          maxCredit: 9,
        },
        {
          hasFaucet: true,
          faucetURL: `${location.protocol}//b.private-test.ununifi.cauchye.net:${faucetUethPort}`,
          denom: 'ueth',
          creditAmount: 1000,
          maxCredit: 999,
        },
        {
          hasFaucet: false,
          faucetURL: `${location.protocol}//b.private-test.ununifi.cauchye.net:${faucetEuuPort}`,
          denom: 'euu',
          creditAmount: 10,
          maxCredit: 9,
        },
      ],
      monitor: {},
      navigations: [],
      messageModules: [
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
      ],
    },
  },
];
