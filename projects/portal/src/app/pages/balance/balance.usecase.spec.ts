import { ConfigService } from '../../models/config.service';
import { CosmosRestService } from '../../models/cosmos-rest.service';
import { WalletService } from '../../models/wallets/wallet.service';
import { BalanceUsecaseService } from './balance.usecase.service';
import { TestBed } from '@angular/core/testing';
import { combineLatest, of } from 'rxjs';

describe('BalanceUsecaseService', () => {
  let service: BalanceUsecaseService;

  beforeEach(async () => {
    const mockWalletService = {
      currentStoredWallet$: of(undefined),
    };
    const mockConfigService = {
      config$: of(undefined),
    };
    const mockCosmosRestService = {
      getAccount$: jest.fn(() => of(undefined)),
      allBalance$: jest.fn(() => of(undefined)),
      getNodeInfo$: jest.fn(() => of(undefined)),
    };
    TestBed.configureTestingModule({
      providers: [
        BalanceUsecaseService,
        { provide: ConfigService, useValue: mockConfigService },
        { provide: WalletService, useValue: mockWalletService },
        { provide: CosmosRestService, useValue: mockCosmosRestService },
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
