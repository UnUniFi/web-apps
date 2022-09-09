import { CosmosRestService } from '../../../models/cosmos-rest.service';
import { StoredWallet } from '../../../models/wallets/wallet.model';
import { WalletService } from '../../../models/wallets/wallet.service';
import { validatorType } from '../../../views/delegate/validators/validators.component';
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
  constructor(
    private readonly walletService: WalletService,
    private readonly cosmosRest: CosmosRestService,
  ) {}
  get currentStoredWallet$(): Observable<StoredWallet | null | undefined> {
    return this.walletService.currentStoredWallet$;
  }
  get validatorsList$(): Observable<InlineResponse20041Validators[] | undefined> {
    return this.cosmosRest.getValidators$();
  }
  get accAddress$(): Observable<cosmosclient.AccAddress> {
    return this.walletService.currentStoredWallet$.pipe(
      filter((wallet): wallet is StoredWallet => wallet !== undefined && wallet !== null),
      map((wallet) => cosmosclient.AccAddress.fromString(wallet.address)),
    );
  }
  validators$(
    validatorsList$: Observable<InlineResponse20041Validators[] | undefined>,
    activeEnabled: BehaviorSubject<boolean>,
  ): Observable<validatorType[]> {
    const allValidatorsTokens$ = validatorsList$.pipe(
      map((validators) =>
        validators?.reduce((sum, validator) => {
          return sum + Number(validator.tokens);
        }, 0),
      ),
    );
    return combineLatest([allValidatorsTokens$, validatorsList$, activeEnabled]).pipe(
      map(([allTokens, validators, isActive]) => {
        if (!allTokens || !validators) {
          return [];
        }
        // calculate validator share
        const validatorsWithShare = validators.map((validator) => {
          const val = validator;
          const share = Number(validator.tokens) / allTokens;
          return { val, share };
        });
        // sort by share
        const validatorsWithSort = validatorsWithShare.sort((x, y) => y.share - x.share);

        return validatorsWithSort
          .map((validatorWithShare, index) => {
            const val = validatorWithShare.val;
            const share = validatorWithShare.share;
            const rank = index + 1;
            const statusBonded = validatorWithShare.val.status === 'BOND_STATUS_BONDED';
            const inList = isActive ? statusBonded && rank <= 50 : statusBonded && rank > 50;
            return { val, share, inList, rank };
          })
          .filter((validator) => validator.inList);
      }),
    );
  }
  delegations$(
    accAddress$: Observable<cosmosclient.AccAddress>,
  ): Observable<InlineResponse20038DelegationResponses[] | undefined> {
    return accAddress$.pipe(
      mergeMap((address) => this.cosmosRest.getDelegatorDelegations$(address)),
      map((result) => (result?.delegation_responses ? result.delegation_responses : undefined)),
    );
  }
  delegatedValidators$(
    validatorsList$: Observable<InlineResponse20041Validators[] | undefined>,
    delegations$: Observable<InlineResponse20038DelegationResponses[] | undefined>,
  ): Observable<(InlineResponse20041Validators | undefined)[] | undefined> {
    return combineLatest([validatorsList$, delegations$]).pipe(
      map(([validators, delegations]) =>
        delegations?.map((delegation) =>
          validators?.find(
            (validator) => validator.operator_address == delegation.delegation?.validator_address,
          ),
        ),
      ),
    );
  }
  unbondingDelegations$(
    delegatedValidators$: Observable<(InlineResponse20041Validators | undefined)[] | undefined>,
    accAddress$: Observable<cosmosclient.AccAddress>,
  ): Observable<(InlineResponse20047 | undefined)[]> {
    return delegatedValidators$.pipe(
      withLatestFrom(accAddress$),
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
      map((unbondingDelegations) =>
        unbondingDelegations.filter((unbondingDelegation) => unbondingDelegation),
      ),
    );
  }
}
