import {
  validatorType,
  validatorWithShareType,
} from '../../../views/dashboard/validators/validators.component';
import { Component, OnInit } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import { QueryValidatorsResponseIsResponseTypeForTheQueryValidatorsRPCMethod } from '@cosmos-client/core/esm/openapi';
import { CosmosSDKService } from '@ununifi/shared';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map, mergeMap, withLatestFrom } from 'rxjs/operators';

@Component({
  selector: 'app-validators',
  templateUrl: './validators.component.html',
  styleUrls: ['./validators.component.css'],
})
export class ValidatorsComponent implements OnInit {
  validatorsList$: Observable<QueryValidatorsResponseIsResponseTypeForTheQueryValidatorsRPCMethod>;
  allValidatorsTokens$: Observable<number | undefined>;
  validatorsWithShare$: Observable<validatorWithShareType[]>;
  validators$: Observable<validatorType[]>;

  activeEnabled: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor(private cosmosSDK: CosmosSDKService) {
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

    this.validatorsWithShare$ = this.allValidatorsTokens$.pipe(
      withLatestFrom(this.validatorsList$),
      map(([allTokens, validators]) => {
        if (!allTokens) {
          return [];
        }
        // calculate validator share
        const validatorsWithShare: validatorWithShareType[] | undefined =
          validators.validators?.map((validator) => {
            const val = validator;
            const share = Number(validator.tokens) / allTokens;
            return { val, share };
          });
        // sort by share
        const validatorsWithSort = validatorsWithShare?.sort((x, y) => y.share - x.share);

        return validatorsWithSort || [];
      }),
    );

    // select listing validators by checking status and rank
    this.validators$ = combineLatest([this.validatorsWithShare$, this.activeEnabled]).pipe(
      map(([validatorWithShare, activeEnabled]) =>
        validatorWithShare
          .map((validatorWithShare, index) => {
            if (activeEnabled) {
              const val = validatorWithShare.val;
              const share = validatorWithShare.share;
              const rank = index + 1;
              const statusBonded = validatorWithShare.val.status === 'BOND_STATUS_BONDED';
              const inList = statusBonded && rank <= 50;
              return { val, share, inList, rank };
            } else {
              const val = validatorWithShare.val;
              const share = validatorWithShare.share;
              const rank = index + 1;
              const statusBonded = validatorWithShare.val.status === 'BOND_STATUS_BONDED';
              const inList = !(statusBonded && rank <= 50);
              return { val, share, inList, rank };
            }
          })
          .filter((validator) => validator.inList),
      ),
    );
  }

  ngOnInit() {}

  onToggleChange(value: boolean) {
    this.activeEnabled.next(value);
  }
}
