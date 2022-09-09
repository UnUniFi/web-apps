import { CosmosRestService } from './../../../../models/cosmos-rest.service';
import { ValidatorUseCaseService } from './validator.usecase.service';
import { TestBed } from '@angular/core/testing';
import cosmosclient from '@cosmos-client/core';
import { InlineResponse20041Validators } from '@cosmos-client/core/esm/openapi';
import { of } from 'rxjs';

const setup = (props?: { mockCosmosRestService?: any }) => {
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

  cosmosclient.config.setBech32Prefix({
    accAddr: 'ununifi',
    accPub: 'ununifipub',
    valAddr: 'ununifivaloper',
    valPub: 'ununifivaloperpub',
    consAddr: 'ununifivalcons',
    consPub: 'ununifivalconspub',
  });

  test('accAddress$ method returns accAddress from validatorAddress', (done) => {
    const { service, validatorAddress$, accAddress } = setup();
    service.accAddress$(validatorAddress$).subscribe((value) => {
      expect(value).toEqual(accAddress);
      done();
    });
  });

  test('validator$ method returns validatorType from validatorAddress', (done) => {
    const { service, mockValidators } = setup();
    const valAddr = cosmosclient.ValAddress.fromString(mockValidators[0].operator_address!);
    service.validator$(of(valAddr)).subscribe((value) => {
      expect(value?.val).toBe(mockValidators.reverse()[0]);
      done();
    });
  });
});
