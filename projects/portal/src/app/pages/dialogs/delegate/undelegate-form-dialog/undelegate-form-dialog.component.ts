import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import {
  DelegatorDelegations200Response,
  StakingDelegatorValidators200ResponseValidatorsInner,
  UnbondingDelegation200Response,
} from '@cosmos-client/core/esm/openapi/api';
import { ConfigService } from 'projects/portal/src/app/models/config.service';
import { CosmosRestService } from 'projects/portal/src/app/models/cosmos-rest.service';
import { StakingApplicationService } from 'projects/portal/src/app/models/cosmos/staking.application.service';
import { StoredWallet } from 'projects/portal/src/app/models/wallets/wallet.model';
import { WalletService } from 'projects/portal/src/app/models/wallets/wallet.service';
import { UndelegateOnSubmitEvent } from 'projects/portal/src/app/views/dialogs/delegate/undelegate-form-dialog/undelegate-form-dialog.component';
import { Observable, combineLatest, of } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-undelegate-form-dialog',
  templateUrl: './undelegate-form-dialog.component.html',
  styleUrls: ['./undelegate-form-dialog.component.css'],
})
export class UndelegateFormDialogComponent implements OnInit {
  currentStoredWallet$: Observable<StoredWallet | null | undefined>;
  delegations$: Observable<DelegatorDelegations200Response>;
  delegateCoin$: Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin | undefined>;
  denom$: Observable<string | null | undefined>;
  balance$: Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin | undefined>;
  minimumGasPrices$: Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin[] | undefined>;
  validator: StakingDelegatorValidators200ResponseValidatorsInner | undefined;
  unbondingDelegation$: Observable<UnbondingDelegation200Response | undefined>;

  constructor(
    @Inject(DIALOG_DATA)
    public readonly data: StakingDelegatorValidators200ResponseValidatorsInner,
    public dialogRef: DialogRef<string, UndelegateFormDialogComponent>,
    private readonly walletService: WalletService,
    private readonly configS: ConfigService,
    private readonly stakingAppService: StakingApplicationService,
    private readonly cosmosRest: CosmosRestService,
  ) {
    this.validator = data;
    this.currentStoredWallet$ = this.walletService.currentStoredWallet$;
    const address$ = this.currentStoredWallet$.pipe(
      filter((wallet): wallet is StoredWallet => wallet !== undefined && wallet !== null),
      map((wallet) => cosmosclient.AccAddress.fromString(wallet.address)),
    );
    this.delegations$ = address$.pipe(
      mergeMap((address) => this.cosmosRest.getDelegatorDelegations$(address)),
    );

    this.unbondingDelegation$ = address$.pipe(
      mergeMap((address) => {
        const valAddressString = this.validator?.operator_address;
        if (!valAddressString) {
          return of(undefined);
        }
        const valAddress = cosmosclient.ValAddress.fromString(valAddressString);
        return this.cosmosRest.getUnbondingDelegation$(valAddress, address);
      }),
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
    const coins$ = address$.pipe(
      mergeMap((address) => this.cosmosRest.getAllBalances$(address.toString())),
    );
    this.denom$ = this.delegateCoin$.pipe(map((coin) => coin?.denom));
    this.balance$ = combineLatest([coins$, this.denom$]).pipe(
      map(([coins, denom]) => coins?.find((coin) => coin.denom === denom)),
    );

    this.minimumGasPrices$ = this.configS.config$.pipe(map((config) => config?.minimumGasPrices));
  }

  ngOnInit(): void {}

  async onSubmit($event: UndelegateOnSubmitEvent) {
    const txHash = await this.stakingAppService.undelegate(
      this.validator?.operator_address!,
      $event.amount,
      $event.minimumGasPrice,
      $event.gasRatio,
    );
    this.dialogRef.close(txHash);
  }
}
