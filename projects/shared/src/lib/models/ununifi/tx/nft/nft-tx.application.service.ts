import { LoadingDialogService } from '../../../../components/loading-dialog';
import { TxFeeConfirmDialogComponent } from '../../../../views/dialogs/cosmos/tx/common/tx-fee-confirm-dialog/tx-fee-confirm-dialog.component';
import { LibViewListNftFormDialogComponent } from '../../../../views/dialogs/ununifi/tx/nft/list-nft-form-dialog/list-nft-form-dialog.component';
import { LibViewNftMenuDialogComponent } from '../../../../views/dialogs/ununifi/tx/nft/nft-menu-dialog/nft-menu-dialog.component';
import { LibWidgetListNftFormDialogComponent } from '../../../../widgets/dialogs/ununifi/tx/list-nft-form-dialog/list-nft-form-dialog.component';
import { LibWidgetNftMenuDialogComponent } from '../../../../widgets/dialogs/ununifi/tx/nft-menu-dialog/nft-menu-dialog.component';
import { SimulatedTxResultResponse } from '../../../cosmos/tx/common/tx-common.model';
import { StoredWallet, WalletType } from '../../../wallets/wallet.model';
import { WalletService } from '../../../wallets/wallet.service';
import { Nft } from '../../query/nft/nft.model';
import { NftTxInfrastructureService } from './nft-tx.infrastructure.service';
import { MsgListNftData } from './nft-tx.model';
import { Dialog } from '@angular/cdk/dialog';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import cosmosclient from '@cosmos-client/core';
import { BroadcastTx200Response } from '@cosmos-client/core/esm/openapi';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class NftTxApplicationService {
  constructor(
    private readonly router: Router,
    private readonly snackBar: MatSnackBar,
    private readonly dialog: Dialog,
    private readonly loadingDialog: LoadingDialogService,
    private readonly staking: NftTxInfrastructureService,
    private readonly walletService: WalletService,
  ) {}

  async openNftMenuDialog(nft: Nft): Promise<void> {
    await this.dialog.open(LibWidgetNftMenuDialogComponent, { data: nft }).closed.toPromise();
  }

  async openListNftFormDialog(nft: Nft): Promise<void> {
    const txHash = await this.dialog
      .open<string>(LibWidgetListNftFormDialogComponent, { data: nft })
      .closed.toPromise();
    await this.router.navigate(['txs', txHash]);
  }

  async listNft(
    msgListNftData: MsgListNftData,
    minimumGasPrice: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    gasRatio: number,
  ) {
    // get public key
    const currentCosmosWallet = await this.walletService.currentCosmosWallet$
      .pipe(take(1))
      .toPromise();
    if (!currentCosmosWallet) {
      throw Error('Current connected wallet is invalid!');
    }
    const cosmosPublicKey = currentCosmosWallet.public_key;
    if (!cosmosPublicKey) {
      throw Error('Invalid public key!');
    }

    // simulate
    let simulatedResultData: SimulatedTxResultResponse;
    let gas: cosmosclient.proto.cosmos.base.v1beta1.ICoin;
    let fee: cosmosclient.proto.cosmos.base.v1beta1.ICoin;

    const dialogRefSimulating = this.loadingDialog.open('Simulating...');

    try {
      simulatedResultData = await this.staking.simulateToListNft(
        msgListNftData,
        cosmosPublicKey,
        minimumGasPrice,
        gasRatio,
      );
      gas = simulatedResultData.estimatedGasUsedWithMargin;
      fee = simulatedResultData.estimatedFeeWithMargin;
    } catch (error) {
      console.error(error);
      // Todo: Currently, disabled.
      // const errorMessage = `Tx simulation failed: ${(error as Error).toString()}`;
      // this.snackBar.open(`An error has occur: ${errorMessage}`, 'Close');
      // return;
    } finally {
      dialogRefSimulating.close();
    }

    // Todo: Currently disabled
    // // confirm fee only ununifi wallet type case
    // if (currentCosmosWallet.type === WalletType.ununifi) {
    //   const txFeeConfirmedResult = await this.dialog
    //     .open<{
    //       fee: cosmosclient.proto.cosmos.base.v1beta1.ICoin;
    //       isConfirmed: boolean;
    //     }>(TxFeeConfirmDialogComponent, {
    //       data: {
    //         fee,
    //         isConfirmed: false,
    //       },
    //     })
    //     .closed.toPromise();
    //   if (txFeeConfirmedResult === undefined || txFeeConfirmedResult.isConfirmed === false) {
    //     this.snackBar.open('Tx was canceled', undefined, { duration: 6000 });
    //     return;
    //   }
    // }

    // send tx
    const dialogRef = this.loadingDialog.open('Sending');

    let txResult: BroadcastTx200Response | undefined;
    let txHash: string | undefined;

    try {
      // Todo: Currently disabled
      // txResult = await this.staking.listNft(
      //   validatorAddress,
      //   amount,
      //   currentCosmosWallet,
      //   gas,
      //   fee,
      // );
      // txHash = txResult.tx_response?.txhash;

      // Todo: This is dummy data. should be removed.
      txHash = '2BCEF534E18D5CD84FF49C5B5FA54B923C7A5A352E3F23B2F96711D4E0884823';
      if (txHash === undefined) {
        throw Error('Invalid txHash!');
      }
    } catch (error) {
      console.error(error);
      // Todo: Currently disabled
      // const msg = (error as Error).toString();
      // this.snackBar.open(`An error has occur: ${msg}`, 'Close');
      // return;
    } finally {
      dialogRef.close();
    }

    this.snackBar.open('Successfully listed to NFT Marketplace', undefined, { duration: 6000 });

    return txHash;
    // await this.router.navigate(['txs', txHash]);
  }
}
