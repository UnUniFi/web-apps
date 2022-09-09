import { WalletService } from '../../../models/wallets/wallet.service';
import { CosmosRestService } from './../../../models/cosmos-rest.service';
import { KeyType } from './../../../models/keys/key.model';
import { StoredWallet, WalletType } from './../../../models/wallets/wallet.model';
import { ValidatorsUseCaseService } from './validators.usecase.service';
import { TestBed } from '@angular/core/testing';
import cosmosclient from '@cosmos-client/core';
import {
  InlineResponse20041Validators,
  InlineResponse20038,
} from '@cosmos-client/core/esm/openapi';
import { of } from 'rxjs';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { concatMap, filter, map, mergeMap, withLatestFrom } from 'rxjs/operators';

cosmosclient.config.setBech32Prefix({
  accAddr: 'ununifi',
  accPub: 'ununifipub',
  valAddr: 'ununifivaloper',
  valPub: 'ununifivaloperpub',
  consAddr: 'ununifivalcons',
  consPub: 'ununifivalconspub',
});

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

describe('ValidatorsUseCaseService when CosmosRest & WalletService returns a valid value', () => {
  it('should be created', () => {
    const { service } = setup();
    expect(service).toBeTruthy();
  });

  describe('Getters returns a valid value', () => {
    test('currentStoredWallet$ returns a valid value', (done) => {
      const { service, mockWallet } = setup();
      service.currentStoredWallet$.subscribe((value) => {
        expect(value).toEqual(mockWallet);
        done();
      });
    });
    test('validatorsList$() returns a valid value', (done) => {
      const { service, mockValidators } = setup();
      service.validatorsList$.subscribe((value) => {
        expect(value).toEqual(mockValidators);
        done();
      });
    });
    test('accAddress$() returns a valid value', (done) => {
      const { service, mockWallet } = setup();
      service.accAddress$.subscribe((value) => {
        expect(value.toString()).toEqual(mockWallet.address);
        done();
      });
    });
  });

  test('validators$ method get only enable validators from all validator', (done) => {
    const { service, mockValidators } = setup();
    const activeEnabled = new BehaviorSubject(true);
    service.validators$(service.validatorsList$, activeEnabled).subscribe((value) => {
      expect(value.map((e) => e.val)).toEqual(
        mockValidators.filter((v) => v.status == 'BOND_STATUS_BONDED').reverse(),
      );
      done();
    });
  });

  test('delegations$ returns the delegation responses', (done) => {
    const { service, mockDelegationResponses } = setup();
    service.delegations$(service.accAddress$).subscribe((value) => {
      expect(value).toEqual(mockDelegationResponses.delegation_responses);
      done();
    });
  });

  test('delegatedValidators$ returns the delegated validators', (done) => {
    const { service, mockValidators } = setup();
    service
      .delegatedValidators$(service.validatorsList$, service.delegations$(service.accAddress$))
      .subscribe((value) => {
        expect(value).toEqual([mockValidators[0], mockValidators[1]]);
        done();
      });
  });

  test('unbondingDelegations$ calls getUnbondingDelegation$ from CosmosRestService for number of delegator_responses', (done) => {
    const { service, mockCosmosRestService, mockDelegationResponses } = setup();
    const delegatedValidators = service.delegatedValidators$(
      service.validatorsList$,
      service.delegations$(service.accAddress$),
    );
    service.unbondingDelegations$(delegatedValidators, service.accAddress$).subscribe(() => {
      expect(mockCosmosRestService.getUnbondingDelegation$).toBeCalledTimes(
        mockDelegationResponses.delegation_responses?.length || 99,
      );
      done();
    });
  });
});

