import { KeySelectDialogService } from './key-select-dialog.service';
import { KeySelectGuard } from './key-select.guard';
import { KeyType } from './key.model';
import { KeyService } from './key.service';
import { KeyStoreService } from './key.store.service';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

window.alert = jest.fn();

const setup = (props?: {
  mockRouter?: any;
  mockKeyService?: any;
  mockKeyStoreService?: any;
  mockKeySelectDialogService?: any;
}) => {
  const routerMock = {
    navigate: jest.fn<Promise<boolean>, [string]>(() => Promise.resolve(true)),
  };
  const test_key1 = {
    id: 'test1',
    type: KeyType.secp256k1,
    public_key: 'test1_public_key',
  };
  const test_key2 = {
    id: 'test2',
    type: KeyType.secp256k1,
    public_key: 'test2_public_key',
  };

  // Mock Service
  const mockKeyService = {
    list: jest.fn(() => [test_key1, test_key2]),
  };
  const mockKeyStoreService = {
    currentKey$: new BehaviorSubject(test_key1),
  };
  const mockKeySelectDialogService = {
    open: jest.fn((): Promise<any> => Promise.resolve(test_key2)),
  };

  // Setup TestBed
  TestBed.configureTestingModule({
    providers: [
      KeySelectGuard,
      {
        provide: Router,
        useValue: { ...routerMock, ...props?.mockRouter },
      },
      {
        provide: KeyService,
        useValue: { ...mockKeyService, ...props?.mockKeyService },
      },
      {
        provide: KeyStoreService,
        useValue: { ...mockKeyStoreService, ...props?.mockKeyStoreService },
      },
      {
        provide: KeySelectDialogService,
        useValue: { ...mockKeySelectDialogService, ...props?.mockKeySelectDialogService },
      },
    ],
  });
  const service = TestBed.inject(KeySelectGuard);
  return {
    service,
    routerMock,
  };
};

describe('Key-Select-Guard when the dialog can open', () => {
  it('should be created', () => {
    const { service } = setup();
    expect(service).toBeTruthy();
  });

  it('returns TRUE after KeySelectDialog opened', (done) => {
    const { service } = setup();
    const route: any = undefined;
    const state: any = undefined;
    service.canActivate(route, state).then((res) => {
      expect(res).toBe(true);
      done();
    });
  });
});

const setupNoKeysEnv = () => {
  const mockKeyService = {
    list: jest.fn(() => []),
  };
  const { service, routerMock } = setup({
    mockKeyService,
  });
  return {
    service,
    routerMock,
  };
};

describe('Key-Select-Guard when the keys is not saved', () => {
  it('should be created', () => {
    const { service } = setupNoKeysEnv();
    expect(service).toBeTruthy();
  });

  it('returns True and jump to keys/create page, when the keys is not saved', (done) => {
    const { service, routerMock } = setupNoKeysEnv();
    const route: any = undefined;
    const state: any = undefined;
    service.canActivate(route, state).then((res) => {
      expect(routerMock.navigate).toBeCalledWith(['keys', 'create']);
      expect(res).toBe(true);
      done();
    });
  });
});

const setupUndefinedEnv = () => {
  const mockKeyStoreService = {
    currentKey$: new BehaviorSubject(undefined),
  };
  const mockKeySelectDialogService = {
    open: jest.fn((): Promise<any> => Promise.resolve(undefined)),
  };
  const { service } = setup({
    mockKeySelectDialogService,
    mockKeyStoreService,
  });
  return {
    service,
    mockKeySelectDialogService,
  };
};

describe('Key-Select-Guard when dialog is undefined', () => {
  it('should be created', () => {
    const { service } = setupUndefinedEnv();
    expect(service).toBeTruthy();
  });

  it('returns False when KeySelectDialog could not open, after try one more time', (done) => {
    const { service, mockKeySelectDialogService } = setupUndefinedEnv();
    const route: any = undefined;
    const state: any = undefined;
    service.canActivate(route, state).then((res) => {
      expect(res).toBe(false);
      expect(mockKeySelectDialogService.open).toBeCalledTimes(2);
      done();
    });
  });
});
