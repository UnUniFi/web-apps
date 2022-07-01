import { ConfigService } from '../../models/config.service';
import { CosmosSDKService } from '../../models/cosmos-sdk.service';
import { WalletService } from '../../models/wallets/wallet.service';
import { BalanceUsecaseService } from './balance.usecase.service';
import { TestBed } from '@angular/core/testing';
import { combineLatest, of } from 'rxjs';

jest.mock('./../../utils/converter', () => {
  return {
    convertUnknownAccountToTypedAccount: jest.fn(() => undefined),
    convertTypedAccountToTypedName: jest.fn(() => undefined),
  };
});

jest.mock('@cosmos-client/core', () => {
  const mockClass: jest.MockedClass<any> = jest.fn((...args) => {
    const instance = Object.create(mockClass.prototype);
    return Object.assign(instance, { args });
  });
  return {
    rest: {
      tendermint: {
        getNodeInfo: jest.fn(() => Promise.resolve({ data: undefined })),
      },
    },
  };
});

describe('BalanceUsecaseService', () => {
  let service: BalanceUsecaseService;

  beforeEach(async () => {
    const mockWalletService = {
      currentStoredWallet$: of(undefined),
    };
    const mockCosmosSDKService = {
      sdk$: of({ rest: undefined, websocket: undefined }),
    };
    const mockConfigService = {
      config$: of(undefined),
    };
    TestBed.configureTestingModule({
      providers: [
        BalanceUsecaseService,
        { provide: ConfigService, useValue: mockConfigService },
        { provide: CosmosSDKService, useValue: mockCosmosSDKService },
        { provide: WalletService, useValue: mockWalletService },
      ],
    });
    service = TestBed.inject(BalanceUsecaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('すべてundefinedが返ってくる', (done) => {
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
