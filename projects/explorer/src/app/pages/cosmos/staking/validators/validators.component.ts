import { CosmosSDKService } from '../../../../models/cosmos-sdk.service';
import { Component, OnInit } from '@angular/core';
import { docData } from '@angular/fire/firestore';
import { rest } from '@cosmos-client/core';
import {
  QueryValidatorsResponseIsResponseTypeForTheQueryValidatorsRPCMethod,
  InlineResponse20066Validators,
} from '@cosmos-client/core/esm/openapi';
import { Observable, from, BehaviorSubject } from 'rxjs';
import { map, mergeMap, withLatestFrom, filter } from 'rxjs/operators';

export type validatorType = {
  val: InlineResponse20066Validators;
  share: number;
  isActive: boolean;
  rank: number;
};

export type validatorWithShareType = {
  val: InlineResponse20066Validators;
  share: number;
};

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

  activeEnabled: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private cosmosSDK: CosmosSDKService) {
    this.validatorsList$ = this.cosmosSDK.sdk$.pipe(
      mergeMap((sdk) => rest.staking.validators(sdk.rest)),
      map((result) => result.data),
    );
    //for debug
    this.validatorsList$.subscribe((x) => console.log('val', x));

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
        const validatorsWithSort = validatorsWithShare?.sort((x, y) => x.share - y.share);
        return validatorsWithSort || [];
      }),
    );

    this.validatorsWithShare$.subscribe((x) => console.log('val2', x));

    this.validators$ = this.validatorsWithShare$.pipe(
      map((x) => {
        const cc = x
          .map((x, index) => {
            // calculate validator share
            const val = x.val;
            const share = x.share;
            const rank = index + 1;
            const statusBonded = x.val.status === 'BOND_STATUS_BONDED';
            const isActive = statusBonded && rank < 50;
            return { val, share, isActive, rank };
          })
          .filter((x) => x.isActive);

        return cc;
      }),
    );
    this.validators$.subscribe((x) => console.log('val3', x));
    //this.validatorShares$.subscribe((x) => console.log('s', x));
  }

  ngOnInit() {}

  onCheckBoxAutoChange(checked: boolean) {
    this.activeEnabled.next(checked);
  }
}
