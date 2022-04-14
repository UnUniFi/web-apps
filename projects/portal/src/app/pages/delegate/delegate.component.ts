import { CosmosSDKService } from '../../models/cosmos-sdk.service';
import { StakingApplicationService } from '../../models/cosmos/staking.application.service';
import { validatorType, validatorWithShareType } from '../../views/delegate/delegate.component';
import { Component, OnInit } from '@angular/core';
import { rest } from '@cosmos-client/core';
import {
  InlineResponse20066Validators,
  QueryValidatorsResponseIsResponseTypeForTheQueryValidatorsRPCMethod,
} from '@cosmos-client/core/esm/openapi';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map, mergeMap, withLatestFrom } from 'rxjs/operators';

@Component({
  selector: 'app-delegate',
  templateUrl: './delegate.component.html',
  styleUrls: ['./delegate.component.css'],
})
export class DelegateComponent implements OnInit {
  validatorsList$: Observable<QueryValidatorsResponseIsResponseTypeForTheQueryValidatorsRPCMethod>;
  allValidatorsTokens$: Observable<number | undefined>;
  validatorsWithShare$: Observable<validatorWithShareType[]>;
  validators$: Observable<validatorType[]>;

  activeEnabled: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor(
    private cosmosSDK: CosmosSDKService,
    private readonly stakingAppService: StakingApplicationService,
  ) {
    this.validatorsList$ = this.cosmosSDK.sdk$.pipe(
      mergeMap((sdk) => rest.staking.validators(sdk.rest)),
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
        const validatorsWithShare = validators.validators?.map((validator) => {
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

  onSubmitDelegate(validator: InlineResponse20066Validators) {
    this.stakingAppService.openDelegateFormDialog(validator);
  }
}
