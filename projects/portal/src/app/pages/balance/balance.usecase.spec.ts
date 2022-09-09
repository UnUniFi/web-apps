import { ConfigService } from '../../models/config.service';
import { CosmosRestService } from '../../models/cosmos-rest.service';
import { WalletService } from '../../models/wallets/wallet.service';
import {
  convertTypedAccountToTypedName,
  convertUnknownAccountToTypedAccount,
} from '../../utils/converter';
import { BalanceUsecaseService } from './balance.usecase.service';
import { TestBed } from '@angular/core/testing';
import cosmosclient from '@cosmos-client/core';
import { InlineResponse20012, InlineResponse200Accounts } from '@cosmos-client/core/esm/openapi';
import { combineLatest, of } from 'rxjs';

jest.mock('../../utils/converter', () => {
  return {
    convertUnknownAccountToTypedAccount: jest.fn((args) => args),
    convertTypedAccountToTypedName: jest.fn((args) => args),
  };
});

const setup = (props?: {
  mockConfigService?: any;
  mockWalletService?: any;
  mockCosmosRestService?: any;
}) => {
  // Mock Values
  const mockNodeInfo: InlineResponse20012 = {
    application_version: {
      app_name: 'test',
    },
    default_node_info: {
      version: 'test',
    },
  };
  const mockWallet = {
    id: 'test_id',
    type: 'test_type',
    address: cosmosclient.AccAddress.fromString('cosmos1294lsjw4v75r7x2djhzf5h2d7akvjrc46h2wnk'),
    public_key: 'test_public_key',
  };
  const mockAccount: InlineResponse200Accounts = {
    type_url: 'test_type_url',
    value: 'test_value',
  };
  const mockBalance: cosmosclient.proto.cosmos.base.v1beta1.ICoin[] = [
    { amount: '1000', denom: 'test_denom' },
  ];
  const mockConfig = {
    extension: {
      faucet: [
        {
          denom: 'test_denom',
          network: 'test_network',
          hasFaucet: true,
          maxCredit: 1500,
        },
        {
          denom: 'test2_denom',
          network: 'test_network',
          hasFaucet: true,
          maxCredit: 1000,
        },
      ],
    },
  };

  // Mock Service
  const mockConfigService = {
    config$: of(mockConfig),
  };
  const mockWalletService = {
    currentStoredWallet$: of(mockWallet),
    convertStoredWalletToCosmosWallet: jest.fn((wallet) => wallet),
  };
  const mockCosmosRestService = {
    getAccount$: jest.fn(() => of(mockAccount)),
    getAllBalances$: jest.fn(() => of(mockBalance)),
    getNodeInfo$: jest.fn(() => of(mockNodeInfo)),
  };

  // Setup TestBed
  TestBed.configureTestingModule({
    providers: [
      BalanceUsecaseService,
      { provide: ConfigService, useValue: { ...mockConfigService, ...props?.mockConfigService } },
      { provide: WalletService, useValue: { ...mockWalletService, ...props?.mockWalletService } },
      {
        provide: CosmosRestService,
        useValue: { ...mockCosmosRestService, ...props?.mockCosmosRestService },
      },
    ],
  });
  const service = TestBed.inject(BalanceUsecaseService);

  return {
    service,
    mockCosmosRestService,
    mockWalletService,
    mockConfigService,
    mockNodeInfo,
    mockWallet,
    mockAccount,
    mockBalance,
    mockConfig,
  };
};

