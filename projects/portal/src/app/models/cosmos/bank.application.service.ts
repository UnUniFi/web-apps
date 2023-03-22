import {
  TxFeeConfirmDialogData,
  TxFeeConfirmDialogComponent,
} from '../../views/cosmos/tx-fee-confirm-dialog/tx-fee-confirm-dialog.component';
import {
  TxConfirmDialogComponent,
  TxConfirmDialogData,
} from '../../views/dialogs/txs/tx-confirm/tx-confirm-dialog.component';
import { WalletService } from '../wallets/wallet.service';
import { BankService } from './bank.service';
import { SimulatedTxResultResponse } from './tx-common.model';
import { TxCommonService } from './tx-common.service';
import { Dialog } from '@angular/cdk/dialog';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import cosmosclient from '@cosmos-client/core';
import { LoadingDialogService } from 'projects/shared/src/lib/components/loading-dialog';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class BankApplicationService {
  constructor(
    private readonly router: Router,
    private readonly snackBar: MatSnackBar,
    private readonly dialog: Dialog,
    private readonly loadingDialog: LoadingDialogService,
    private readonly bank: BankService,
    private readonly walletService: WalletService,
    private readonly txCommon: TxCommonService,
  ) {}

  async send(
    toAddress: string,
    amount: cosmosclient.proto.cosmos.base.v1beta1.ICoin[],
    minimumGasPrice: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    balances: cosmosclient.proto.cosmos.base.v1beta1.ICoin[],
    gasRatio: number,
  ) {
    // TODO: firstValueFrom
    const currentCosmosWallet = await this.walletService.currentCosmosWallet$
      .pipe(take(1))
      .toPromise();
    if (!currentCosmosWallet) {
      throw Error('Current connected wallet is invalid!');
    }
    const fromAddress = currentCosmosWallet.address;
    const _toAddress = this.txCommon.canonicalizeAccAddress(toAddress);
    const cosmosPublicKey = currentCosmosWallet.public_key;
    if (!cosmosPublicKey) {
      throw Error('Invalid public key!');
    }

    const fromAccount = await this.txCommon.getBaseAccountFromAddress(fromAddress);
    if (!fromAccount) {
      throw Error('Unsupported account type.');
    }

    // simulate
    const dialogRefSimulating = this.loadingDialog.open('Simulating...');

    const { feeDenom, amountToSend, balance, simulationFeeAmount, validity } =
      this.txCommon.validateBalanceBeforeSimulation(amount, minimumGasPrice, balances);

    if (!validity) {
      this.snackBar.open(
        `Insufficient fee margin for simulation!\nAmount to send: ${amountToSend}${feeDenom} + Simulation fee: ${simulationFeeAmount}${feeDenom} > Balance: ${balance}${feeDenom}`,
        'Close',
      );
      dialogRefSimulating.close();
      return;
    }

    let simulatedResultData: SimulatedTxResultResponse;
    let gas: cosmosclient.proto.cosmos.base.v1beta1.ICoin;
    let fee: cosmosclient.proto.cosmos.base.v1beta1.ICoin;

    try {
      simulatedResultData = await this.bank.simulateToSend(
        fromAccount,
        _toAddress,
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

    // check whether the fee exceeded
    const simulatedFee = fee.amount ? parseInt(fee.amount) : 0;
    if (simulatedFee + amountToSend > balance) {
      this.snackBar.open(
        `Insufficient fee margin for send!\nAmount to send: ${amountToSend}${feeDenom} + Simulated fee: ${simulatedFee}${feeDenom} > Balance: ${balance}${feeDenom}`,
        'Close',
      );
      return;
    }

    // ask the user to confirm the fee with a dialog
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

    // send tx
    const dialogRef = this.loadingDialog.open('Sending');
    let txHash: string | undefined;

    try {
      const res = await this.bank.send(
        fromAccount,
        _toAddress,
        amount,
        currentCosmosWallet,
        gas,
        fee,
      );
      txHash = res.tx_response?.txhash;
      if (txHash === undefined) {
        throw Error('Invalid txhash!');
      }
    } catch (error) {
      console.error(error);
      const msg = (error as Error).toString();
      this.snackBar.open(`An error has occur: ${msg}`, 'Close');
      return;
    } finally {
      dialogRef.close();
    }

    // this.snackBar.open('Successfully sent', undefined, {
    //   duration: 6000,
    // });

    if (txHash) {
      await this.dialog
        .open<TxConfirmDialogData>(TxConfirmDialogComponent, {
          data: { txHash: txHash, msg: 'Successfully sent token, please check your balance.' },
        })
        .closed.toPromise();
    }
  }
}
