import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { cosmosclient, proto, rest } from '@cosmos-client/core';
import {
  InlineResponse20038,
  InlineResponse20041Validators,
} from '@cosmos-client/core/esm/openapi/api';
import { CosmosSDKService } from 'projects/portal/src/app/models';
import { ConfigService } from 'projects/portal/src/app/models/config.service';
import { StakingApplicationService } from 'projects/portal/src/app/models/cosmos/staking.application.service';
import { StoredWallet } from 'projects/portal/src/app/models/wallets/wallet.model';
import { WalletService } from 'projects/portal/src/app/models/wallets/wallet.service';
import { InactiveValidatorConfirmDialogComponent } from 'projects/portal/src/app/views/dialogs/delegate/invalid-validator-confirm-dialog/inactive-validator-confirm-dialog.component';
import { RedelegateOnSubmitEvent } from 'projects/portal/src/app/views/dialogs/delegate/redelegate-form-dialog/redelegate-form-dialog.component';
import { combineLatest, Observable } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-redelegate-form-dialog',
  templateUrl: './redelegate-form-dialog.component.html',
  styleUrls: ['./redelegate-form-dialog.component.css'],
})
export class RedelegateFormDialogComponent implements OnInit {
  validatorsList$: Observable<InlineResponse20041Validators[] | undefined>;
  currentStoredWallet$: Observable<StoredWallet | null | undefined>;
  delegations$: Observable<InlineResponse20038>;
  delegateAmount$: Observable<proto.cosmos.base.v1beta1.ICoin | undefined>;
  coins$: Observable<proto.cosmos.base.v1beta1.ICoin[] | undefined>;
  uguuBalance$: Observable<string> | undefined;
  minimumGasPrices$: Observable<proto.cosmos.base.v1beta1.ICoin[] | undefined>;
  validator: InlineResponse20041Validators | undefined;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public readonly data: InlineResponse20041Validators,
    public matDialogRef: MatDialogRef<RedelegateFormDialogComponent>,
    private readonly cosmosSDK: CosmosSDKService,
    private readonly walletService: WalletService,
    private readonly configS: ConfigService,
    private readonly stakingAppService: StakingApplicationService,
    private readonly snackBar: MatSnackBar,
    private readonly dialog: MatDialog,
  ) {
    this.validator = data;
    this.validatorsList$ = this.cosmosSDK.sdk$.pipe(
      mergeMap((sdk) => rest.staking.validators(sdk.rest)),
      map((result) => result.data.validators),
    );
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
              response.delegation?.validator_address == this.validator?.operator_address,
          )?.balance,
      ),
    );

    this.coins$ = combineLatest([this.cosmosSDK.sdk$, address$]).pipe(
      mergeMap(([sdk, address]) => rest.bank.allBalances(sdk.rest, address)),
      map((result) => result.data.balances),
    );
    this.uguuBalance$ = this.coins$.pipe(
      map((coins) => {
        const balance = coins?.find((coin) => coin.denom == 'uguu');
        return balance ? balance.amount! : '0';
      }),
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
        .open(InactiveValidatorConfirmDialogComponent, {
          data: { valAddress: $event.destinationValidator, isConfirmed: false },
        })
        .afterClosed()
        .toPromise();

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
    this.matDialogRef.close(txHash);
  }
}
