import { KeyType } from '../keys/key.model';
import { WalletApplicationService } from './wallet.application.service';
import { WalletGuard } from './wallet.guard';
import { StoredWallet } from './wallet.model';
import { WalletType } from './wallet.model';
import { WalletService } from './wallet.service';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

const setup = (props?: {
  mockRouter?: any;
  mockWalletService?: any;
  mockWalletAppService?: any;
}) => {
  const routerMock: any = {};
  const mockStoredWallet1: StoredWallet = {
    id: 'test1',
    type: WalletType.ununifi,
    key_type: KeyType.secp256k1,
    public_key: 'test1_public_key',
    address: 'test1_address',
  };
  const mockWalletService = {
    getCurrentStoredWallet: jest.fn(() => Promise.resolve(mockStoredWallet1)),
  };
  const mockWalletAppService = {
    connectWalletDialog: jest.fn(() => Promise.resolve()),
  };

  // Setup TestBed
  TestBed.configureTestingModule({
    providers: [
      WalletGuard,
      {
        provide: Router,
        useValue: { ...routerMock, ...props?.mockRouter },
      },
      {
        provide: WalletService,
        useValue: { ...mockWalletService, ...props?.mockWalletService },
      },
      {
        provide: WalletApplicationService,
        useValue: { ...mockWalletAppService, ...props?.mockWalletAppService },
      },
    ],
  });
  const service = TestBed.inject(WalletGuard);

  return {
    service,
    mockWalletService,
    mockWalletAppService,
  };
};

describe('WalletGuard when a wallet stored', () => {
  it('should be created', () => {
    const { service } = setup();
    expect(service).toBeTruthy();
  });

  it('returns TRUE and the getCurrentStoredWallet function is called', (done) => {
    const { service, mockWalletService } = setup();
    const route: any = undefined;
    const state: any = undefined;
    service.canActivate(route, state).then((res) => {
      expect(mockWalletService.getCurrentStoredWallet).toHaveBeenCalled;
      expect(res).toBeTruthy();
      done();
    });
  });
});

const setupUndefinedEnv = () => {
  const mockWalletService = {
    getCurrentStoredWallet: jest.fn(() => Promise.resolve(undefined)),
  };
  const { service, mockWalletAppService } = setup({
    mockWalletService,
  });
  return {
    service,
    mockWalletService,
    mockWalletAppService,
  };
};

describe('WalletGuard when wallet is not stored', () => {
  it('should be created', () => {
    const { service } = setupUndefinedEnv();
    expect(service).toBeTruthy();
  });

  it('returns TRUE and The connect dialog is called 2 times', (done) => {
    const { service, mockWalletAppService } = setupUndefinedEnv();
    const route: any = undefined;
    const state: any = undefined;
    service.canActivate(route, state).then((res) => {
      expect(mockWalletAppService.connectWalletDialog).toHaveBeenCalledTimes(2);
      expect(res).toBeTruthy;
      done();
    });
  });
});
