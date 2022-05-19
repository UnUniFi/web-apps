import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { cosmosclient, proto, rest } from '@cosmos-client/core';
import { CdpApplicationService, CosmosSDKService } from 'projects/portal/src/app/models';
import { ConfigService } from 'projects/portal/src/app/models/config.service';
import { StoredWallet } from 'projects/portal/src/app/models/wallets/wallet.model';
import { WalletService } from 'projects/portal/src/app/models/wallets/wallet.service';
import { CdpDepositOnSubmitEvent } from 'projects/portal/src/app/views/dialogs/mint/cdp-deposit-form-dialog/cdp-deposit-form-dialog.component';
import { combineLatest, Observable } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';
import { InlineResponse2004Cdp1 } from 'ununifi-client/esm/openapi';

@Component({
  selector: 'app-cdp-deposit-form-dialog',
  templateUrl: './cdp-deposit-form-dialog.component.html',
  styleUrls: ['./cdp-deposit-form-dialog.component.css'],
})
export class CdpDepositFormDialogComponent implements OnInit {
  currentStoredWallet$: Observable<StoredWallet | null | undefined>;
  coins$: Observable<proto.cosmos.base.v1beta1.ICoin[] | undefined>;
  collateralBalance$: Observable<string> | undefined;
  minimumGasPrices$: Observable<proto.cosmos.base.v1beta1.ICoin[] | undefined>;
  cdp: InlineResponse2004Cdp1;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public readonly data: InlineResponse2004Cdp1,
    public matDialogRef: MatDialogRef<CdpDepositFormDialogComponent>,
    private readonly cosmosSDK: CosmosSDKService,
    private readonly walletService: WalletService,
    private readonly configS: ConfigService,
    private readonly cdpApplicationService: CdpApplicationService,
  ) {
    this.cdp = data;
    this.currentStoredWallet$ = this.walletService.currentStoredWallet$;
    const address$ = this.currentStoredWallet$.pipe(
      filter((wallet): wallet is StoredWallet => wallet !== undefined && wallet !== null),
      map((wallet) => cosmosclient.AccAddress.fromString(wallet.address)),
    );

    this.coins$ = combineLatest([this.cosmosSDK.sdk$, address$]).pipe(
      mergeMap(([sdk, address]) => rest.bank.allBalances(sdk.rest, address)),
      map((result) => result.data.balances),
    );
    this.collateralBalance$ = this.coins$.pipe(
      map((coins) => {
        const balance = coins?.find((coin) => coin.denom == this.cdp.cdp?.collateral?.denom);
        return balance ? balance.amount! : '0';
      }),
    );

    this.minimumGasPrices$ = this.configS.config$.pipe(map((config) => config?.minimumGasPrices));
  }

  ngOnInit(): void {}
  async onSubmit($event: CdpDepositOnSubmitEvent) {
    let txHash: string | undefined;

    txHash = await this.cdpApplicationService.depositCDP(
      $event.ownerAddress,
      $event.collateralType,
      $event.collateral,
      $event.minimumGasPrice,
      $event.balances,
      $event.gasRatio,
    );
    this.matDialogRef.close(txHash);
  }
}
