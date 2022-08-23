import { CosmosRestService } from './../../../models/cosmos-rest.service';
import { ProposalsUseCaseService } from './proposals.usecase.service';
import { TestBed } from '@angular/core/testing';
import { InlineResponse20027Proposals } from '@cosmos-client/core/esm/openapi';
import { combineLatest, of } from 'rxjs';

const setup = (props?: { mockCosmosRestService?: any }) => {
  // Mock Values
  const mockProposal1: InlineResponse20027Proposals = { proposal_id: '1' };
  const mockProposal2: InlineResponse20027Proposals = { proposal_id: '2' };
  const mockProposal3: InlineResponse20027Proposals = { proposal_id: '3' };
  const mockCosmosRestService = {
    getProposals$: jest.fn(() => of(undefined)),
    getTallyResult$: jest.fn(() => of(undefined)),
    proposals: of([mockProposal1, mockProposal2, mockProposal3]),
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
  };
};

describe('ProposalsUseCaseService', () => {
  it('should be created', () => {
    const { service } = setup();
    expect(service).toBeTruthy();
  });

  test('proposal$ calls getProposals$ in CosmosRestService', (done) => {
    const { service, mockCosmosRestService } = setup();
    service.proposals$.subscribe(() => {
      expect(mockCosmosRestService.getProposals$).toHaveBeenCalled();
      done();
    });
  });

  test('pageLength$ returns number of proposals', (done) => {
    const { service, mockCosmosRestService } = setup();
    combineLatest([
      service.pageLength$(mockCosmosRestService.proposals),
      mockCosmosRestService.proposals,
    ]).subscribe(([pageLength, proposals]) => {
      expect(pageLength).toBe(proposals.length);
      done();
    });
  });

  test('paginatedProposals$ returns proposal with pagination', (done) => {
    const { service, mockCosmosRestService } = setup();
    combineLatest([
      service.paginatedProposals$(mockCosmosRestService.proposals, of(1), of(2)),
      mockCosmosRestService.proposals,
    ]).subscribe(([paginatedProposals, proposals]) => {
      expect(paginatedProposals).toStrictEqual(proposals.slice(1, 3).reverse());
      done();
    });
  });

  test.todo('proposalContents$ returns paginated proposal contents');

  test('tallies$ calls getTallyResult$ in CosmosRestService, number of pagesize', (done) => {
    const { service, mockCosmosRestService } = setup();
    service.tallies$(mockCosmosRestService.proposals, of(1), of(2)).subscribe(() => {
      expect(mockCosmosRestService.getTallyResult$).toHaveBeenCalledTimes(2);
      done();
    });
  });
});
