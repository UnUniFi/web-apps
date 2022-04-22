import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { cosmosclient, proto, rest } from '@cosmos-client/core';
import { InlineResponse20052Proposals } from '@cosmos-client/core/esm/openapi';
import { CosmosSDKService } from 'projects/portal/src/app/models';
import { ConfigService } from 'projects/portal/src/app/models/config.service';
import { GovApplicationService } from 'projects/portal/src/app/models/cosmos/gov.application.service';
import { StoredWallet } from 'projects/portal/src/app/models/wallets/wallet.model';
import { WalletService } from 'projects/portal/src/app/models/wallets/wallet.service';
import { DepositOnSubmitEvent } from 'projects/portal/src/app/views/dialogs/vote/deposit/deposit-form-dialog.component';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, filter, map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-deposit-form-dialog',
  templateUrl: './deposit-form-dialog.component.html',
  styleUrls: ['./deposit-form-dialog.component.css'],
})
export class DepositFormDialogComponent implements OnInit {
  proposal$: Observable<InlineResponse20052Proposals | undefined>;
  currentStoredWallet$: Observable<StoredWallet | null | undefined>;
  coins$: Observable<proto.cosmos.base.v1beta1.ICoin[] | undefined>;
  uguuBalance$: Observable<string> | undefined;
  minimumGasPrices$: Observable<proto.cosmos.base.v1beta1.ICoin[] | undefined>;
  proposalID: number | undefined;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public readonly data: number,
    public matDialogRef: MatDialogRef<DepositFormDialogComponent>,
    private readonly cosmosSDK: CosmosSDKService,
    private readonly walletService: WalletService,
    private readonly configS: ConfigService,
    private readonly govAppService: GovApplicationService,
  ) {
    this.proposalID = data;
    this.proposal$ = this.cosmosSDK.sdk$.pipe(
      mergeMap((sdk) => rest.gov.proposal(sdk.rest, String(this.proposalID))),
      map((result) => result.data.proposal!),
      catchError((error) => {
        console.error(error);
        return of(undefined);
      }),
    );
    this.currentStoredWallet$ = this.walletService.currentStoredWallet$;
    const address$ = this.currentStoredWallet$.pipe(
      filter((wallet): wallet is StoredWallet => wallet !== undefined && wallet !== null),
      map((wallet) => cosmosclient.AccAddress.fromString(wallet.address)),
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

  async onSubmit($event: DepositOnSubmitEvent) {
    if (!this.proposalID) {
      return;
    }
    const txHash = await this.govAppService.Deposit(
      this.proposalID,
      $event.amount,
      $event.minimumGasPrice,
      1.1,
    );
    this.matDialogRef.close(txHash);
  }
}
