import { WalletService } from '../../../models/wallets/wallet.service';
import { CosmosRestService } from './../../../models/cosmos-rest.service';
import { KeyType } from './../../../models/keys/key.model';
import { StoredWallet, WalletType } from './../../../models/wallets/wallet.model';
import { ValidatorsUseCaseService } from './validators.usecase.service';
import { TestBed } from '@angular/core/testing';
import {
  InlineResponse20041Validators,
  InlineResponse20038,
} from '@cosmos-client/core/esm/openapi';
import { BehaviorSubject, of } from 'rxjs';

const setup = (props?: { mockCosmosRestService?: any; mockWalletService?: any }) => {
  // Mock Values
  const mockValidator1: InlineResponse20041Validators = {
    tokens: '100',
    status: 'BOND_STATUS_BONDED',
    operator_address: 'ununifivaloper1tu06z57hgfhen4s565zvnr5aqxnzrtfv53ztvq',
  };
  const mockValidator2: InlineResponse20041Validators = {
    tokens: '200',
    status: 'BOND_STATUS_BONDED',
    operator_address: 'ununifivaloper13uaskveualnc8kkfwrk6g7dmkcggxn3t9nqhu6',
  };
  const mockValidator3: InlineResponse20041Validators = {
    tokens: '300',
    status: 'BOND_STATUS_UNBONDED',
    operator_address: 'test_address3',
  };
  const mockValidators = [mockValidator1, mockValidator2, mockValidator3];

  const mockDelegationResponses: InlineResponse20038 = {
    delegation_responses: [
      {
        delegation: {
          delegator_address: 'test_delegator_address1',
          validator_address: 'ununifivaloper1tu06z57hgfhen4s565zvnr5aqxnzrtfv53ztvq',
          shares: '0.1',
        },
        balance: { denom: 'uguu', amount: '100' },
      },
      {
        delegation: {
          delegator_address: 'test_delegator_address2',
          validator_address: 'ununifivaloper13uaskveualnc8kkfwrk6g7dmkcggxn3t9nqhu6',
        },
        balance: { denom: 'uguu', amount: '100' },
      },
    ],
  };

  const mockWallet: StoredWallet = {
    id: 'test_id',
    type: WalletType.ununifi,
    key_type: KeyType.secp256k1,
    public_key: '0202d591fa3c0e4d10602fb0fc1c595cd19d6101bd4a9ea4e22a19648d77c64a17',
    address: 'ununifi1tu06z57hgfhen4s565zvnr5aqxnzrtfvpdhv60',
  };

  // Mock Services
  const mockWalletService = {
    currentStoredWallet$: of(mockWallet),
  };
  const mockCosmosRestService = {
    getValidators$: jest.fn(() => of(mockValidators)),
    getDelegatorDelegations$: jest.fn(() => of(mockDelegationResponses)),
    getUnbondingDelegation$: jest.fn(() => of(undefined)),
  };

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
    mockWalletService,
    mockWallet,
    mockValidators,
    mockDelegationResponses,
  };
};

describe('ValidatorsUseCaseService when CosmosRestService returns a valid value', () => {
  it('should be created', () => {
    const { service } = setup();
    expect(service).toBeTruthy();
  });

  test('validators$ method get only enable validators from all validator', (done) => {
    const { service, mockValidators } = setup();
    const acticveEnabled = new BehaviorSubject(true);
    service.validators$(acticveEnabled).subscribe((value) => {
      expect(value.map((e) => e.val)).toEqual(
        mockValidators.filter((v) => v.status == 'BOND_STATUS_BONDED').reverse(),
      );
      done();
    });
  });

  test('currentStoredWallet$ getter gets currentStoresWallet$', (done) => {
    const { service, mockWallet } = setup();
    service.currentStoredWallet$.subscribe((value) => {
      expect(value).toEqual(mockWallet);
      done();
    });
  });

  test('delegatedValidators$ returns the validators found in the delegator_response', (done) => {
    const { service, mockValidators } = setup();
    service.delegatedValidators$.subscribe((value) => {
      expect(value).toEqual([mockValidators[0], mockValidators[1]]);
      done();
    });
  });

  test('filteredUnbondingDelegations$ calls getUnbondingDelegation$ from CosmosRestService for number of delegator_responses', (done) => {
    const { service, mockCosmosRestService, mockDelegationResponses } = setup();
    service.filteredUnbondingDelegations$.subscribe(() => {
      expect(mockCosmosRestService.getUnbondingDelegation$).toBeCalledTimes(
        mockDelegationResponses.delegation_responses?.length || 99,
      );
      done();
    });
  });
});
