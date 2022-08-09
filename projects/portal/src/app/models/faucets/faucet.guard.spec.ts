import { ConfigService } from './../config.service';
import { FaucetGuard } from './faucet.guard';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { combineLatest, of } from 'rxjs';

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

  // Mock Service
  const mockConfigService = {
    config$: of(mockConfig),
  };

  let routerMock: any = {
    //navigate: jasmine.createSpy('navigate')
    navigate: jest.fn(() => of(undefined)),
    queryParams: {
      address: 'ununifi13uaskveualnc8kkfwrk6g7dmkcggxn3ts04s24',
      amount: '100',
      denom: 'ubtc',
    },
  };

  let routerStateMock: any = {
    snapshot: {},
    url: '/forbidden',
  };

  // Setup TestBed
  TestBed.configureTestingModule({
    providers: [
      FaucetGuard,
      { provide: ConfigService, useValue: { ...mockConfigService, ...props?.mockConfigService } },
      //{ provide: UserProvider, useValue: userProvider},
      { provide: Router, useValue: routerMock },
      //AuthenticationErrorHandler,
      //AuthenticationErrorCommunicator,
    ],
  });
  const service = TestBed.inject(FaucetGuard);

  return {
    service,
    //mockConfigService,
    mockConfig,
    routerMock,
    routerStateMock,
  };
};

describe('FaucetUseCaseService when ConfigService returns a valid value', () => {
  it('should be created', () => {
    const { service } = setup();
    expect(service).toBeTruthy();
  });

  test('denoms Xgetter return a valid value', (done) => {
    const { service } = setup();
    /*
    service.denom.subscribe((values) => {
      expect(values).toStrictEqual(['test_denom1', 'test_denom2']);
      done();
    });
    */

    console.log('configs', service.configS);
    console.log('configs$', service.configS.config$);
    service.configS.config$.subscribe((x) => console.log(x));

    expect(service.denom).toStrictEqual('test_denom1');
    //service.denom?
  });

  it('canActive method return a valid value', () => {
    const { service, mockConfig, routerMock, routerStateMock } = setup();
    //service.canActivate()
    expect(service.canActivate(routerMock, routerStateMock)).toStrictEqual(true);
    expect(service.denom).toStrictEqual('test_denom1');
  });
});

/*
  it('all getters return undefined', (done) => {
    const { service } = setupUndefinedEnv();
    combineLatest([service.faucetURL$(of(undefined)), service.denoms$]).subscribe((values) => {
      expect(values.every((v) => v === undefined)).toBeTruthy();
      done();
    });
  });

  it('all methods return 0', (done) => {
    const { service } = setupUndefinedEnv();
    combineLatest([
      service.creditAmount$(of(undefined)),
      service.maxCredit$(of(undefined)),
    ]).subscribe((values) => {
      expect(values.every((v) => v === 0)).toBeTruthy();
      done();
    });
  });
  */
