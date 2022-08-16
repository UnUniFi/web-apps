import { ConfigService } from './../config.service';
import { FaucetGuard } from './faucet.guard';
import { TestBed } from '@angular/core/testing';
import { UrlTree } from '@angular/router';
import { of } from 'rxjs';

const setup = (props?: { mockConfigService?: any }) => {
  // Mock Values
  const mockConfig = {
    extension: {
      faucet: [
        {
          denom: 'test_denom1',
          network: 'test_network',
          faucetURL: 'www/test.url',
          hasFaucet: true,
          creditAmount: 1200,
          maxCredit: 1500,
        },
        {
          denom: 'test_denom2',
          network: 'test_network',
          faucetURL: 'www/test.url',
          hasFaucet: true,
          creditAmount: 800,
          maxCredit: 1000,
        },
      ],
    },
  };
  const routerMock: any = {
    queryParams: {
      denom: 'test_denom1',
      amount: '100',
    },
  };
  const routerStateMock: any = {
    snapshot: {},
    url: '/faucet?address= &denom= &amount= ',
  };

  // Mock Service
  const mockConfigService = {
    config$: of(mockConfig),
  };

  // Setup TestBed
  TestBed.configureTestingModule({
    providers: [
      FaucetGuard,
      { provide: ConfigService, useValue: { ...mockConfigService, ...props?.mockConfigService } },
    ],
  });
  const service = TestBed.inject(FaucetGuard);

  return {
    service,
    routerMock,
    routerStateMock,
  };
};

describe('FaucetGuard when ConfigService returns a valid value', () => {
  it('should be created', () => {
    const { service } = setup();
    expect(service).toBeTruthy();
  });

  it('returns TRUE when the config faucets and the queryParams have same denom', (done) => {
    const { service, routerMock, routerStateMock } = setup();
    const res = service.canActivate(routerMock, routerStateMock);
    if (typeof res == 'boolean' || res instanceof UrlTree || res instanceof Promise) return;
    res.subscribe((res) => {
      expect(res).toBe(true);
      done();
    });
  });

  it('returns False when the config faucets and the queryParams dose not have same denom', (done) => {
    const { service, routerStateMock } = setup();
    const routerMock3: any = {
      queryParams: {
        denom: 'test_denom3',
        amount: '100',
      },
    };
    const res = service.canActivate(routerMock3, routerStateMock);
    if (typeof res == 'boolean' || res instanceof UrlTree || res instanceof Promise) return;
    res.subscribe((res) => {
      expect(res).toBe(false);
      done();
    });
  });

  it('returns TRUE when the config is defined, but the queryParam is not defined', (done) => {
    const { service, routerStateMock } = setup();
    const routerMock: any = undefined;
    const res = service.canActivate(routerMock, routerStateMock);
    if (typeof res == 'boolean' || res instanceof UrlTree || res instanceof Promise) return;
    res.subscribe((res) => {
      expect(res).toBe(true);
      done();
    });
  });
});

const setupUndefinedEnv = () => {
  const mockConfigService = {
    config$: of(undefined),
  };
  const { service } = setup({
    mockConfigService,
  });
  return {
    service,
  };
};

describe('FaucetGuard when ConfigService is undefined', () => {
  it('should be created', () => {
    const { service } = setupUndefinedEnv();
    expect(service).toBeTruthy();
  });

  describe('CanActive method returns False regardless of the queryParam', () => {
    it('returns False when the queryParam is defined', (done) => {
      const { service } = setupUndefinedEnv();
      const routerMock: any = {
        queryParams: {
          denom: 'test_denom3',
        },
      };
      const routerStateMock: any = undefined;
      const res = service.canActivate(routerMock, routerStateMock);
      if (typeof res == 'boolean' || res instanceof UrlTree || res instanceof Promise) return;
      res.subscribe((res) => {
        expect(res).toBe(false);
        done();
      });
    });

    it('returns False when the queryParam is undefined', (done) => {
      const { service } = setupUndefinedEnv();
      const routerMock: any = undefined;
      const routerStateMock: any = undefined;
      const res = service.canActivate(routerMock, routerStateMock);
      if (typeof res == 'boolean' || res instanceof UrlTree || res instanceof Promise) return;
      res.subscribe((res) => {
        expect(res).toBe(false);
        done();
      });
    });
  });
});
