import { TestBed } from '@angular/core/testing';
import { FaucetUseCaseService } from './faucet.usecase.service';
import { combineLatest, of } from 'rxjs';
import { ConfigService } from '../../models/config.service';
import { ActivatedRoute } from '@angular/router';

describe('FaucetService', () => {
  let service: FaucetUseCaseService;

  beforeEach(async () => {
    const mockActivatedRoute = {
      queryParams: of(undefined),
    };
    const mockConfigService = {
      config$: of(undefined),
    };
    TestBed.configureTestingModule({
      providers: [
        FaucetUseCaseService,
        { provide: ConfigService, useValue: mockConfigService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    });
    service = TestBed.inject(FaucetUseCaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('all getters return undefined', (done) => {
    combineLatest([
      service.config$,
      service.denoms$,
      service.address$,
      service.amount$,
      service.denom$,
    ]).subscribe((values) => {
      expect(values.every((v) => v === undefined)).toBeTruthy();
      done();
    });
  });

  it('all getters return 0', (done) => {
    combineLatest([
      service.creditAmount$,
      service.maxCredit$,
    ]).subscribe((values) => {
      expect(values.every((v) => v === 0)).toBeTruthy();
      done();
    });
  });

});
