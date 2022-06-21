import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { proto } from '@cosmos-client/core';
import { InlineResponse20014Validators } from '@cosmos-client/core/esm/openapi/api';
import { CosmosSDKService } from 'projects/portal/src/app/models';
import { ConfigService } from 'projects/portal/src/app/models/config.service';
import { DistributionApplicationService } from 'projects/portal/src/app/models/cosmos/distribution.application.service';
import { StoredWallet } from 'projects/portal/src/app/models/wallets/wallet.model';
import { WalletService } from 'projects/portal/src/app/models/wallets/wallet.service';
import { WithdrawValidatorCommissionOnSubmitEvent } from 'projects/portal/src/app/views/dialogs/delegate/withdraw-validator-commission-form-dialog/withdraw-validator-commission-form-dialog.component';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-withdraw-validator-commission-form-dialog',
  templateUrl: './withdraw-validator-commission-form-dialog.component.html',
  styleUrls: ['./withdraw-validator-commission-form-dialog.component.css'],
})
export class WithdrawValidatorCommissionFormDialogComponent implements OnInit {
  currentStoredWallet$: Observable<StoredWallet | null | undefined>;
  minimumGasPrices$: Observable<proto.cosmos.base.v1beta1.ICoin[] | undefined>;
  validator: InlineResponse20014Validators | undefined;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public readonly data: InlineResponse20014Validators,
    public matDialogRef: MatDialogRef<WithdrawValidatorCommissionFormDialogComponent>,
    private readonly cosmosSDK: CosmosSDKService,
    private readonly walletService: WalletService,
    private readonly configS: ConfigService,
    private readonly distributionAppService: DistributionApplicationService,
  ) {
    this.validator = data;
    this.currentStoredWallet$ = this.walletService.currentStoredWallet$;
    this.minimumGasPrices$ = this.configS.config$.pipe(map((config) => config?.minimumGasPrices));
  }

  ngOnInit(): void {}

  async onSubmit($event: WithdrawValidatorCommissionOnSubmitEvent) {
    const txHash = await this.distributionAppService.withdrawValidatorCommission(
      this.validator?.address!,
      $event.minimumGasPrice,
      $event.gasRatio,
    );
    this.matDialogRef.close(txHash);
  }
}
