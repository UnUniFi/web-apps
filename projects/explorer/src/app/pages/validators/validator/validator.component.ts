import { CosmosSDKService } from '../../../models/cosmos-sdk.service';
import { validatorType } from '../../../views/validators/validators.component';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import cosmosclient from '@cosmos-client/core';
import { QueryValidatorsResponseIsResponseTypeForTheQueryValidatorsRPCMethod } from '@cosmos-client/core/esm/openapi';
import { Observable, combineLatest } from 'rxjs';
import { map, withLatestFrom, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-validator',
  templateUrl: './validator.component.html',
  styleUrls: ['./validator.component.css'],
})
export class ValidatorComponent implements OnInit {
  validatorsList$: Observable<QueryValidatorsResponseIsResponseTypeForTheQueryValidatorsRPCMethod>;
  allValidatorsTokens$: Observable<number | undefined>;
  OtherValidators$: Observable<validatorType[]>;
  validator$: Observable<validatorType | undefined>;

  accAddress$: Observable<cosmosclient.AccAddress | undefined>;

  constructor(private route: ActivatedRoute, private cosmosSDK: CosmosSDKService) {
    const validatorAddress$ = this.route.params.pipe(
      map((params) => params.address),
      map((addr) => cosmosclient.ValAddress.fromString(addr)),
    );
    this.accAddress$ = validatorAddress$.pipe(
      map((validatorAddress) => validatorAddress.toAccAddress()),
    );

    this.validatorsList$ = this.cosmosSDK.sdk$.pipe(
      mergeMap((sdk) => cosmosclient.rest.staking.validators(sdk.rest)),
      map((result) => result.data),
    );

    this.allValidatorsTokens$ = this.validatorsList$.pipe(
      map((validators) =>
        validators?.validators?.reduce((sum, validator) => {
          return sum + Number(validator.tokens);
        }, 0),
      ),
    );

    this.OtherValidators$ = this.allValidatorsTokens$.pipe(
      withLatestFrom(this.validatorsList$),
      map(([allTokens, validators]) => {
        if (!allTokens) {
          return [];
        }

        // sort by share (Token)
        const validatorsWithSorted = validators.validators?.sort(
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

    this.validator$ = combineLatest([validatorAddress$, this.OtherValidators$]).pipe(
      map(([validatorAddress, OtherValidators]) =>
        OtherValidators.find(
          (validator) => validator.val.operator_address === validatorAddress.toString(),
        ),
      ),
    );
  }

  ngOnInit() { }
}
