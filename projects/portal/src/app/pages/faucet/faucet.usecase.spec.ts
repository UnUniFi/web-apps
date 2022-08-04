import { ConfigService } from '../../models/config.service';
import { FaucetUseCaseService } from './faucet.usecase.service';
import { TestBed } from '@angular/core/testing';
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

  // Setup TestBed
  TestBed.configureTestingModule({
    providers: [
      FaucetUseCaseService,
      { provide: ConfigService, useValue: { ...mockConfigService, ...props?.mockConfigService } },
    ],
  });
  const service = TestBed.inject(FaucetUseCaseService);

  return {
    service,
    //mockConfigService,
    mockConfig,
  };
};

describe('FaucetUseCaseService when ConfigService returns a valid value', () => {
  it('should be created', () => {
    const { service } = setup();
    expect(service).toBeTruthy();
  });

  test('denoms$ getter return a valid value', (done) => {
    const { service } = setup();
    service.denoms$.subscribe((values) => {
      expect(values?.every((v) => v.includes('test_denom'))).toBeTruthy();
      done();
    });
  });

  it('faucetURL$ method return a valid value', (done) => {
    const { service, mockConfig } = setup();
    service.faucetURL$(of(mockConfig.extension.faucet[0].denom)).subscribe((value) => {
      expect(value).toBe(mockConfig.extension.faucet[0].faucetURL);
      done();
    });
  });

  it('creditAmount$ method return a valid value', (done) => {
    const { service, mockConfig } = setup();
    service.creditAmount$(of(mockConfig.extension.faucet[0].denom)).subscribe((value) => {
      console.log('creditAmount$', value);
      expect(value).toBe(mockConfig.extension.faucet[0].creditAmount);
      done();
    });
  });

  it('maxCredit$ method return a valid value', (done) => {
    const { service, mockConfig } = setup();
    service.maxCredit$(of(mockConfig.extension.faucet[0].denom)).subscribe((value) => {
      console.log('maxCredit$', value);
      expect(value).toBe(mockConfig.extension.faucet[0].maxCredit);
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

describe('FaucetUseCaseService when configService return undefined', () => {
  it('should be created', () => {
    const { service } = setupUndefinedEnv();
    expect(service).toBeTruthy();
  });

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
});
