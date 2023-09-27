import * as txParser from './../../../../../../../explorer/src/app/utils/tx-parser';
import { CosmosRestService } from './../../../../models/cosmos-rest.service';
import { ProposalUseCaseService } from './proposal.usecase.service';
import { TestBed } from '@angular/core/testing';
import { GovV1Proposal200ResponseProposalsInner } from '@cosmos-client/core/esm/openapi';
import { of } from 'rxjs';

jest.spyOn(txParser, 'txParseProposalContent');

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

  //const mockContent: AccountsAreTheExistingAccountsInner
  const mockContent: any = {
    '@type': 'test_type',
    type_url: 'test_url',
    value: 'test_value',
  };
  const mockProposal: GovV1Proposal200ResponseProposalsInner = {
    proposal_id: 'string',
    content: mockContent,
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
    mockProposal,
  };
};

describe('ProposalUseCaseService when CosmosRestService returns a valid value', () => {
  it('should be created', () => {
    const { service } = setup();
    expect(service).toBeTruthy();
  });
  describe('Three getters', () => {
    test('depositParams$ getter calls the getDepositParams$ from CosmosRestService', (done) => {
      const { service, mockCosmosRestService } = setup();
      service.depositsParams$.subscribe(() => {
        expect(mockCosmosRestService.getDepositParams$).toBeCalled();
        done();
      });
    });
    test('tallyParams$ getter calls the getTallyParams$ from CosmosRestService', (done) => {
      const { service, mockCosmosRestService } = setup();
      service.tallyParams$.subscribe(() => {
        expect(mockCosmosRestService.getTallyParams$).toBeCalled();
        done();
      });
    });
    test('votingParams$ getter calls the getVotingParams$ from CosmosRestService', (done) => {
      const { service, mockCosmosRestService } = setup();
      service.votingParams$.subscribe(() => {
        expect(mockCosmosRestService.getVotingParams$).toBeCalled();
        done();
      });
    });
  });
  describe('Two methods with proposal$ as arguments', () => {
    test('proposalType$ method returns @type value', (done) => {
      const { service, mockProposal } = setup();
      service.proposalType$(of(mockProposal)).subscribe((value) => {
        expect(value).toBe((mockProposal?.content as any)['@type']);
        done();
      });
    });
    test('proposalContent$ method calls txParseProposalContent with proposal.content as argument', (done) => {
      const { service, mockProposal } = setup();
      service.proposalContent$(of(mockProposal)).subscribe(() => {
        expect(txParser.txParseProposalContent).toBeCalledWith(mockProposal.content);
        done();
      });
    });
  });
  describe('Four methods with proposalID$ as argument', () => {
    test('proposal$ calls the getProposal$ with same number as argument, from CosmosRestService', (done) => {
      const { service, mockCosmosRestService } = setup();
      service.proposal$(of('1')).subscribe(() => {
        expect(mockCosmosRestService.getProposal$).toHaveBeenCalledWith('1');
        done();
      });
    });
    test('deposit$ calls the getDeposits$ with same number as argument, from CosmosRestService', (done) => {
      const { service, mockCosmosRestService } = setup();
      service.deposits$(of('2')).subscribe(() => {
        expect(mockCosmosRestService.getDeposits$).toHaveBeenCalledWith('2');
        done();
      });
    });
    test('tally$ calls the getTallyResult$ with same number as argument, from CosmosRestService', (done) => {
      const { service, mockCosmosRestService } = setup();
      service.tally$(of('3')).subscribe(() => {
        expect(mockCosmosRestService.getTallyResult$).toHaveBeenCalledWith('3');
        done();
      });
    });
    test('vote$ calls the getVotes$ with same number as argument, from CosmosRestService', (done) => {
      const { service, mockCosmosRestService } = setup();
      service.votes$(of('4')).subscribe(() => {
        expect(mockCosmosRestService.getVotes$).toHaveBeenCalledWith('4');
        done();
      });
    });
  });
});

const setupUndefinedEnv = () => {
  const mockCosmosRestService = {
    getProposals$: jest.fn(() => of(undefined)),
  };
  const { service, mockProposal } = setup({
    mockCosmosRestService,
  });
  return {
    service,
    mockCosmosRestService,
    mockProposal,
  };
};

describe('ProposalUseCaseService when no CosmosRestService', () => {
  it('should be created', () => {
    const { service } = setupUndefinedEnv();
    expect(service).toBeTruthy();
  });
  test('depositParams$ returns undefined', (done) => {
    const { service } = setupUndefinedEnv();
    service.depositsParams$.subscribe((v) => {
      expect(v).toEqual(undefined);
      done();
    });
  });
  test('tallyParams$ returns undefined', (done) => {
    const { service } = setupUndefinedEnv();
    service.tallyParams$.subscribe((v) => {
      expect(v).toEqual(undefined);
      done();
    });
  });
  test('votingParams$ returns undefined', (done) => {
    const { service } = setupUndefinedEnv();
    service.votingParams$.subscribe((v) => {
      expect(v).toEqual(undefined);
      done();
    });
  });
  test('proposalType$  returns undefined', (done) => {
    const { service } = setupUndefinedEnv();
    service.proposalType$(of(undefined)).subscribe((v) => {
      expect(v).toEqual(undefined);
      done();
    });
  });
  test('proposalContent$ returns undefined', (done) => {
    const { service, mockProposal } = setupUndefinedEnv();
    service.proposalContent$(of(mockProposal)).subscribe((v) => {
      expect(v).toEqual(undefined);
      done();
    });
  });

  test('proposal$ returns undefined', (done) => {
    const { service } = setupUndefinedEnv();
    service.proposal$(of('1')).subscribe((v) => {
      expect(v).toEqual(undefined);
      done();
    });
  });
  test('deposit$ returns undefined', (done) => {
    const { service } = setupUndefinedEnv();
    service.deposits$(of('2')).subscribe((v) => {
      expect(v).toEqual(undefined);
      done();
    });
  });
  test('tally$ returns undefined', (done) => {
    const { service } = setupUndefinedEnv();
    service.tally$(of('3')).subscribe((v) => {
      expect(v).toEqual(undefined);
      done();
    });
  });
  test('vote$ returns undefined', (done) => {
    const { service } = setupUndefinedEnv();
    service.votes$(of('4')).subscribe((v) => {
      expect(v).toEqual(undefined);
      done();
    });
  });
});
