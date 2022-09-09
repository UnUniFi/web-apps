import { CosmosRestService } from './../../../../models/cosmos-rest.service';
import { validatorType } from './../../../../views/delegate/validators/validators.component';
import { Injectable } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import { combineLatest, Observable } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ValidatorUseCaseService {
  private allValidatorsTokens$: Observable<number | undefined>;
  private OtherValidators$: Observable<validatorType[]>;

  constructor(private cosmosRest: CosmosRestService) {
    const validatorsList$ = this.cosmosRest.getValidators$();
    this.allValidatorsTokens$ = validatorsList$.pipe(
      map((validators) =>
        validators?.reduce((sum, validator) => {
          return sum + Number(validator.tokens);
        }, 0),
      ),
    );
    this.OtherValidators$ = this.allValidatorsTokens$.pipe(
      withLatestFrom(validatorsList$),
      map(([allTokens, validators]) => {
        if (!allTokens) {
          return [];
        }
        // sort by share (Token)
        const validatorsWithSorted = validators?.sort(
          (x, y) => Number(y.tokens) - Number(x.tokens),
        );
        // calc rank, check active
        const validatorsWitSd = validatorsWithSorted?.map((validator, index) => {
          const val = validator;
          const rank = index + 1;
          const share = Number(validator.tokens) / allTokens;
          const statusBonded = validator.status === 'BOND_STATUS_BONDED';
          const inList = statusBonded && rank <= 50;
          return { val, share, inList, rank };
        });
        return validatorsWitSd || [];
      }),
    );
  }

  accAddress$(
    validatorAddress$: Observable<cosmosclient.ValAddress>,
  ): Observable<cosmosclient.AccAddress | undefined> {
    return validatorAddress$.pipe(map((validatorAddress) => validatorAddress.toAccAddress()));
  }

  validator$(
    validatorAddress$: Observable<cosmosclient.ValAddress>,
  ): Observable<validatorType | undefined> {
    return combineLatest([validatorAddress$, this.OtherValidators$]).pipe(
      map(([validatorAddress, OtherValidators]) =>
        OtherValidators.find(
          (validator) => validator.val.operator_address === validatorAddress.toString(),
        ),
      ),
    );
  }
}
