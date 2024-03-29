import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import { StakingDelegatorValidators200ResponseValidatorsInner } from '@cosmos-client/core/esm/openapi/api';
import { ConfigService } from 'projects/portal/src/app/models/config.service';
import { DistributionApplicationService } from 'projects/portal/src/app/models/cosmos/distribution.application.service';
import { StoredWallet } from 'projects/portal/src/app/models/wallets/wallet.model';
import { WalletService } from 'projects/portal/src/app/models/wallets/wallet.service';
import { WithdrawDelegatorRewardOnSubmitEvent } from 'projects/portal/src/app/views/dialogs/delegate/withdraw-delegator-reward-form-dialog/withdraw-delegator-reward-form-dialog.component';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-withdraw-delegator-reward-form-dialog',
  templateUrl: './withdraw-delegator-reward-form-dialog.component.html',
  styleUrls: ['./withdraw-delegator-reward-form-dialog.component.css'],
})
export class WithdrawDelegatorRewardFormDialogComponent implements OnInit {
  currentStoredWallet$: Observable<StoredWallet | null | undefined>;
  minimumGasPrices$: Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin[] | undefined>;
  validator: StakingDelegatorValidators200ResponseValidatorsInner | undefined;

  constructor(
    @Inject(DIALOG_DATA)
    public readonly data: StakingDelegatorValidators200ResponseValidatorsInner,
    public dialogRef: DialogRef<string, WithdrawDelegatorRewardFormDialogComponent>,
    private readonly walletService: WalletService,
    private readonly configS: ConfigService,
    private readonly distributionAppService: DistributionApplicationService,
  ) {
    this.validator = data;
    this.currentStoredWallet$ = this.walletService.currentStoredWallet$;
    this.minimumGasPrices$ = this.configS.config$.pipe(map((config) => config?.minimumGasPrices));
  }

  ngOnInit(): void {}

  async onSubmit($event: WithdrawDelegatorRewardOnSubmitEvent) {
    const txHash = await this.distributionAppService.withdrawDelegatorReward(
      this.validator?.operator_address!,
      $event.minimumGasPrice,
      $event.gasRatio,
    );
    this.dialogRef.close(txHash);
  }
}
