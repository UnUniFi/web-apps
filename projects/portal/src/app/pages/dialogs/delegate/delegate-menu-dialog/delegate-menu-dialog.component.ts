import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import cosmosclient from '@cosmos-client/core';
import {
  CosmosDistributionV1beta1QueryDelegationTotalRewardsResponse,
  DelegatorDelegations200Response,
  StakingDelegatorValidators200ResponseValidatorsInner,
  QueryValidatorCommissionResponseIsTheResponseTypeForTheQueryValidatorCommissionRPCMethod,
  DelegatorDelegations200ResponseDelegationResponsesInnerDelegation,
} from '@cosmos-client/core/esm/openapi/api';
import { CosmosRestService } from 'projects/portal/src/app/models/cosmos-rest.service';
import { DistributionApplicationService } from 'projects/portal/src/app/models/cosmos/distribution.application.service';
import { StakingApplicationService } from 'projects/portal/src/app/models/cosmos/staking.application.service';
import { StoredWallet } from 'projects/portal/src/app/models/wallets/wallet.model';
import { WalletService } from 'projects/portal/src/app/models/wallets/wallet.service';
import { combineLatest, Observable, of } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-delegate-menu-dialog',
  templateUrl: './delegate-menu-dialog.component.html',
  styleUrls: ['./delegate-menu-dialog.component.css'],
})
export class DelegateMenuDialogComponent implements OnInit {
  selectedValidator: StakingDelegatorValidators200ResponseValidatorsInner | undefined;
  currentStoredWallet$: Observable<StoredWallet | null | undefined>;
  delegations$: Observable<DelegatorDelegations200Response>;
  delegation$: Observable<
    DelegatorDelegations200ResponseDelegationResponsesInnerDelegation | null | undefined
  >;
  delegateAmount$: Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin | undefined>;
  isDelegated$: Observable<boolean | undefined> | undefined;
  totalRewards$: Observable<
    CosmosDistributionV1beta1QueryDelegationTotalRewardsResponse | undefined
  >;
  commission$: Observable<
    | QueryValidatorCommissionResponseIsTheResponseTypeForTheQueryValidatorCommissionRPCMethod
    | undefined
  >;
  isValidator$: Observable<boolean | undefined> | undefined;

  constructor(
    @Inject(DIALOG_DATA)
    public readonly data: StakingDelegatorValidators200ResponseValidatorsInner,
    private router: Router,
    public dialogRef: DialogRef<DelegateMenuDialogComponent>,
    private readonly stakingAppService: StakingApplicationService,
    private readonly distributionAppService: DistributionApplicationService,
    private readonly walletService: WalletService,
    private readonly snackBar: MatSnackBar,
    private readonly cosmosRest: CosmosRestService,
  ) {
    this.selectedValidator = data;
    this.currentStoredWallet$ = this.walletService.currentStoredWallet$;
    const address$ = this.currentStoredWallet$.pipe(
      filter((wallet): wallet is StoredWallet => wallet !== undefined && wallet !== null),
      map((wallet) => cosmosclient.AccAddress.fromString(wallet.address)),
    );
    this.delegations$ = address$.pipe(
      mergeMap((address) => this.cosmosRest.getDelegatorDelegations$(address)),
    );
    this.delegateAmount$ = this.delegations$.pipe(
      map(
        (delegations) =>
          delegations.delegation_responses?.find(
            (response) =>
              response.delegation?.validator_address == this.selectedValidator?.operator_address,
          )?.balance,
      ),
    );
    this.isDelegated$ = this.delegations$.pipe(
      map((delegations) =>
        delegations.delegation_responses?.some(
          (response) =>
            response.delegation?.validator_address == this.selectedValidator?.operator_address,
        ),
      ),
    );
    this.delegation$ = this.delegations$.pipe(
      map(
        (delegations) =>
          delegations.delegation_responses?.find(
            (response) =>
              response.delegation?.validator_address == this.selectedValidator?.operator_address,
          )?.delegation,
      ),
    );
    const accAddress$ = this.delegation$.pipe(
      map((delegation) => {
        try {
          if (delegation?.delegator_address === undefined) {
            return undefined;
          }
          const accAddress = cosmosclient.AccAddress.fromString(delegation?.delegator_address);
          return accAddress;
        } catch (error) {
          console.error(error);
          this.snackBar.open('Invalid address!', undefined, { duration: 6000 });
          return undefined;
        }
      }),
    );
    const valAddress$ = accAddress$.pipe(
      map((address) => {
        if (address === undefined) {
          return undefined;
        }
        return address.toValAddress();
      }),
    );
    const combined$ = combineLatest([accAddress$, valAddress$]);
    this.totalRewards$ = accAddress$.pipe(
      mergeMap((accAddress) => {
        if (accAddress === undefined) {
          return of(undefined);
        }
        return this.cosmosRest.getDelegationTotalRewards$(accAddress);
      }),
    );
    this.commission$ = combined$.pipe(
      mergeMap(([accAddress, valAddress]) => {
        if (accAddress === undefined || valAddress === undefined) {
          return of(undefined);
        }
        return this.cosmosRest.getValidatorCommission$(valAddress);
      }),
    );
    this.isValidator$ = valAddress$.pipe(
      map((valAddress) => {
        if (valAddress === undefined) {
          return undefined;
        }
        return valAddress.toString() == this.selectedValidator?.operator_address;
      }),
    );
  }

  ngOnInit() {}

  onSubmitDelegate(validator: StakingDelegatorValidators200ResponseValidatorsInner) {
    this.dialogRef.close();
    this.stakingAppService.openDelegateFormDialog(validator);
  }

  onSubmitRedelegate(validator: StakingDelegatorValidators200ResponseValidatorsInner) {
    this.dialogRef.close();
    this.stakingAppService.openRedelegateFormDialog(validator);
  }

  onSubmitUndelegate(validator: StakingDelegatorValidators200ResponseValidatorsInner) {
    this.dialogRef.close();
    this.stakingAppService.openUndelegateFormDialog(validator);
  }

  onSubmitWithdrawDelegatorReward(validator: StakingDelegatorValidators200ResponseValidatorsInner) {
    this.dialogRef.close();
    this.distributionAppService.openWithdrawDelegatorRewardFormDialog(validator);
  }

  onSubmitWithdrawValidatorCommission(
    validator: StakingDelegatorValidators200ResponseValidatorsInner,
  ) {
    this.dialogRef.close();
    this.distributionAppService.openWithdrawValidatorCommissionFormDialog(validator);
  }

  onSubmitDetail(validator: StakingDelegatorValidators200ResponseValidatorsInner) {
    this.dialogRef.close();
    this.router.navigate(['utilities', 'delegate', 'validators', validator.operator_address]);
  }
}
