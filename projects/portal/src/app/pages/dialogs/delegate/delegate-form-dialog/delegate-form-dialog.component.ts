import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import cosmosclient from '@cosmos-client/core';
import { InlineResponse20041Validators } from '@cosmos-client/core/esm/openapi/api';
import { ConfigService } from 'projects/portal/src/app/models/config.service';
import { CosmosRestService } from 'projects/portal/src/app/models/cosmos-rest.service';
import { StakingApplicationService } from 'projects/portal/src/app/models/cosmos/staking.application.service';
import { StoredWallet } from 'projects/portal/src/app/models/wallets/wallet.model';
import { WalletService } from 'projects/portal/src/app/models/wallets/wallet.service';
import { DelegateOnSubmitEvent } from 'projects/portal/src/app/views/dialogs/delegate/delegate-form-dialog/delegate-form-dialog.component';
import { InactiveValidatorConfirmDialogComponent } from 'projects/portal/src/app/views/dialogs/delegate/invalid-validator-confirm-dialog/inactive-validator-confirm-dialog.component';
import { Observable } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-delegate-form-dialog',
  templateUrl: './delegate-form-dialog.component.html',
  styleUrls: ['./delegate-form-dialog.component.css'],
})
export class DelegateFormDialogComponent implements OnInit {
  currentStoredWallet$: Observable<StoredWallet | null | undefined>;
  coins$: Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin[] | undefined>;
  uguuBalance$: Observable<string> | undefined;
  minimumGasPrices$: Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin[] | undefined>;
  validatorsList$: Observable<InlineResponse20041Validators[] | undefined>;
  validator: InlineResponse20041Validators | undefined;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public readonly data: InlineResponse20041Validators,
    public matDialogRef: MatDialogRef<DelegateFormDialogComponent>,
    private readonly walletService: WalletService,
    private readonly configS: ConfigService,
    private readonly stakingAppService: StakingApplicationService,
    private readonly snackBar: MatSnackBar,
    private readonly dialog: MatDialog,
    private readonly cosmosRest: CosmosRestService,
  ) {
    this.validator = data;
    this.validatorsList$ = this.cosmosRest.getValidators$();
    this.currentStoredWallet$ = this.walletService.currentStoredWallet$;
    const address$ = this.currentStoredWallet$.pipe(
      filter((wallet): wallet is StoredWallet => wallet !== undefined && wallet !== null),
      map((wallet) => cosmosclient.AccAddress.fromString(wallet.address)),
    );
    this.coins$ = address$.pipe(mergeMap((address) => this.cosmosRest.getAllBalances$(address)));
    this.uguuBalance$ = this.coins$.pipe(
      map((coins) => {
        const balance = coins?.find((coin) => coin.denom == 'uguu');
        return balance ? balance.amount! : '0';
      }),
    );

    this.minimumGasPrices$ = this.configS.config$.pipe(map((config) => config?.minimumGasPrices));
  }

  ngOnInit(): void {}

  async onSubmit($event: DelegateOnSubmitEvent) {
    const validatorStatus = $event.validatorList.find(
      (val) => val.operator_address == this.validator?.operator_address,
    )?.status;
    if (validatorStatus != 'BOND_STATUS_BONDED') {
      const inactiveValidatorResult = await this.dialog
        .open(InactiveValidatorConfirmDialogComponent, {
          data: { valAddress: this.validator?.operator_address!, isConfirmed: false },
        })
        .afterClosed()
        .toPromise();

      if (inactiveValidatorResult === undefined || inactiveValidatorResult.isConfirmed === false) {
        this.snackBar.open('Delegate was canceled', undefined, { duration: 6000 });
        return;
      }
    }
    let txHash: string | undefined;

    txHash = await this.stakingAppService.createDelegate(
      this.validator?.operator_address!,
      $event.amount,
      $event.minimumGasPrice,
      $event.gasRatio,
    );

    this.matDialogRef.close(txHash);
  }
}
