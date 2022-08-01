import { TestBed } from '@angular/core/testing';
import { FaucetUseCaseService } from './faucet.usecase.service';

describe('FaucetService', () => {
  let service: FaucetUseCaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FaucetUseCaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
