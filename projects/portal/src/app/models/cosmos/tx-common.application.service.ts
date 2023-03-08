import {
  TxFeeConfirmDialogData,
  TxFeeConfirmDialogComponent,
} from '../../views/cosmos/tx-fee-confirm-dialog/tx-fee-confirm-dialog.component';
import { ConfigService } from '../config.service';
import { SimulatedTxResultResponse } from '../cosmos/tx-common.model';
import { TxCommonService } from '../cosmos/tx-common.service';
import { CosmosWallet, WalletType } from '../wallets/wallet.model';
import { WalletService } from '../wallets/wallet.service';
import { Dialog } from '@angular/cdk/dialog';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import cosmosclient from '@cosmos-client/core';
import { BroadcastTx200Response } from '@cosmos-client/core/esm/openapi';
import { PubKey } from '@cosmos-client/core/esm/types';
import { LoadingDialogService } from 'projects/shared/src/lib/components/loading-dialog';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TxCommonApplicationService {
  constructor(
    private readonly snackBar: MatSnackBar,
    private readonly dialog: Dialog,
    private readonly loadingDialog: LoadingDialogService,
    private readonly walletService: WalletService,
    private readonly txCommon: TxCommonService,
    private readonly config: ConfigService,
  ) {}

  async getPrerequisiteData() {
    const currentCosmosWallet = await this.walletService.currentCosmosWallet$
      .pipe(take(1))
      .toPromise();
    if (!currentCosmosWallet) {
      this.snackBar.open(`Current connected wallet is invalid.`, 'Close');
      return null;
    }
    const address = currentCosmosWallet.address.toString();
    const publicKey = currentCosmosWallet.public_key;
    if (!publicKey) {
      this.snackBar.open(`Invalid public key.`, 'Close');
      return null;
    }
    const account = await this.txCommon.getBaseAccountFromAddress(currentCosmosWallet.address);
    if (!account) {
      this.snackBar.open(`Unsupported account type.`, 'Close');
      return null;
    }

    const minimumGasPrice = await this.config.config$
      .pipe(
        take(1),
        map((config) => config?.minimumGasPrices[0]!),
      )
      .toPromise();

    return {
      address,
      publicKey,
      account,
      currentCosmosWallet,
      minimumGasPrice,
    };
  }

  async simulate(
    msg: any,
    cosmosPublicKey: PubKey,
    account: cosmosclient.proto.cosmos.auth.v1beta1.BaseAccount,
    minimumGasPrice: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
  ) {
    const gasRatio = 1.1;
    let simulatedResultData: SimulatedTxResultResponse;
    let gas: cosmosclient.proto.cosmos.base.v1beta1.ICoin;
    let fee: cosmosclient.proto.cosmos.base.v1beta1.ICoin;

    const dialogRefSimulating = this.loadingDialog.open('Simulating...');

    try {
      const simulateTxBuilder = await this.txCommon.buildTxBuilderWithDummyGasAndFee(
        [msg], //TODO
        cosmosPublicKey,
        account,
        minimumGasPrice,
      );

      simulatedResultData = await this.txCommon.simulateTx(
        simulateTxBuilder,
        minimumGasPrice,
        gasRatio,
      );
      gas = simulatedResultData.estimatedGasUsedWithMargin;
      fee = simulatedResultData.estimatedFeeWithMargin;

      return { gas, fee };
    } catch (error) {
      console.error(error);
      this.snackBar.open(`Tx simulation failed: ${(error as Error).toString()}`, 'Close');
      return null;
    } finally {
      dialogRefSimulating.close();
    }
  }

  async confirmFeeIfUnUniFiWallet(
    currentCosmosWallet: CosmosWallet,
    fee: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
  ) {
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
        return false;
      }
    }

    return true;
  }

  async broadcast(
    msg: any,
    currentCosmosWallet: CosmosWallet,
    cosmosPublicKey: PubKey,
    account: cosmosclient.proto.cosmos.auth.v1beta1.BaseAccount,
    gas: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    fee: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    privateKey?: string,
  ) {
    const dialogRef = this.loadingDialog.open('Sending');

    let txResult: BroadcastTx200Response | undefined;
    let txHash: string | undefined;

    try {
      const txBuilder = await this.txCommon.buildTxBuilder(
        [msg], // TODO
        cosmosPublicKey,
        account,
        gas,
        fee,
      );

      const signerBaseAccount = await this.txCommon.getBaseAccount(cosmosPublicKey);
      if (!signerBaseAccount) {
        throw Error('Unsupported Account!');
      }
      const signedTxBuilder = await this.txCommon.signTx(
        txBuilder,
        signerBaseAccount,
        currentCosmosWallet,
        privateKey,
      );
      if (!signedTxBuilder) {
        throw Error('Failed to sign!');
      }

      txResult = await this.txCommon.announceTx(txBuilder);
      txHash = txResult?.tx_response?.txhash;
      if (txHash === undefined) {
        throw Error(txResult?.tx_response?.raw_log);
      }
      return txHash;
    } catch (error) {
      console.error(error);
      this.snackBar.open(`Tx broadcasting failed: ${(error as Error).toString()}`, 'Close');
      return null;
    } finally {
      dialogRef.close();
    }
  }
}
