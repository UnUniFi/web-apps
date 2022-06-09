import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { cosmosclient, proto, rest } from '@cosmos-client/core';
import {
  InlineResponse20063,
  InlineResponse20066Validators,
  CosmosDistributionV1beta1QueryDelegationTotalRewardsResponse,
  InlineResponse20063Delegation,
  QueryValidatorCommissionResponseIsTheResponseTypeForTheQueryValidatorCommissionRPCMethod,
} from '@cosmos-client/core/esm/openapi/api';
import { CosmosSDKService } from 'projects/portal/src/app/models';
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
  selectedValidator: InlineResponse20066Validators | undefined;
  currentStoredWallet$: Observable<StoredWallet | null | undefined>;
  delegations$: Observable<InlineResponse20063>;
  delegation$: Observable<InlineResponse20063Delegation | null | undefined>;
  delegateAmount$: Observable<proto.cosmos.base.v1beta1.ICoin | undefined>;
  isDelegated$: Observable<boolean | undefined> | undefined;
  totalRewards$: Observable<
    CosmosDistributionV1beta1QueryDelegationTotalRewardsResponse | undefined
  >;
  commission$: Observable<
    | QueryValidatorCommissionResponseIsTheResponseTypeForTheQueryValidatorCommissionRPCMethod
    | undefined
  >;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public readonly data: InlineResponse20066Validators,
    private router: Router,
    public matDialogRef: MatDialogRef<DelegateMenuDialogComponent>,
    private readonly stakingAppService: StakingApplicationService,
    private readonly distributionAppService: DistributionApplicationService,
    private readonly walletService: WalletService,
    private readonly cosmosSDK: CosmosSDKService,
    private readonly snackBar: MatSnackBar,
  ) {
    this.selectedValidator = data;
    this.currentStoredWallet$ = this.walletService.currentStoredWallet$;
    const address$ = this.currentStoredWallet$.pipe(
      filter((wallet): wallet is StoredWallet => wallet !== undefined && wallet !== null),
      map((wallet) => cosmosclient.AccAddress.fromString(wallet.address)),
    );
    this.delegations$ = combineLatest([this.cosmosSDK.sdk$, address$]).pipe(
      mergeMap(([sdk, address]) => rest.staking.delegatorDelegations(sdk.rest, address)),
      map((res) => res.data),
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
    const combined$ = combineLatest([this.cosmosSDK.sdk$, accAddress$, valAddress$]);
    this.totalRewards$ = combined$.pipe(
      mergeMap(([sdk, accAddress]) => {
        if (accAddress === undefined) {
          return of(undefined);
        }
        return rest.distribution
          .delegationTotalRewards(sdk.rest, accAddress)
          .then((res) => res.data);
      }),
    );
    this.commission$ = combined$.pipe(
      mergeMap(([sdk, accAddress, valAddress]) => {
        if (accAddress === undefined || valAddress === undefined) {
          return of(undefined);
        }
        return rest.distribution.validatorCommission(sdk.rest, valAddress).then((res) => res.data);
      }),
    );
  }

  ngOnInit() {}

  onSubmitDelegate(validator: InlineResponse20066Validators) {
    this.matDialogRef.close();
    this.stakingAppService.openDelegateFormDialog(validator);
  }

  onSubmitRedelegate(validator: InlineResponse20066Validators) {
    this.matDialogRef.close();
    this.stakingAppService.openRedelegateFormDialog(validator);
  }

  onSubmitUndelegate(validator: InlineResponse20066Validators) {
    this.matDialogRef.close();
    this.stakingAppService.openUndelegateFormDialog(validator);
  }

  onSubmitWithdrawDelegatorReward(validator: InlineResponse20066Validators) {
    this.matDialogRef.close();
    this.distributionAppService.openWithdrawDelegatorRewardFormDialog(validator);
  }

  onSubmitWithdrawValidatorCommission(validator: InlineResponse20066Validators) {
    this.matDialogRef.close();
    this.distributionAppService.openWithdrawValidatorCommissionFormDialog(validator);
  }

  onSubmitDetail(validator: InlineResponse20066Validators) {
    this.matDialogRef.close();
    this.router.navigate(['delegate', 'validators', validator.operator_address]);
  }
}
