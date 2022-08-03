import { TestBed } from '@angular/core/testing';
import { FaucetUseCaseService } from './faucet.usecase.service';
import { combineLatest, of } from 'rxjs';
import { ConfigService } from '../../models/config.service';

describe('FaucetService', () => {
  let service: FaucetUseCaseService;

  beforeEach(async () => {
    const mockConfigService = {
      config$: of(undefined),
    };
    TestBed.configureTestingModule({
      providers: [
        FaucetUseCaseService,
        { provide: ConfigService, useValue: mockConfigService },
      ],
    });
    service = TestBed.inject(FaucetUseCaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('all getters return undefined', (done) => {
    combineLatest([
      service.faucetURL$(of(undefined)),
      service.denoms$,
    ]).subscribe((values) => {
      expect(values.every((v) => v === undefined)).toBeTruthy();
      done();
    });
  });

  it('all methods return 0', (done) => {
    combineLatest([
      service.creditAmount$(of(undefined)),
      service.maxCredit$(of(undefined)),
    ]).subscribe((values) => {
      expect(values.every((v) => v === 0)).toBeTruthy();
      done();
    });
  });

});
