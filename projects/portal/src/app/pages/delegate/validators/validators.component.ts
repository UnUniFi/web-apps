import { CosmosSDKService } from '../../../models/cosmos-sdk.service';
import { StakingApplicationService } from '../../../models/cosmos/staking.application.service';
import { StoredWallet } from '../../../models/wallets/wallet.model';
import { WalletService } from '../../../models/wallets/wallet.service';
import {
  validatorType,
  validatorWithShareType,
} from '../../../views/delegate/validators/validators.component';
import { Component, OnInit } from '@angular/core';
import { cosmosclient, rest } from '@cosmos-client/core';
import {
  InlineResponse20038DelegationResponses,
  InlineResponse20041Validators,
  InlineResponse20047,
} from '@cosmos-client/core/esm/openapi';
import { of, Observable, BehaviorSubject, combineLatest, zip } from 'rxjs';
import { filter, map, mergeMap, concatMap, withLatestFrom } from 'rxjs/operators';

@Component({
  selector: 'app-validators',
  templateUrl: './validators.component.html',
  styleUrls: ['./validators.component.css'],
})
export class ValidatorsComponent implements OnInit {
  validatorsList$: Observable<InlineResponse20041Validators[] | undefined>;
  allValidatorsTokens$: Observable<number | undefined>;
  validatorsWithShare$: Observable<validatorWithShareType[]>;
  validators$: Observable<validatorType[]>;
  currentStoredWallet$: Observable<StoredWallet | null | undefined>;
  delegations$: Observable<InlineResponse20038DelegationResponses[] | undefined>;
  delegatedValidators$: Observable<(InlineResponse20041Validators | undefined)[] | undefined>;
  totalDelegation$: Observable<number | undefined>;
  unbondingDelegations$: Observable<(InlineResponse20047 | undefined)[]>;
  filteredUnbondingDelegations$: Observable<(InlineResponse20047 | undefined)[]>;

  activeEnabled: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor(
    private cosmosSDK: CosmosSDKService,
    private readonly walletService: WalletService,
    private readonly stakingAppService: StakingApplicationService,
  ) {
    this.validatorsList$ = this.cosmosSDK.sdk$.pipe(
      mergeMap((sdk) => rest.staking.validators(sdk.rest)),
      map((result) => result.data.validators),
    );

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

    this.currentStoredWallet$ = this.walletService.currentStoredWallet$;
    const address$ = this.currentStoredWallet$.pipe(
      filter((wallet): wallet is StoredWallet => wallet !== undefined && wallet !== null),
      map((wallet) => cosmosclient.AccAddress.fromString(wallet.address)),
    );

    const combined$ = combineLatest([this.cosmosSDK.sdk$, address$]);
    this.delegations$ = combined$.pipe(
      mergeMap(([sdk, address]) => rest.staking.delegatorDelegations(sdk.rest, address)),
      map((result) => result.data.delegation_responses),
    );

    this.delegatedValidators$ = combineLatest([this.validatorsList$, this.delegations$]).pipe(
      map(([validators, delegations]) =>
        delegations?.map((delegation) =>
          validators?.find(
            (validator) => validator.operator_address == delegation.delegation?.validator_address,
          ),
        ),
      ),
    );

    this.totalDelegation$ = this.delegations$.pipe(
      map((delegations) =>
        delegations?.reduce(
          (sum, element) =>
            element.balance?.denom == 'uguu' ? sum + Number(element.balance?.amount) : sum,
          0,
        ),
      ),
    );

    this.unbondingDelegations$ = this.delegatedValidators$.pipe(
      withLatestFrom(this.cosmosSDK.sdk$, address$),
      concatMap(([validators, sdk, accAddress]) => {
        const valAddressList = validators?.map((validator) => {
          if (!validator?.operator_address) return undefined;
          try {
            return cosmosclient.ValAddress.fromString(validator?.operator_address);
          } catch (error) {
            console.error(error);
            return undefined;
          }
        });
        if (!valAddressList) return [];

        const unbondingDelegationList = Promise.all(
          valAddressList.map((valAddress) => {
            if (!valAddress) return undefined;
            return rest.staking
              .unbondingDelegation(sdk.rest, valAddress, accAddress)
              .then((res) => res && res.data)
              .catch((err) => {
                return undefined;
              });
          }),
        );
        return unbondingDelegationList;
      }),
    );
    this.filteredUnbondingDelegations$ = this.unbondingDelegations$.pipe(
      map((unbondingDelegations) =>
        unbondingDelegations.filter((unbondingDelegation) => unbondingDelegation),
      ),
    );
  }

  ngOnInit() {}

  onToggleChange(value: boolean) {
    this.activeEnabled.next(value);
  }

  onSelectValidator(validator: InlineResponse20041Validators) {
    this.stakingAppService.openDelegateMenuDialog(validator);
  }
}
