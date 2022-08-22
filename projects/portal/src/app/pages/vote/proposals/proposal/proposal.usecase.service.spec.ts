import { ConfigService } from './../../../../models/config.service';
import { CosmosRestService } from './../../../../models/cosmos-rest.service';
import { CosmosSDKService } from './../../../../models/cosmos-sdk.service';
import { ProposalUseCaseService } from './proposal.usecase.service';
import { TestBed } from '@angular/core/testing';
import { Observable } from '@apollo/client';
import { combineLatest, of } from 'rxjs';

const setup = (props?: { mockCosmosRestService?: any }) => {
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
  const mockConfigService: any = { config$: of(mockConfig) };

  const mockCosmosSDKService = new CosmosSDKService(mockConfigService);

  //const mockCosmosRestService = new CosmosRestService(mockCosmosSDKService);

  const mockCosmosRestService = {
    getDepositParams$: jest.fn(),
    getTallyParams$: jest.fn(),
    getVotingParams$: jest.fn(),
    getDeposits$: jest.fn(() => of(undefined)),
  };

  // Setup TestBed
  TestBed.configureTestingModule({
    providers: [
      ProposalUseCaseService,
      {
        provide: CosmosRestService,
        useValue: { ...mockCosmosRestService, ...props?.mockCosmosRestService },
      },
    ],
  });
  const service = TestBed.inject(ProposalUseCaseService);

  return {
    service,
    mockConfig,
    mockCosmosRestService,
  };
};

describe('ProposalUseCaseService when CosmosRestService returns a valid value', () => {
  it('should be created', () => {
    const { service } = setup();
    expect(service).toBeTruthy();
  });

  /*
  this.depositParams$ = this.usecase.depositsParams$;
  this.tallyParams$ = this.usecase.tallyParams$;
  this.votingParams$ = this.usecase.votingParams$;
  */
  describe('3 getters return valid values', () => {
    test('depositsParams$ getter returns a valid value', (done) => {
      const { service, mockCosmosRestService } = setup();
      console.log(service);
      service.depositsParams$.subscribe((values) => {
        //expect(values).toStrictEqual(['test_denom1', 'test_denom2']);
        expect(mockCosmosRestService.getDepositParams$).toBeCalled();
        done();
      });
    });

    test('tallyParams$ getter returns a valid value', (done) => {
      const { service } = setup();
      service.tallyParams$.subscribe((values) => {
        expect(values).toStrictEqual(['test_denom1', 'test_denom2']);
        done();
      });
    });

    test('votingParams$ getter returns a valid value', (done) => {
      const { service } = setup();
      service.votingParams$.subscribe((values) => {
        expect(values).toStrictEqual(['test_denom1', 'test_denom2']);
        done();
      });
    });
  });

  /*
  this.proposalType$ = this.usecase.proposalType$(this.proposal$);
  this.proposalContent$ = this.usecase.proposalContent$(this.proposal$);
  */
  describe('2 methods input proposal return valid values', () => {
    it('creditAmount$ method return a valid value', (done) => {
      const { service, mockConfig } = setup();
      service.deposits$(of(mockConfig.extension.faucet[0].denom)).subscribe((value) => {
        expect(value).toBe(mockConfig.extension.faucet[0].creditAmount);
        done();
      });
    });
  });

  /*
  this.proposal$ = this.usecase.proposal$(proposalID$);
  this.deposits$ = this.usecase.deposits$(proposalID$);
  this.tally$ = this.usecase.tally$(proposalID$);
  this.votes$ = this.usecase.votes$(proposalID$);
  */
  describe('4 methods input proposalID return valid values', () => {
    test.todo('proposal$ returns proposal');
    test.todo('deposit$ returns deposit');
    test.todo('tally$ returns tally');
    test.todo('vote$ returns votes');
  });
});
