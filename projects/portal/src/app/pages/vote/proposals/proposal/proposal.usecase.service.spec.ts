import { CosmosRestService } from './../../../../models/cosmos-rest.service';
import { CosmosSDKService } from './../../../../models/cosmos-sdk.service';
import { ProposalUseCaseService } from './proposal.usecase.service';
import { TestBed } from '@angular/core/testing';
import {
  InlineResponse20026DepositParams,
  InlineResponse20026TallyParams,
  InlineResponse20026VotingParams,
  InlineResponse20027FinalTallyResult,
  InlineResponse20027Proposals,
  InlineResponse20029Deposits,
  InlineResponse20032Votes,
  InlineResponse200Accounts,
} from '@cosmos-client/core/esm/openapi';
import { of } from 'rxjs';

const setup = (props?: { mockCosmosRestService?: any }) => {
  // Mock Values
  const mockCosmosRestService = {
    getDepositParams$: jest.fn(() => of(undefined)),
    getTallyParams$: jest.fn(() => of(undefined)),
    getVotingParams$: jest.fn(() => of(undefined)),
    getProposal$: jest.fn(() => of(undefined)),
    getDeposits$: jest.fn(() => of(undefined)),
    getTallyResult$: jest.fn(() => of(undefined)),
    getVotes$: jest.fn(() => of(undefined)),
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
    mockCosmosRestService,
  };
};

describe('ProposalUseCaseService when CosmosRestService returns a valid value', () => {
  it('should be created', () => {
    const { service } = setup();
    expect(service).toBeTruthy();
  });

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

  describe('2 methods input proposal return valid values', () => {
    test.todo('proposalType$ method return a valid value from proposal$'); /*, (done) => {
      const { service } = setup();
      const mockContent: InlineResponse200Accounts = {
        //@type: ""
        type_url: 'test_url',
        value: 'test_value',
      };
      const mockProposal: InlineResponse20027Proposals = {
        proposal_id: 'string',
        content: mockContent,
      };
      service.proposalType$(of(mockProposal)).subscribe((value) => {
        expect(value).toBe('test_values');
        done();
      });
    });
    */

    test.todo('proposalContent$ method return a valid value from proposal$'); /*, (done) => {
      const { service } = setup();
      const mockContent: InlineResponse200Accounts = {
        //@type: ""
        type_url: 'test_url',
        value: 'test_value',
      };
      const mockProposal: InlineResponse20027Proposals = {
        proposal_id: 'string',
        content: mockContent,
      };
      service.proposalContent$(of(mockProposal)).subscribe((value) => {
        expect(value).toBe('test_values2');
        done();
      });
    });*/
  });

  describe('4 methods input proposalID return valid values', () => {
    test('proposal$ returns proposal', (done) => {
      const { service, mockCosmosRestService } = setup();
      service.proposal$(of('1')).subscribe(() => {
        expect(mockCosmosRestService.getProposal$).toHaveBeenCalledWith('1');
        done();
      });
    });

    test('deposit$ returns deposit', (done) => {
      const { service, mockCosmosRestService } = setup();
      service.deposits$(of('2')).subscribe(() => {
        expect(mockCosmosRestService.getDeposits$).toHaveBeenCalledWith('2');
        done();
      });
    });

    test('tally$ returns tally', (done) => {
      const { service, mockCosmosRestService } = setup();
      service.tally$(of('3')).subscribe(() => {
        expect(mockCosmosRestService.getTallyResult$).toHaveBeenCalledWith('3');
        done();
      });
    });

    test('vote$ returns votes', (done) => {
      const { service, mockCosmosRestService } = setup();
      service.votes$(of('4')).subscribe(() => {
        expect(mockCosmosRestService.getVotes$).toHaveBeenCalledWith('4');
        done();
      });
    });
  });
});
