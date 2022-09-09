import { CosmosRestService } from './../../../../models/cosmos-rest.service';
import { validatorType } from './../../../../views/delegate/validators/validators.component';
import { ValidatorUseCaseService } from './validator.usecase.service';
import { Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import cosmosclient from '@cosmos-client/core';
import {
  InlineResponse20038DelegationResponses,
  InlineResponse20041Validators,
  InlineResponse20047,
} from '@cosmos-client/core/esm/openapi';
import { setBech32Prefix } from '@cosmos-client/core/esm/types/address/config';
import { combineLatest, of } from 'rxjs';
import { Observable } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';

const setup = (props?: { mockCosmosRestService?: any }) => {
  // Mock Values
  const mockValidator1: InlineResponse20041Validators = { tokens: '100' };
  const mockValidator2: InlineResponse20041Validators = { tokens: '300' };
  const mockValidator3: InlineResponse20041Validators = { tokens: '200' };
  const mockValidators = [mockValidator1, mockValidator2, mockValidator3];

  // Mock Services
  const mockCosmosRestService = {
    //getValidators$: jest.fn(() => jest.fn(() => of(mockValidators))),
    getValidators$: jest.fn(() => of(mockValidators)),
    //getValidators$: of(mockValidators),
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

  const validatorAddress = cosmosclient.ValAddress.fromString(
    'ununifivaloper167wfxxmlqphp5kl7dw4vh0aw9ymne7k0cmtz5n',
  );
  const validatorAddress$ = of(validatorAddress);

  return {
    service,
    mockCosmosRestService,
    validatorAddress$,
  };
};

describe('ValidatorUseCaseService when CosmosRestService returns a valid value', () => {
  it('should be created', () => {
    const { service } = setup();
    expect(service).toBeTruthy();
  });

  setBech32Prefix({
    accAddr: 'ununifi',
    accPub: 'ununifipub',
    valAddr: 'ununifivaloper',
    valPub: 'ununifivaloperpub',
    consAddr: 'ununifivalcons',
    consPub: 'ununifivalconspub',
  });

  test('accAddress$ method returns accAddress from validatorAddress', (done) => {
    const { service, mockCosmosRestService, validatorAddress$ } = setup();

    service.accAddress$(validatorAddress$).subscribe((value) => {
      expect(value).toBe('ununifi167wfxxmlqphp5kl7dw4vh0aw9ymne7k0d879zu');
      done();
    });
  });

  test('validator$ method returns validatorType from validatorAddress', (done) => {
    const { service, mockCosmosRestService, validatorAddress$ } = setup();
    service.validator$(validatorAddress$).subscribe((value) => {
      expect(value).toBe('');
      done();
    });
  });
});
