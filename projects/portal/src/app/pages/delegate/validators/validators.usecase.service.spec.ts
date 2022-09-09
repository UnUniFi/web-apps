import { WalletService } from '../../../models/wallets/wallet.service';
import { CosmosRestService } from './../../../models/cosmos-rest.service';
import { validatorType } from './../../../views/delegate/validators/validators.component';
import { ValidatorsUseCaseService } from './validators.usecase.service';
import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import cosmosclient from '@cosmos-client/core';
import {
  InlineResponse20038DelegationResponses,
  InlineResponse20041Validators,
  InlineResponse20047,
} from '@cosmos-client/core/esm/openapi';
import { combineLatest, of } from 'rxjs';
import { Observable } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';

const setup = (props?: { mockCosmosRestService?: any; mockWalletService?: any }) => {
  // Mock Values
  const mockValidator1: InlineResponse20041Validators = { tokens: '100' };
  const mockValidator2: InlineResponse20041Validators = { tokens: '200' };
  const mockValidator3: InlineResponse20041Validators = { tokens: '300' };
  const mockValidators = [mockValidator1, mockValidator2, mockValidator3];

  // Mock Services
  const mockWalletService = {
    //getCurrentStoredWallet: jest.fn(() => of()),
    currentStoredWallet$: of(undefined),
  };
  const mockCosmosRestService = {
    getValidators$: jest.fn(() => of(mockValidators)),
  };

  /*
  // Mock Values
  const mockCosmosRestService = {
    getDepositParams$: jest.fn(() => of(undefined)),
    getTallyParams$: jest.fn(() => of(undefined)),
    getVotingParams$: jest.fn(() => of(undefined)),
    getProposal$: jest.fn(() => of(undefined)),
    getDeposits$: jest.fn(() => of(undefined)),
    getTallyResult$: jest.fn(() => of(undefined)),
    getVotes$: jest.fn(() => of(undefined)),
  };*/

  // Setup TestBed
  TestBed.configureTestingModule({
    providers: [
      ValidatorsUseCaseService,
      {
        provide: CosmosRestService,
        useValue: { ...mockCosmosRestService, ...props?.mockCosmosRestService },
      },
      {
        provide: WalletService,
        useValue: { ...mockWalletService, ...props?.mockWalletService },
      },
    ],
  });
  const service = TestBed.inject(ValidatorsUseCaseService);

  return {
    service,
    mockCosmosRestService,
  };
};

describe('ValidatorsUseCaseService when CosmosRestService returns a valid value', () => {
  it('should be created', () => {
    const { service } = setup();
    expect(service).toBeTruthy();
  });

  /*
  describe('3 getters return valid values', () => {
    test('depositParams$ getter calls the getDepositParams$ in CosmosRestService', (done) => {
      const { service, mockCosmosRestService } = setup();
      service.depositsParams$.subscribe(() => {
        expect(mockCosmosRestService.getDepositParams$).toBeCalled();
        done();
      });
    });

    test('tallyParams$ getter calls the getTallyParams$ in CosmosRestService', (done) => {
      const { service, mockCosmosRestService } = setup();
      service.tallyParams$.subscribe(() => {
        expect(mockCosmosRestService.getTallyParams$).toBeCalled();
        done();
      });
    });

    test('votingParams$ getter calls the getVotingParams$ in CosmosRestService', (done) => {
      const { service, mockCosmosRestService } = setup();
      service.votingParams$.subscribe(() => {
        expect(mockCosmosRestService.getVotingParams$).toBeCalled();
        done();
      });
    });
  });
  */
});
