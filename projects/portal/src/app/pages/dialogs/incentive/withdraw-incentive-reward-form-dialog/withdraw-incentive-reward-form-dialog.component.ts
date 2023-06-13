import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import { ConfigService } from 'projects/portal/src/app/models/config.service';
import { IncentiveApplicationService } from 'projects/portal/src/app/models/incentives/incentive.application.service';
import { IncentiveQueryService } from 'projects/portal/src/app/models/incentives/incentive.query.service';
import { StoredWallet } from 'projects/portal/src/app/models/wallets/wallet.model';
import { WalletService } from 'projects/portal/src/app/models/wallets/wallet.service';
import { WithdrawRewardOnSubmitEvent } from 'projects/portal/src/app/views/dialogs/incentive/withdraw-incentive-reward-form-dialog/withdraw-incentive-reward-form-dialog.component';
import { Observable } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-withdraw-incentive-reward-form-dialog',
  templateUrl: './withdraw-incentive-reward-form-dialog.component.html',
  styleUrls: ['./withdraw-incentive-reward-form-dialog.component.css'],
})
export class WithdrawIncentiveRewardFormDialogComponent implements OnInit {
  denom: string;
  currentStoredWallet$: Observable<StoredWallet | null | undefined>;
  minimumGasPrices$: Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin[] | undefined>;
  reward$: Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin>;

  constructor(
    @Inject(DIALOG_DATA)
    public readonly data: string,
    public dialogRef: DialogRef<string, WithdrawIncentiveRewardFormDialogComponent>,
    private readonly walletService: WalletService,
    private readonly configS: ConfigService,
    private readonly incentiveApp: IncentiveApplicationService,
    private incentiveQuery: IncentiveQueryService,
  ) {
    this.denom = data;
    this.currentStoredWallet$ = this.walletService.currentStoredWallet$;
    const address$ = this.currentStoredWallet$.pipe(
      filter((wallet): wallet is StoredWallet => wallet !== undefined && wallet !== null),
      map((wallet) => cosmosclient.AccAddress.fromString(wallet.address)),
    );

    this.reward$ = address$.pipe(
      mergeMap((address) => this.incentiveQuery.getReward$(address.toString(), this.denom)),
    );
    this.minimumGasPrices$ = this.configS.config$.pipe(map((config) => config?.minimumGasPrices));
  }

  ngOnInit(): void {}

  async onSubmit($event: WithdrawRewardOnSubmitEvent) {
    let txHash: string | undefined;
    txHash = await this.incentiveApp.withdrawReward(
      $event.denom,
      $event.minimumGasPrice,
      $event.gasRatio,
    );
    this.dialogRef.close(txHash);
  }
}
