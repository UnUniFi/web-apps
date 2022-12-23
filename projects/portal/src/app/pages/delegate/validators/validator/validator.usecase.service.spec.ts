import { CosmosRestService } from './../../../../models/cosmos-rest.service';
import { ValidatorUseCaseService } from './validator.usecase.service';
import { TestBed } from '@angular/core/testing';
import cosmosclient from '@cosmos-client/core';
import { StakingDelegatorValidators200ResponseValidatorsInner } from '@cosmos-client/core/esm/openapi';
import { of } from 'rxjs';

cosmosclient.config.setBech32Prefix({
  accAddr: 'ununifi',
  accPub: 'ununifipub',
  valAddr: 'ununifivaloper',
  valPub: 'ununifivaloperpub',
  consAddr: 'ununifivalcons',
  consPub: 'ununifivalconspub',
});

const setup = (props?: { mockCosmosRestService?: any }) => {
  // Mock Values
  const mockValidator1: StakingDelegatorValidators200ResponseValidatorsInner = {
    tokens: '100',
    status: 'BOND_STATUS_BONDED',
    operator_address: 'ununifivaloper1tu06z57hgfhen4s565zvnr5aqxnzrtfv53ztvq',
  };
  const mockValidator2: StakingDelegatorValidators200ResponseValidatorsInner = {
    tokens: '200',
    status: 'BOND_STATUS_BONDED',
    operator_address: 'ununifivaloper13uaskveualnc8kkfwrk6g7dmkcggxn3t9nqhu6',
  };
  const mockValidator3: StakingDelegatorValidators200ResponseValidatorsInner = {
    tokens: '300',
    status: 'BOND_STATUS_UNBONDED',
    operator_address: 'test_address3',
  };
  const mockValidators = [mockValidator1, mockValidator2, mockValidator3];

  // Mock Services
  const mockCosmosRestService = {
    getValidators$: jest.fn(() => of(mockValidators)),
  };

  // Setup TestBed
  TestBed.configureTestingModule({
    providers: [
      ValidatorUseCaseService,
      {
        provide: CosmosRestService,
        useValue: { ...mockCosmosRestService, ...props?.mockCosmosRestService },
      },
    ],
  });
  const service = TestBed.inject(ValidatorUseCaseService);

  //
  const accAddress = cosmosclient.AccAddress.fromString(
    'ununifi167wfxxmlqphp5kl7dw4vh0aw9ymne7k0d879zu',
  );
  const valAddress = accAddress.toValAddress();
  const validatorAddress$ = of(valAddress);

  return {
    service,
    mockCosmosRestService,
    mockValidators,
    validatorAddress$,
    accAddress,
  };
};

describe('ValidatorUseCaseService when CosmosRestService returns a valid value', () => {
  it('should be created', () => {
    const { service } = setup();
    expect(service).toBeTruthy();
  });

  test('accAddress$ method returns accAddress from validatorAddress', (done) => {
    const { service, validatorAddress$, accAddress } = setup();
    service.accAddress$(validatorAddress$).subscribe((value) => {
      expect(value).toEqual(accAddress);
      done();
    });
  });

  test('validator$ method looks up the entered Validator in the validator list', (done) => {
    const { service, mockValidators } = setup();
    const valAddr = cosmosclient.ValAddress.fromString(mockValidators[0].operator_address!);
    const checkVal = mockValidators[0];
    service.validator$(of(valAddr)).subscribe((value) => {
      expect(value?.val).toBe(checkVal);
      done();
    });
  });
});

const setupUndefinedEnv = () => {
  const mockCosmosRestService = {
    getValidators$: jest.fn(() => of(undefined)),
  };

  const { service, validatorAddress$, accAddress, mockValidators } = setup({
    mockCosmosRestService,
  });
  return {
    service,
    validatorAddress$,
    accAddress,
    mockValidators,
  };
};

describe('ValidatorUseCaseService when CosmosRestService returns undefined', () => {
  it('should be created', () => {
    const { service } = setupUndefinedEnv();
    expect(service).toBeTruthy();
  });
  test('accAddress$ method returns accAddress from validatorAddress regardless of CosmosRestService', (done) => {
    const { service, validatorAddress$, accAddress } = setupUndefinedEnv();
    service.accAddress$(validatorAddress$).subscribe((value) => {
      expect(value).toEqual(accAddress);
      done();
    });
  });
  test('validator$ method return undefined because there is not validator list', (done) => {
    const { service, mockValidators } = setupUndefinedEnv();
    const valAddr = cosmosclient.ValAddress.fromString(mockValidators[0].operator_address!);
    service.validator$(of(valAddr)).subscribe((value) => {
      expect(value).toBe(undefined);
      done();
    });
  });
});
