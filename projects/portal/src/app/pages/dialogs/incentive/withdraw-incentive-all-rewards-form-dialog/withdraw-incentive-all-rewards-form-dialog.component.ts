import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import { ConfigService } from 'projects/portal/src/app/models/config.service';
import { CosmosRestService } from 'projects/portal/src/app/models/cosmos-rest.service';
import { IncentiveApplicationService } from 'projects/portal/src/app/models/incentives/incentive.application.service';
import { IncentiveQueryService } from 'projects/portal/src/app/models/incentives/incentive.query.service';
import { StoredWallet } from 'projects/portal/src/app/models/wallets/wallet.model';
import { WalletService } from 'projects/portal/src/app/models/wallets/wallet.service';
import { WithdrawAllRewardsOnSubmitEvent } from 'projects/portal/src/app/views/dialogs/incentive/withdraw-incentive-all-rewards-form-dialog/withdraw-incentive-all-rewards-form-dialog.component';
import { Observable } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-withdraw-incentive-all-rewards-form-dialog',
  templateUrl: './withdraw-incentive-all-rewards-form-dialog.component.html',
  styleUrls: ['./withdraw-incentive-all-rewards-form-dialog.component.css'],
})
export class WithdrawIncentiveAllRewardsFormDialogComponent implements OnInit {
  address: string;
  currentStoredWallet$: Observable<StoredWallet | null | undefined>;
  minimumGasPrices$: Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin[] | undefined>;
  rewards$: Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin[]>;

  constructor(
    @Inject(DIALOG_DATA)
    public readonly data: string,
    public dialogRef: DialogRef<string, WithdrawIncentiveAllRewardsFormDialogComponent>,
    private readonly walletService: WalletService,
    private readonly configS: ConfigService,
    private readonly cosmosRest: CosmosRestService,
    private readonly incentiveApp: IncentiveApplicationService,
    private incentiveQuery: IncentiveQueryService,
  ) {
    this.address = data;
    this.currentStoredWallet$ = this.walletService.currentStoredWallet$;
    this.rewards$ = this.incentiveQuery.getAllRewards$(this.address);
    this.minimumGasPrices$ = this.configS.config$.pipe(map((config) => config?.minimumGasPrices));
  }

  ngOnInit(): void {}

  async onSubmit($event: WithdrawAllRewardsOnSubmitEvent) {
    let txHash: string | undefined;
    txHash = await this.incentiveApp.withdrawAllRewards($event.minimumGasPrice, $event.gasRatio);
    this.dialogRef.close(txHash);
  }
}
