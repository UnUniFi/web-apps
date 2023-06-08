import { Dialog, DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import cosmosclient from '@cosmos-client/core';
import {
  DelegatorDelegations200Response,
  StakingDelegatorValidators200ResponseValidatorsInner,
} from '@cosmos-client/core/esm/openapi/api';
import { ConfigService } from 'projects/portal/src/app/models/config.service';
import { CosmosRestService } from 'projects/portal/src/app/models/cosmos-rest.service';
import { StakingApplicationService } from 'projects/portal/src/app/models/cosmos/staking.application.service';
import { StoredWallet } from 'projects/portal/src/app/models/wallets/wallet.model';
import { WalletService } from 'projects/portal/src/app/models/wallets/wallet.service';
import {
  InactiveValidatorConfirmDialogData,
  InactiveValidatorConfirmDialogComponent,
} from 'projects/portal/src/app/views/dialogs/delegate/invalid-validator-confirm-dialog/inactive-validator-confirm-dialog.component';
import { RedelegateOnSubmitEvent } from 'projects/portal/src/app/views/dialogs/delegate/redelegate-form-dialog/redelegate-form-dialog.component';
import { Observable, combineLatest } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-redelegate-form-dialog',
  templateUrl: './redelegate-form-dialog.component.html',
  styleUrls: ['./redelegate-form-dialog.component.css'],
})
export class RedelegateFormDialogComponent implements OnInit {
  validatorsList$: Observable<StakingDelegatorValidators200ResponseValidatorsInner[] | undefined>;
  currentStoredWallet$: Observable<StoredWallet | null | undefined>;
  delegations$: Observable<DelegatorDelegations200Response>;
  delegateCoin$: Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin | undefined>;
  denom$: Observable<string | null | undefined>;
  balance$: Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin | undefined>;
  minimumGasPrices$: Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin[] | undefined>;
  validator: StakingDelegatorValidators200ResponseValidatorsInner | undefined;

  constructor(
    @Inject(DIALOG_DATA)
    public readonly data: StakingDelegatorValidators200ResponseValidatorsInner,
    public dialogRef: DialogRef<string, RedelegateFormDialogComponent>,
    private readonly walletService: WalletService,
    private readonly configS: ConfigService,
    private readonly stakingAppService: StakingApplicationService,
    private readonly snackBar: MatSnackBar,
    private readonly dialog: Dialog,
    private readonly cosmosRest: CosmosRestService,
  ) {
    this.validator = data;
    this.validatorsList$ = this.cosmosRest.getValidators$();
    this.currentStoredWallet$ = this.walletService.currentStoredWallet$;
    const address$ = this.currentStoredWallet$.pipe(
      filter((wallet): wallet is StoredWallet => wallet !== undefined && wallet !== null),
      map((wallet) => cosmosclient.AccAddress.fromString(wallet.address)),
    );

    this.delegations$ = address$.pipe(
      mergeMap((address) => this.cosmosRest.getDelegatorDelegations$(address)),
    );
    this.delegateCoin$ = this.delegations$.pipe(
      map(
        (delegations) =>
          delegations.delegation_responses?.find(
            (response) =>
              response.delegation?.validator_address == this.validator?.operator_address,
          )?.balance,
      ),
    );
    const coins$ = address$.pipe(mergeMap((address) => this.cosmosRest.getAllBalances$(address)));
    this.denom$ = this.delegateCoin$.pipe(map((coin) => coin?.denom));
    this.balance$ = combineLatest([coins$, this.denom$]).pipe(
      map(([coins, denom]) => coins?.find((coin) => coin.denom === denom)),
    );

    this.minimumGasPrices$ = this.configS.config$.pipe(map((config) => config?.minimumGasPrices));
  }

  ngOnInit(): void {}

  async onSubmit($event: RedelegateOnSubmitEvent) {
    const validatorStatus = $event.validatorList.find(
      (val) => val.operator_address == $event.destinationValidator,
    )?.status;
    if (validatorStatus != 'BOND_STATUS_BONDED') {
      const inactiveValidatorResult = await this.dialog
        .open<InactiveValidatorConfirmDialogData>(InactiveValidatorConfirmDialogComponent, {
          data: { valAddress: $event.destinationValidator, isConfirmed: false },
        })
        .closed.toPromise();

      if (inactiveValidatorResult === undefined || inactiveValidatorResult.isConfirmed === false) {
        this.snackBar.open('Delegate was canceled', undefined, { duration: 6000 });
        return;
      }
    }

    const txHash = await this.stakingAppService.Redelegate(
      this.validator?.operator_address!,
      $event.destinationValidator,
      $event.amount,
      $event.minimumGasPrice,
      $event.gasRatio,
    );
    this.dialogRef.close(txHash);
  }
}
