import { CosmosRestService } from '../../../models/cosmos-rest.service';
import { StoredWallet } from '../../../models/wallets/wallet.model';
import { WalletService } from '../../../models/wallets/wallet.service';
import {
  validatorType,
  validatorWithShareType,
} from '../../../views/delegate/validators/validators.component';
import { Injectable } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import {
  InlineResponse20038DelegationResponses,
  InlineResponse20041Validators,
  InlineResponse20047,
} from '@cosmos-client/core/esm/openapi';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { concatMap, filter, map, mergeMap, withLatestFrom } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ValidatorsUseCaseService {
  private validatorsList$: Observable<InlineResponse20041Validators[] | undefined>;
  private allValidatorsTokens$: Observable<number | undefined>;
  private validatorsWithShare$: Observable<validatorWithShareType[]>;
  private accAddress$: Observable<cosmosclient.AccAddress>;
  private delegationsInService$: Observable<InlineResponse20038DelegationResponses[] | undefined>;
  private delegatedValidatorsInService$: Observable<
    (InlineResponse20041Validators | undefined)[] | undefined
  >;
  private totalDelegation$: Observable<number | undefined>;
  private unbondingDelegations$: Observable<(InlineResponse20047 | undefined)[]>;

  constructor(
    private readonly walletService: WalletService,
    private readonly cosmosRest: CosmosRestService,
  ) {
    this.validatorsList$ = this.cosmosRest.getValidators$();
    this.allValidatorsTokens$ = this.validatorsList$.pipe(
      map((validators) =>
        validators?.reduce((sum, validator) => {
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
        const validatorsWithShare = validators?.map((validator) => {
          const val = validator;
          const share = Number(validator.tokens) / allTokens;
          return { val, share };
        });
        // sort by share
        const validatorsWithSort = validatorsWithShare?.sort((x, y) => y.share - x.share);

        return validatorsWithSort || [];
      }),
    );

    this.accAddress$ = this.walletService.currentStoredWallet$.pipe(
      filter((wallet): wallet is StoredWallet => wallet !== undefined && wallet !== null),
      map((wallet) => cosmosclient.AccAddress.fromString(wallet.address)),
    );

    this.delegationsInService$ = this.accAddress$.pipe(
      mergeMap((address) => this.cosmosRest.getDelegatorDelegations$(address)),
      map((result) => (result?.delegation_responses ? result.delegation_responses : undefined)),
    );
    this.totalDelegation$ = this.delegationsInService$.pipe(
      map((delegations) =>
        delegations?.reduce(
          (sum, element) =>
            element.balance?.denom == 'uguu' ? sum + Number(element.balance?.amount) : sum,
          0,
        ),
      ),
    );
    this.delegatedValidatorsInService$ = combineLatest([
      this.validatorsList$,
      this.delegationsInService$,
    ]).pipe(
      map(([validators, delegations]) =>
        delegations?.map((delegation) =>
          validators?.find(
            (validator) => validator.operator_address == delegation.delegation?.validator_address,
          ),
        ),
      ),
    );

    this.unbondingDelegations$ = this.delegatedValidatorsInService$.pipe(
      withLatestFrom(this.accAddress$),
      concatMap(([validators, accAddress]) => {
        if (!validators) {
          console.log('0');
          return [];
        }

        const valAddressList: (cosmosclient.ValAddress | undefined)[] = validators.map(
          (validator) => {
            if (!validator?.operator_address) {
              console.log('1');
              return undefined;
            }
            try {
              return cosmosclient.ValAddress.fromString(validator?.operator_address);
            } catch (error) {
              console.error(error);
              return undefined;
            }
          },
        );
        if (!valAddressList) return [];

        const unbondingDelegationList = Promise.all(
          valAddressList.map((valAddress) => {
            if (!valAddress) return undefined;
            return this.cosmosRest.getUnbondingDelegation$(valAddress, accAddress).toPromise();
          }),
        );
        return unbondingDelegationList;
      }),
    );
  }

  validators$(activeEnabled: BehaviorSubject<boolean>): Observable<validatorType[]> {
    return combineLatest([this.validatorsWithShare$, activeEnabled]).pipe(
      map(([validatorWithShare, isActive]) =>
        validatorWithShare
          .map((validatorWithShare, index) => {
            const val = validatorWithShare.val;
            const share = validatorWithShare.share;
            const rank = index + 1;
            const statusBonded = validatorWithShare.val.status === 'BOND_STATUS_BONDED';
            const inList = isActive ? statusBonded && rank <= 50 : statusBonded && rank > 50;
            return { val, share, inList, rank };
          })
          .filter((validator) => validator.inList),
      ),
    );
  }

  get currentStoredWallet$(): Observable<StoredWallet | null | undefined> {
    return this.walletService.currentStoredWallet$;
  }

  get delegations$(): Observable<InlineResponse20038DelegationResponses[] | undefined> {
    return this.delegationsInService$;
  }
  get delegatedValidators$(): Observable<
    (InlineResponse20041Validators | undefined)[] | undefined
  > {
    return this.delegatedValidatorsInService$;
  }
  get filteredUnbondingDelegations$(): Observable<(InlineResponse20047 | undefined)[]> {
    return this.unbondingDelegations$.pipe(
      map((unbondingDelegations) =>
        unbondingDelegations.filter((unbondingDelegation) => unbondingDelegation),
      ),
    );
  }
}
