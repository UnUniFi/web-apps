import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import { Proposals200ResponseProposalsInner } from '@cosmos-client/core/esm/openapi';
import { ConfigService } from 'projects/portal/src/app/models/config.service';
import { CosmosRestService } from 'projects/portal/src/app/models/cosmos-rest.service';
import { GovApplicationService } from 'projects/portal/src/app/models/cosmos/gov.application.service';
import { StoredWallet } from 'projects/portal/src/app/models/wallets/wallet.model';
import { WalletService } from 'projects/portal/src/app/models/wallets/wallet.service';
import { DepositOnSubmitEvent } from 'projects/portal/src/app/views/dialogs/vote/deposit/deposit-form-dialog.component';
import { Observable, combineLatest } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-deposit-form-dialog',
  templateUrl: './deposit-form-dialog.component.html',
  styleUrls: ['./deposit-form-dialog.component.css'],
})
export class DepositFormDialogComponent implements OnInit {
  proposal$: Observable<Proposals200ResponseProposalsInner | undefined>;
  proposalContent$: Observable<any | undefined>;
  currentStoredWallet$: Observable<StoredWallet | null | undefined>;
  denom$: Observable<string | undefined>;
  balance$: Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin | undefined>;
  minimumGasPrices$: Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin[] | undefined>;
  proposalID: number | undefined;

  constructor(
    @Inject(DIALOG_DATA)
    public readonly data: number,
    public dialogRef: DialogRef<string, DepositFormDialogComponent>,
    private readonly walletService: WalletService,
    private readonly configS: ConfigService,
    private readonly govAppService: GovApplicationService,
    private readonly cosmosRest: CosmosRestService,
  ) {
    this.proposalID = data;
    this.proposal$ = this.cosmosRest.getProposal$(String(this.proposalID));
    this.proposalContent$ = this.proposal$.pipe(map((proposal) => proposal && proposal.content));
    this.currentStoredWallet$ = this.walletService.currentStoredWallet$;
    const address$ = this.currentStoredWallet$.pipe(
      filter((wallet): wallet is StoredWallet => wallet !== undefined && wallet !== null),
      map((wallet) => cosmosclient.AccAddress.fromString(wallet.address)),
    );
    const coins$ = address$.pipe(mergeMap((address) => this.cosmosRest.getAllBalances$(address)));
    const config$ = this.configS.config$;
    this.denom$ = config$.pipe(map((config) => config?.minimumGasPrices[0].denom));
    this.balance$ = combineLatest([coins$, this.denom$]).pipe(
      map(([coins, denom]) => coins?.find((coin) => coin.denom === denom)),
    );

    this.minimumGasPrices$ = config$.pipe(map((config) => config?.minimumGasPrices));
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
      $event.gasRatio,
    );
    this.dialogRef.close(txHash);
  }
}
