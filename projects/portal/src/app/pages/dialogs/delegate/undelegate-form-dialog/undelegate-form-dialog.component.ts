import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import cosmosclient from '@cosmos-client/core';
import {
  InlineResponse20038,
  InlineResponse20047,
  InlineResponse20041Validators,
} from '@cosmos-client/core/esm/openapi/api';
import { CosmosSDKService } from 'projects/portal/src/app/models';
import { ConfigService } from 'projects/portal/src/app/models/config.service';
import { StakingApplicationService } from 'projects/portal/src/app/models/cosmos/staking.application.service';
import { StoredWallet } from 'projects/portal/src/app/models/wallets/wallet.model';
import { WalletService } from 'projects/portal/src/app/models/wallets/wallet.service';
import { UndelegateOnSubmitEvent } from 'projects/portal/src/app/views/dialogs/delegate/undelegate-form-dialog/undelegate-form-dialog.component';
import { of, combineLatest, Observable } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-undelegate-form-dialog',
  templateUrl: './undelegate-form-dialog.component.html',
  styleUrls: ['./undelegate-form-dialog.component.css'],
})
export class UndelegateFormDialogComponent implements OnInit {
  currentStoredWallet$: Observable<StoredWallet | null | undefined>;
  delegations$: Observable<InlineResponse20038>;
  delegateAmount$: Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin | undefined>;
  coins$: Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin[] | undefined>;
  uguuBalance$: Observable<string> | undefined;
  minimumGasPrices$: Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin[] | undefined>;
  validator: InlineResponse20041Validators | undefined;
  unbondingDelegation$: Observable<InlineResponse20047 | undefined>;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public readonly data: InlineResponse20041Validators,
    public matDialogRef: MatDialogRef<UndelegateFormDialogComponent>,
    private readonly cosmosSDK: CosmosSDKService,
    private readonly walletService: WalletService,
    private readonly configS: ConfigService,
    private readonly stakingAppService: StakingApplicationService,
  ) {
    this.validator = data;
    this.currentStoredWallet$ = this.walletService.currentStoredWallet$;
    const address$ = this.currentStoredWallet$.pipe(
      filter((wallet): wallet is StoredWallet => wallet !== undefined && wallet !== null),
      map((wallet) => cosmosclient.AccAddress.fromString(wallet.address)),
    );
    this.delegations$ = combineLatest([this.cosmosSDK.sdk$, address$]).pipe(
      mergeMap(([sdk, address]) => cosmosclient.rest.staking.delegatorDelegations(sdk.rest, address)),
      map((res) => res.data),
    );
    this.unbondingDelegation$ = combineLatest([this.cosmosSDK.sdk$, address$]).pipe(
      mergeMap(([sdk, address]) => {
        const valAddressString = this.validator?.operator_address;
        if (!valAddressString) {
          return of(undefined);
        }
        const valAddress = cosmosclient.ValAddress.fromString(valAddressString);
        const unbondingDelegation = cosmosclient.rest.staking
          .unbondingDelegation(sdk.rest, valAddress, address)
          .then((res) => res.data)
          .catch((error) => {
            console.error(error.message);
            return undefined;
          });
        return unbondingDelegation;
      }),
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
      mergeMap(([sdk, address]) => cosmosclient.rest.bank.allBalances(sdk.rest, address)),
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

  ngOnInit(): void { }

  async onSubmit($event: UndelegateOnSubmitEvent) {
    const txHash = await this.stakingAppService.undelegate(
      this.validator?.operator_address!,
      $event.amount,
      $event.minimumGasPrice,
      $event.gasRatio,
    );
    this.matDialogRef.close(txHash);
  }
}
