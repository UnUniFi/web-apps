import { ConfigService } from './../../../models/config.service';
import { CosmosRestService } from './../../../models/cosmos-rest.service';
import { CosmosSDKService } from './../../../models/cosmos-sdk.service';
import { ProposalsUseCaseService } from './proposals.usecase.service';
import { TestBed } from '@angular/core/testing';
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
    mockConfig,
    mockCosmosRestService,
  };
};

describe('ProposalsUseCaseService', () => {
  it('should be created', () => {
    const { service } = setup();
    expect(service).toBeTruthy();
  });

  /*
  proposals$: Observable<InlineResponse20027Proposals[]>;
  proposalContents$: Observable<(cosmosclient.proto.cosmos.gov.v1beta1.TextProposal | undefined)[]>;
  paginatedProposals$: Observable<InlineResponse20027Proposals[]>;
  tallies$: Observable<(InlineResponse20027FinalTallyResult | undefined)[]>;
  */
  test.todo('proposal$ returns original proposals');

  test.todo('paginatedProposals$ returns proposal with pagination');

  test.todo('proposalContents$ returns paginated proposal contents');

  test.todo('tallies$ returns paginated tallies');
});
