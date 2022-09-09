import { ConfigService } from '../../../../../models/config/config.service';
import { CosmosSDKService } from '../../../../../models/cosmos-sdk/cosmos-sdk.service';
import { Nft } from '../../../../../models/ununifi/query/nft/nft.model';
import { NftTxApplicationService } from '../../../../../models/ununifi/tx/nft/nft-tx.application.service';
import { StoredWallet } from '../../../../../models/wallets/wallet.model';
import { WalletService } from '../../../../../models/wallets/wallet.service';
import { MsgListNftFormData } from '../../../../../views/dialogs/ununifi/tx/nft/list-nft-form-dialog/list-nft-form-dialog.component';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import cosmosclient from '@cosmos-client/core';
import { combineLatest, Observable } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'lib-widget-list-nft-form-dialog',
  templateUrl: './list-nft-form-dialog.component.html',
  styleUrls: ['./list-nft-form-dialog.component.css'],
})
export class LibWidgetListNftFormDialogComponent implements OnInit {
  nft: Nft;

  currentStoredWallet$: Observable<StoredWallet | null | undefined>;
  coins$: Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin[] | undefined>;
  uguuBalance$: Observable<string> | undefined;
  minimumGasPrices$: Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin[] | undefined>;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public readonly data: Nft,
    public matDialogRef: MatDialogRef<LibWidgetListNftFormDialogComponent>,
    private readonly cosmosSDK: CosmosSDKService,
    private readonly walletService: WalletService,
    private readonly configS: ConfigService,
    private readonly nftTxAppService: NftTxApplicationService,
    private readonly snackBar: MatSnackBar,
    private readonly dialog: MatDialog,
  ) {
    this.nft = data;

    this.currentStoredWallet$ = this.walletService.currentStoredWallet$;
    const address$ = this.currentStoredWallet$.pipe(
      filter((wallet): wallet is StoredWallet => wallet !== undefined && wallet !== null),
      map((wallet) => cosmosclient.AccAddress.fromString(wallet.address)),
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

  ngOnInit(): void {}

  async onSubmit($event: MsgListNftFormData): Promise<void> {
    let txHash: string | undefined;

    txHash = await this.nftTxAppService.listNft(
      $event.msgData,
      $event.gasSetting.minimumGasPrice,
      $event.gasSetting.gasRatio,
    );

    this.matDialogRef.close(txHash);
  }
}
