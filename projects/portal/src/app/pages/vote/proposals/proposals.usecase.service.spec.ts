import * as txParser from './../../../../../../explorer/src/app/utils/tx-parser';
import { CosmosRestService } from './../../../models/cosmos-rest.service';
import { ProposalsUseCaseService } from './proposals.usecase.service';
import { TestBed } from '@angular/core/testing';
import { InlineResponse20027Proposals } from '@cosmos-client/core/esm/openapi';
import { of } from 'rxjs';

jest.spyOn(txParser, 'txParseProposalContent');

const setup = (props?: { mockCosmosRestService?: any }) => {
  // Mock Values
  const mockProposal1: InlineResponse20027Proposals = { proposal_id: '1' };
  const mockProposal2: InlineResponse20027Proposals = { proposal_id: '2' };
  const mockProposal3: InlineResponse20027Proposals = { proposal_id: '3' };
  const mockProposalArray = [mockProposal1, mockProposal2, mockProposal3];

  const mockCosmosRestService = {
    getProposals$: jest.fn(() => of(mockProposalArray)),
    getTallyResult$: jest.fn(() => of(undefined)),
  };

  // Setup TestBed
  TestBed.configureTestingModule({
    providers: [
      ProposalsUseCaseService,
      {
        provide: CosmosRestService,
        useValue: { ...mockCosmosRestService, ...props?.mockCosmosRestService },
      },
    ],
  });
  const service = TestBed.inject(ProposalsUseCaseService);

  return {
    service,
    mockCosmosRestService,
    mockProposalArray,
  };
};

describe('ProposalsUseCaseService', () => {
  it('should be created', () => {
    const { service } = setup();
    expect(service).toBeTruthy();
  });

  test('proposal$ calls getProposals$ from CosmosRestService', (done) => {
    const { service, mockCosmosRestService } = setup();
    service.proposals$.subscribe(() => {
      expect(mockCosmosRestService.getProposals$).toHaveBeenCalled();
      done();
    });
  });

  test('pageLength$ returns number of proposals', (done) => {
    const { service, mockProposalArray } = setup();
    service.pageLength$(service.proposals$).subscribe((value) => {
      expect(value).toBe(mockProposalArray.length);
      done();
    });
  });

  test('paginatedProposals$ returns paginated proposal', (done) => {
    const { service, mockProposalArray } = setup();
    service.paginatedProposals$(service.proposals$, of(1), of(2)).subscribe((value) => {
      expect(value).toStrictEqual(mockProposalArray.slice(1, 3).reverse());
      done();
    });
  });

  test('proposalContents$ calls txParseProposalContent for the number of pagesize', (done) => {
    const { service } = setup();
    service.proposalContents$(service.proposals$, of(1), of(2)).subscribe(() => {
      expect(txParser.txParseProposalContent).toBeCalledTimes(2);
      done();
    });
  });

  test('tallies$ calls getTallyResult$ for number of pagesize from CosmosRestService', (done) => {
    const { service, mockCosmosRestService } = setup();
    service.tallies$(service.proposals$, of(1), of(2)).subscribe(() => {
      expect(mockCosmosRestService.getTallyResult$).toBeCalledTimes(2);
      done();
    });
  });
});

const setupUndefinedEnv = () => {
  const mockCosmosRestService = {
    getProposals$: jest.fn(() => of(undefined)),
  };
  const { service } = setup({
    mockCosmosRestService,
  });
  return {
    service,
    mockCosmosRestService,
  };
};

describe('ProposalsUseCaseService when getProposals$ return undefined', () => {
  it('should be created', () => {
    const { service } = setupUndefinedEnv();
    expect(service).toBeTruthy();
  });

  test('proposal$ returns undefined', (done) => {
    const { service } = setupUndefinedEnv();
    service.proposals$.subscribe((value) => {
      expect(value).toBe(undefined);
      done();
    });
  });

  test('pageLength$ returns undefined', (done) => {
    const { service } = setupUndefinedEnv();
    service.pageLength$(service.proposals$).subscribe((value) => {
      expect(value).toBe(undefined);
      done();
    });
  });

  test('paginatedProposals$ returns an empty array', (done) => {
    const { service } = setupUndefinedEnv();
    service.paginatedProposals$(service.proposals$, of(1), of(2)).subscribe((value) => {
      expect(value).toEqual([]);
      done();
    });
  });
});
