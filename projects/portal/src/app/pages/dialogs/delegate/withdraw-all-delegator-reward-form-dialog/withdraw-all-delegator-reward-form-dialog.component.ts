import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import cosmosclient from '@cosmos-client/core';
import {
  InlineResponse20038DelegationResponses,
  InlineResponse20041Validators,
} from '@cosmos-client/core/esm/openapi/api';
import { ConfigService } from 'projects/portal/src/app/models/config.service';
import { CosmosRestService } from 'projects/portal/src/app/models/cosmos-rest.service';
import { DistributionApplicationService } from 'projects/portal/src/app/models/cosmos/distribution.application.service';
import { StoredWallet } from 'projects/portal/src/app/models/wallets/wallet.model';
import { WalletService } from 'projects/portal/src/app/models/wallets/wallet.service';
import { WithdrawAllDelegatorRewardOnSubmitEvent } from 'projects/portal/src/app/views/dialogs/delegate/withdraw-all-delegator-reward-form-dialog/withdraw-all-delegator-reward-form-dialog.component';
import { combineLatest, Observable } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-withdraw-all-delegator-reward-form-dialog',
  templateUrl: './withdraw-all-delegator-reward-form-dialog.component.html',
  styleUrls: ['./withdraw-all-delegator-reward-form-dialog.component.css'],
})
export class WithdrawAllDelegatorRewardFormDialogComponent implements OnInit {
  currentStoredWallet$: Observable<StoredWallet | null | undefined>;
  minimumGasPrices$: Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin[] | undefined>;
  validator: InlineResponse20041Validators | undefined;
  validatorsList$: Observable<InlineResponse20041Validators[] | undefined>;
  delegatedValidators$: Observable<(InlineResponse20041Validators | undefined)[] | undefined>;
  delegations$: Observable<InlineResponse20038DelegationResponses[] | undefined>;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public readonly data: InlineResponse20041Validators,
    public matDialogRef: MatDialogRef<WithdrawAllDelegatorRewardFormDialogComponent>,
    private readonly walletService: WalletService,
    private readonly configS: ConfigService,
    private cosmosRest: CosmosRestService,
    private readonly distributionAppService: DistributionApplicationService,
  ) {
    this.validator = data;
    this.currentStoredWallet$ = this.walletService.currentStoredWallet$;
    const address$ = this.currentStoredWallet$.pipe(
      filter((wallet): wallet is StoredWallet => wallet !== undefined && wallet !== null),
      map((wallet) => cosmosclient.AccAddress.fromString(wallet.address)),
    );
    this.minimumGasPrices$ = this.configS.config$.pipe(map((config) => config?.minimumGasPrices));
    this.validatorsList$ = this.cosmosRest.getValidators$();
    this.delegations$ = address$.pipe(
      mergeMap((address) => this.cosmosRest.getDelegatorDelegations$(address)),
      map((result) => result.delegation_responses),
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
  }

  ngOnInit(): void {}

  async onSubmit($event: WithdrawAllDelegatorRewardOnSubmitEvent) {
    const txHash = await this.distributionAppService.withdrawAllDelegatorReward(
      $event.validators,
      $event.minimumGasPrice,
      $event.gasRatio,
    );
    this.matDialogRef.close(txHash);
  }
}