const setupUndefinedEnv = () => {
  const mockCosmosRestService = {
    getValidators$: jest.fn(() => of(undefined)),
    getDelegatorDelegations$: jest.fn(() => of(undefined)),
    getUnbondingDelegation$: jest.fn(() => of(undefined)),
  };
  const mockWalletService = {
    currentStoredWallet$: of(undefined),
  };
  const { service, mockWallet, mockValidators, mockDelegationResponses } = setup({
    mockCosmosRestService,
    mockWalletService,
  });
  return {
    service,
    mockWallet,
    mockValidators,
    mockCosmosRestService,
    mockDelegationResponses,
  };
};

describe('ValidatorUseCaseService when no CosmosRestService and no CurrentWallet', () => {
  it('should be created', () => {
    const { service } = setupUndefinedEnv();
    expect(service).toBeTruthy();
  });

  test('All Getters return undefined', (done) => {
    const { service } = setupUndefinedEnv();
    combineLatest([
      service.currentStoredWallet$,
      service.validatorsList$,
      service.accAddress$,
    ]).subscribe((values) => {
      expect(values.every((v) => v === undefined)).toBeTruthy();
      done();
    });
  });

  test('All Getters return undefined c', (done) => {
    const { service } = setupUndefinedEnv();
    combineLatest([service.currentStoredWallet$]).subscribe((values) => {
      expect(values.every((v) => v === undefined)).toBeTruthy();
      done();
    });
  });

  test('All Getters return undefined v', (done) => {
    const { service } = setupUndefinedEnv();
    combineLatest([service.validatorsList$]).subscribe((values) => {
      expect(values.every((v) => v === undefined)).toBeTruthy();
      done();
    });
  });

  test('All Getters return undefined a', (done) => {
    const { service } = setupUndefinedEnv();
    combineLatest([service.accAddress$]).subscribe((values) => {
      expect(values.every((v) => v === undefined)).toBeTruthy();
      done();
    });
  });

  test('validators$ method returns void array', (done) => {
    const { service } = setupUndefinedEnv();
    const activeEnabled = new BehaviorSubject(true);
    service.validators$(service.validatorsList$, activeEnabled).subscribe((value) => {
      expect(value).toEqual([]);
      done();
    });
  });

  test('delegations$ method returns undefined', (done) => {
    const { service } = setupUndefinedEnv();
    service.delegations$(service.accAddress$).subscribe((value) => {
      expect(value).toEqual(undefined);
      done();
    });
  });

  test('delegatedValidators$ returns undefined', (done) => {
    const { service, mockValidators } = setupUndefinedEnv();
    service
      .delegatedValidators$(service.validatorsList$, service.delegations$(service.accAddress$))
      .subscribe((value) => {
        expect(value).toEqual(undefined);
        done();
      });
  });

  test('unbondingDelegations$ method returns void value', (done) => {
    const { service, mockCosmosRestService, mockDelegationResponses } = setupUndefinedEnv();
    const delegatedValidators = service.delegatedValidators$(
      service.validatorsList$,
      service.delegations$(service.accAddress$),
    );
    service.unbondingDelegations$(delegatedValidators, service.accAddress$).subscribe((value) => {
      expect(value).toEqual([]);
      done();
    });
  });
});

/*
const setupUndefinedEnvWithWallet = () => {
  const mockCosmosRestService = {
    getValidators$: jest.fn(() => of(undefined)),
    getDelegatorDelegations$: jest.fn(() => of(undefined)),
    getUnbondingDelegation$: jest.fn(() => of(undefined)),
  };
  const { service, mockWallet, mockValidators, mockDelegationResponses } = setup({
    mockCosmosRestService,
  });
  return {
    service,
    mockWallet,
    mockValidators,
    mockCosmosRestService,
    mockDelegationResponses,
  };
};

describe('ValidatorUseCaseService when no CosmosRestService', () => {
  it('should be created', () => {
    const { service } = setupUndefinedEnv();
    expect(service).toBeTruthy();
  });
  test('delegatedValidators$ returns undefined', (done) => {
    const { service } = setupUndefinedEnvWithWallet();
    console.log('time out');
    service.delegatedValidators$.subscribe((v) => {
      expect(v).toBe(undefined);
      done();
    });
  });
});
*/
