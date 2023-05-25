import {
  TxFeeConfirmDialogData,
  TxFeeConfirmDialogComponent,
} from '../../views/cosmos/tx-fee-confirm-dialog/tx-fee-confirm-dialog.component';
import { SimulatedTxResultResponse } from '../cosmos/tx-common.model';
import { WalletType } from '../wallets/wallet.model';
import { WalletService } from '../wallets/wallet.service';
import { AuctionService } from './auction.service';
import { Dialog } from '@angular/cdk/dialog';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import cosmosclient from '@cosmos-client/core';
import { BroadcastTx200Response } from '@cosmos-client/core/esm/openapi';
import { LoadingDialogService } from 'projects/shared/src/lib/components/loading-dialog';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuctionApplicationService {
  constructor(
    private readonly snackBar: MatSnackBar,
    private readonly dialog: Dialog,
    private readonly loadingDialog: LoadingDialogService,
    private readonly auction: AuctionService,
    private readonly walletService: WalletService,
  ) {}

  async placeBid(
    auctionID: number,
    amount: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
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
      simulatedResultData = await this.auction.simulateToPlaceBid(
        auctionID,
        amount,
        cosmosPublicKey,
        minimumGasPrice,
        gasRatio,
      );
      gas = simulatedResultData.estimatedGasUsedWithMargin;
      fee = simulatedResultData.estimatedFeeWithMargin;
    } catch (error) {
      console.error(error);
      const errorMessage = `Tx simulation failed: ${(error as Error).toString()}`;
      this.snackBar.open(`An error has occur: ${errorMessage}`, 'Close');
      return;
    } finally {
      dialogRefSimulating.close();
    }

    // confirm fee only ununifi wallet type case
    if (currentCosmosWallet.type === WalletType.ununifi) {
      const txFeeConfirmedResult = await this.dialog
        .open<TxFeeConfirmDialogData>(TxFeeConfirmDialogComponent, {
          data: {
            fee,
            isConfirmed: false,
          },
        })
        .closed.toPromise();
      if (txFeeConfirmedResult === undefined || txFeeConfirmedResult.isConfirmed === false) {
        this.snackBar.open('Tx was canceled', undefined, { duration: 6000 });
        return;
      }
    }

    // send tx
    const dialogRef = this.loadingDialog.open('Bidding...');

    let txhash: string | undefined;
    try {
      const res: BroadcastTx200Response = await this.auction.placeBid(
        auctionID,
        amount,
        currentCosmosWallet,
        gas,
        fee,
      );
      txhash = res.tx_response?.txhash;
      if (txhash === undefined) {
        throw Error('Invalid txhash!');
      }
    } catch (error) {
      const msg = (error as Error).toString();
      this.snackBar.open(`Error has occurred: ${msg}`, 'Close');
      return;
    } finally {
      dialogRef.close();
    }

    this.snackBar.open('Successfully Bid', undefined, {
      duration: 6000,
    });

    const redirectUrl = `${location.protocol}//${location.hostname}/txs/${txhash}`;
    window.location.href = redirectUrl;
  }
}
