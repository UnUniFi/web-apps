import { convertHexStringToUint8Array } from '../../utils/converter';
import { validatePrivateStoredWallet } from '../../utils/validation';
import { TxFeeConfirmDialogComponent } from '../../views/cosmos/tx-fee-confirm-dialog/tx-fee-confirm-dialog.component';
import { WalletApplicationService } from '../wallets/wallet.application.service';
import { StoredWallet } from '../wallets/wallet.model';
import { WalletService } from '../wallets/wallet.service';
import { BankService } from './bank.service';
import { SimulatedTxResultResponse } from './tx-common.model';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { proto } from '@cosmos-client/core';
import { LoadingDialogService } from 'ng-loading-dialog';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class BankApplicationService {
  constructor(
    private readonly router: Router,
    private readonly snackBar: MatSnackBar,
    private readonly dialog: MatDialog,
    private readonly loadingDialog: LoadingDialogService,
    private readonly bank: BankService,
    private readonly walletService: WalletService,
  ) {}

  async send(
    toAddress: string,
    amount: proto.cosmos.base.v1beta1.ICoin[],
    minimumGasPrice: proto.cosmos.base.v1beta1.ICoin,
    balances: proto.cosmos.base.v1beta1.ICoin[],
    gasRatio: number,
  ) {
    const currentCosmosWallet = await this.walletService.currentCosmosWallet$
      .pipe(take(1))
      .toPromise();
    if (!currentCosmosWallet) {
      throw Error('Current connected wallet is invalid!');
    }
    const fromAddress = currentCosmosWallet.address;
    const _toAddress = this.bank.canonicalizeAccAddress(toAddress);
    const cosmosPublicKey = currentCosmosWallet.public_key;
    if (!cosmosPublicKey) {
      throw Error('Invalid public key!');
    }

    // simulate
    const dialogRefSimulating = this.loadingDialog.open('Simulating...');

    const { feeDenom, amountToSend, balance, simulationFeeAmount, validity } =
      this.bank.validateBalanceBeforeSimulation(amount, minimumGasPrice, balances);

    if (!validity) {
      this.snackBar.open(
        `Insufficient fee margin for simulation!\nAmount to send: ${amountToSend}${feeDenom} + Simulation fee: ${simulationFeeAmount}${feeDenom} > Balance: ${balance}${feeDenom}`,
        'Close',
      );
      dialogRefSimulating.close();
      return;
    }

    let simulatedResultData: SimulatedTxResultResponse;
    let gas: proto.cosmos.base.v1beta1.ICoin;
    let fee: proto.cosmos.base.v1beta1.ICoin;

    try {
      simulatedResultData = await this.bank.simulateToSend(
        fromAddress,
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
      .open(TxFeeConfirmDialogComponent, {
        data: {
          fee,
          isConfirmed: false,
        },
      })
      .afterClosed()
      .toPromise();

    if (txFeeConfirmedResult === undefined || txFeeConfirmedResult.isConfirmed === false) {
      this.snackBar.open('Tx was canceled', undefined, { duration: 6000 });
      return;
    }

    // send tx
    const dialogRef = this.loadingDialog.open('Sending');
    let txhash: string | undefined;

    try {
      const res = await this.bank.send(
        fromAddress,
        _toAddress,
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
      console.error(error);
      const msg = (error as Error).toString();
      this.snackBar.open(`An error has occur: ${msg}`, 'Close');
      return;
    } finally {
      dialogRef.close();
    }

    this.snackBar.open('Successfully sent', undefined, {
      duration: 6000,
    });

    await this.router.navigate(['txs', txhash]);
  }
}
