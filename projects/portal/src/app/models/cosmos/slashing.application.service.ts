import { createCosmosPrivateKeyFromString } from '../../utils/key';
import {
  TxFeeConfirmDialogData,
  TxFeeConfirmDialogComponent,
} from '../../views/dialogs/tx-fee-confirm/tx-fee-confirm-dialog.component';
import { KeyType } from '../keys/key.model';
import { WalletType } from '../wallets/wallet.model';
import { WalletService } from '../wallets/wallet.service';
import { SlashingService } from './slashing.service';
import { SimulatedTxResultResponse } from './tx-common.model';
import { TxCommonService } from './tx-common.service';
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
export class SlashingApplicationService {
  constructor(
    private readonly loadingDialog: LoadingDialogService,
    private readonly snackBar: MatSnackBar,
    private readonly dialog: Dialog,
    private readonly txCommonService: TxCommonService,
    private readonly walletService: WalletService,
    private readonly slashingService: SlashingService,
  ) {}

  async unjail(
    validatorAddress: string,
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
      simulatedResultData = await this.slashingService.simulateToUnjail(
        validatorAddress,
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
    const dialogRef = this.loadingDialog.open('Sending...');
    let txResult: BroadcastTx200Response | undefined;
    let txHash: string | undefined;
    try {
      txResult = await this.slashingService.unjail(validatorAddress, currentCosmosWallet, gas, fee);
      txHash = txResult?.tx_response?.txhash;
      if (txHash === undefined) {
        throw Error('Invalid txHash!');
      }
    } catch (error) {
      console.error(error);
      const errorMessage = (error as Error).toString();
      this.snackBar.open(`An error has occur: ${errorMessage}`, 'Close');
      return;
    } finally {
      dialogRef.close();
    }
    this.snackBar.open('Successfully unjail', undefined, { duration: 6000 });
    const redirectUrl = `${location.protocol}//${location.host}/explorer/validators/${validatorAddress}`;
    window.location.href = redirectUrl;
  }

  // Note: feature for special customer
  async unjailSimple(
    validatorAddress: string,
    minimumGasPrice: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    gasRatio: number,
    privateKey: string,
  ) {
    const cosmosPrivateKey = createCosmosPrivateKeyFromString(KeyType.secp256k1, privateKey);
    const cosmosPublicKey = cosmosPrivateKey?.pubKey();
    if (!cosmosPublicKey) {
      throw Error('Invalid public key!');
    }
    const dialogRef = this.loadingDialog.open('Sending Tx to unjail...');
    try {
      const simulatedResultData = await this.slashingService.simulateToUnjail(
        validatorAddress,
        cosmosPublicKey,
        minimumGasPrice,
        gasRatio,
      );
      const gas = simulatedResultData.estimatedGasUsedWithMargin;
      const fee = simulatedResultData.estimatedFeeWithMargin;
      const baseAccount = await this.txCommonService.getBaseAccount(cosmosPublicKey);
      if (!baseAccount) {
        throw Error('Unused Account or Unsupported Account Type!');
      }
      const txBuilder = await this.slashingService.buildUnjailTxBuilder(
        validatorAddress,
        cosmosPublicKey,
        gas,
        fee,
      );
      const signedTxBuilder = await this.txCommonService.signTxWithPrivateKey(
        txBuilder,
        baseAccount,
        privateKey,
      );
      if (!signedTxBuilder) {
        throw Error('Failed to sign!');
      }
      const txResult = await this.txCommonService.announceTx(signedTxBuilder);
      const txHash = txResult.tx_response?.txhash;
      if (txHash === undefined) {
        throw Error('Invalid txHash!');
      }
    } catch (error) {
      console.error(error);
      this.snackBar.open(`Error: ${(error as Error).message}`, 'Close');
      return;
    } finally {
      dialogRef.close();
    }
    this.snackBar.open('Success', undefined, { duration: 6000 });
    const redirectUrl = `${location.protocol}//${location.host}/explorer/validators/${validatorAddress}`;
    window.location.href = redirectUrl;
  }
}