describe('BalanceUsecaseService when CosmosRestService returns a valid value', () => {
  it('should be created', () => {
    const { service } = setup();
    expect(service).toBeTruthy();
  });

  test('nodeInfo$ return a valid value', (done) => {
    const { service, mockNodeInfo } = setup();
    service.nodeInfo$.subscribe((value) => {
      expect(value).toStrictEqual(mockNodeInfo);
      done();
    });
  });

  test('walletId$ return a valid value', (done) => {
    const { service, mockWallet } = setup();
    service.walletId$.subscribe((value) => {
      expect(value).toBe(mockWallet.id);
      done();
    });
  });

  test('walletType$ return a valid value', (done) => {
    const { service, mockWallet } = setup();
    service.walletType$.subscribe((value) => {
      expect(value).toStrictEqual(mockWallet.type);
      done();
    });
  });

  test('walletType$ return a valid value', (done) => {
    const { service, mockWallet } = setup();
    service.accAddress$.subscribe((value) => {
      expect(value).toBe(mockWallet.address.toString());
      done();
    });
  });

  test('publicKey$ return a valid value', (done) => {
    const { service, mockWallet } = setup();
    service.publicKey$.subscribe((value) => {
      expect(value).toStrictEqual(mockWallet.public_key);
      done();
    });
  });

  test('valAddress$ return a valid value', (done) => {
    const { service, mockWallet } = setup();
    service.valAddress$.subscribe((value) => {
      expect(value).toBe(mockWallet.address.toValAddress().toString());
      done();
    });
  });

  test('accountTypeName$ call rest.getAccount$ and utils/converter', (done) => {
    const { service, mockCosmosRestService } = setup();
    service.accountTypeName$.subscribe(() => {
      expect(mockCosmosRestService.getAccount$).toBeCalled();
      expect(convertUnknownAccountToTypedAccount).toBeCalled();
      expect(convertTypedAccountToTypedName).toBeCalled();
      done();
    });
  });

  test('balances$ return a valid value', (done) => {
    const { service, mockBalance, mockCosmosRestService } = setup();
    service.balances$.subscribe((value) => {
      expect(value).toStrictEqual(mockBalance);
      expect(mockCosmosRestService.getAllBalances$).toBeCalled();
      done();
    });
  });

  // Return Faucet of the next condition
  // - Faucet that has never been withdrawn.
  // - Not withdrawn up to the maximum amount that can be withdrawn
  test('faucets$ return a valid value', (done) => {
    const { service, mockConfig, mockCosmosRestService } = setup();
    service.faucets$.subscribe((value) => {
      expect(value).toStrictEqual(mockConfig.extension.faucet);
      expect(mockCosmosRestService.getAllBalances$).toBeCalled();
      done();
    });
  });

  // Returns a Faucet that does not match the next condition
  // - Faucet that has been withdrawn
  // - Have drawn out the maximum
  // Return Faucet of the next condition
  // - Not withdrawn to the maximum.
  test('faucets$ return a empty array if isNotFoundFaucetDenomBalance and isLessThanMaxCreditFaucetDenomBalance', (done) => {
    const returnOtherDenomBalance = jest.fn(() =>
      of([
        // - Faucet that has been withdrawn
        // - Have drawn out the maximum
        {
          amount: '1501',
          denom: 'test_denom',
        },
        // - Not withdrawn to the maximum.
        {
          amount: '100',
          denom: 'test2_denom',
        },
      ]),
    );
    const { service } = setup({
      mockCosmosRestService: {
        getAllBalances$: returnOtherDenomBalance,
      },
    });
    service.faucets$.subscribe((value) => {
      expect(value).toStrictEqual([
        {
          denom: 'test2_denom',
          network: 'test_network',
          hasFaucet: true,
          maxCredit: 1000,
        },
      ]);
      expect(returnOtherDenomBalance).toBeCalled();
      done();
    });
  });

  test('faucets$ return a empty array if no faucet is found', (done) => {
    const { service } = setup({
      mockConfigService: { config$: of({ extension: { faucet: [] } }) },
    });

    service.faucets$.subscribe((value) => {
      expect(value).toStrictEqual([]);
      done();
    });
  });

  test('faucets$ return a empty array if balances is null', (done) => {
    const faucet = [{ hasFaucet: true }];
    const { service } = setup({
      mockCosmosRestService: {
        getAllBalances$: jest.fn(() => of(null)),
      },
      mockConfigService: { config$: of({ extension: { faucet } }) },
    });

    service.faucets$.subscribe((value) => {
      expect(value).toStrictEqual([]);
      done();
    });
  });

  test('faucets$ return a faucet array if balances is undefined', (done) => {
    const faucet = [{ hasFaucet: true }];
    const { service } = setup({
      mockCosmosRestService: {
        getAllBalances$: jest.fn(() => of(undefined)),
      },
      mockConfigService: { config$: of({ extension: { faucet } }) },
    });

    service.faucets$.subscribe((value) => {
      expect(value).toStrictEqual(faucet);
      done();
    });
  });

  test('faucets$ return a faucet array if balances is empty', (done) => {
    const faucet = [{ hasFaucet: true }];
    const { service } = setup({
      mockCosmosRestService: {
        getAllBalances$: jest.fn(() => of([])),
      },
      mockConfigService: { config$: of({ extension: { faucet } }) },
    });

    service.faucets$.subscribe((value) => {
      expect(value).toStrictEqual(faucet);
      done();
    });
  });
});

const setupUndefinedEnv = () => {
  const mockConfigService = {
    config$: of(undefined),
  };
  const mockWalletService = {
    currentStoredWallet$: of(undefined),
  };
  const mockCosmosRestService = {
    getAccount$: jest.fn(() => of(undefined)),
    getAllBalances$: jest.fn(() => of(undefined)),
    getNodeInfo$: jest.fn(() => of(undefined)),
  };

  const { service } = setup({
    mockConfigService,
    mockWalletService,
    mockCosmosRestService,
  });
  return {
    service,
  };
};

describe('BalanceUsecaseService when configService return undefined', () => {
  it('should be created', () => {
    const { service } = setupUndefinedEnv();
    expect(service).toBeTruthy();
  });

  it('all getters return undefined', (done) => {
    const { service } = setupUndefinedEnv();
    combineLatest([
      service.walletId$,
      service.walletType$,
      service.accAddress$,
      service.publicKey$,
      service.valAddress$,
      service.nodeInfo$,
      service.accountTypeName$,
      service.balances$,
    ]).subscribe((values) => {
      expect(values.every((v) => v === undefined)).toBeTruthy();
      done();
    });
  });
});
