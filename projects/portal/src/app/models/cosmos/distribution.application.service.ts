import { WithdrawDelegatorRewardFormDialogComponent } from '../../pages/dialogs/delegate/withdraw-delegator-reward-form-dialog/withdraw-delegator-reward-form-dialog.component';
import { WithdrawValidatorCommissionFormDialogComponent } from '../../pages/dialogs/delegate/withdraw-validator-commission-form-dialog/withdraw-validator-commission-form-dialog.component';
import { TxFeeConfirmDialogComponent } from '../../views/cosmos/tx-fee-confirm-dialog/tx-fee-confirm-dialog.component';
import { WalletType } from '../wallets/wallet.model';
import { WalletService } from '../wallets/wallet.service';
import { DistributionService } from './distribution.service';
import { SimulatedTxResultResponse } from './tx-common.model';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { proto } from '@cosmos-client/core';
import {
  InlineResponse20050,
  InlineResponse20041Validators,
} from '@cosmos-client/core/esm/openapi';
import { LoadingDialogService } from 'ng-loading-dialog';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DistributionApplicationService {
  constructor(
    private readonly router: Router,
    private readonly snackBar: MatSnackBar,
    private readonly dialog: MatDialog,
    private readonly loadingDialog: LoadingDialogService,
    private readonly distribution: DistributionService,
    private readonly walletService: WalletService,
  ) {}

  async openWithdrawDelegatorRewardFormDialog(
    validator: InlineResponse20041Validators,
  ): Promise<void> {
    const txHash = await this.dialog
      .open(WithdrawDelegatorRewardFormDialogComponent, { data: validator })
      .afterClosed()
      .toPromise();
    await this.router.navigate(['txs', txHash]);
  }

  async openWithdrawValidatorCommissionFormDialog(
    validator: InlineResponse20041Validators,
  ): Promise<void> {
    const txHash = await this.dialog
      .open(WithdrawValidatorCommissionFormDialogComponent, { data: validator })
      .afterClosed()
      .toPromise();
    await this.router.navigate(['txs', txHash]);
  }

  async withdrawDelegatorReward(
    validatorAddress: string,
    minimumGasPrice: proto.cosmos.base.v1beta1.ICoin,
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
    let gas: proto.cosmos.base.v1beta1.ICoin;
    let fee: proto.cosmos.base.v1beta1.ICoin;

    const dialogRefSimulating = this.loadingDialog.open('Simulating...');

    try {
      simulatedResultData = await this.distribution.simulateToWithdrawDelegatorReward(
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
    }

    // send tx
    const dialogRef = this.loadingDialog.open('Sending');

    let txResult: InlineResponse20050 | undefined;
    let txHash: string | undefined;

    try {
      txResult = await this.distribution.withdrawDelegatorReward(
        validatorAddress,
        currentCosmosWallet,
        gas,
        fee,
      );
      txHash = txResult.tx_response?.txhash;
      if (txHash === undefined) {
        throw Error('Invalid txHash!');
      }
    } catch (error) {
      console.error(error);
      const msg = (error as Error).toString();
      this.snackBar.open(`An error has occur: ${msg}`, 'Close');
      return;
    } finally {
      dialogRef.close();
    }

    this.snackBar.open('Successfully withdraw delegator reward.', undefined, { duration: 6000 });

    return txHash;
  }

  async withdrawValidatorCommission(
    validatorAddress: string,
    minimumGasPrice: proto.cosmos.base.v1beta1.ICoin,
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
    let gas: proto.cosmos.base.v1beta1.ICoin;
    let fee: proto.cosmos.base.v1beta1.ICoin;

    const dialogRefSimulating = this.loadingDialog.open('Simulating...');

    try {
      simulatedResultData = await this.distribution.simulateToWithdrawValidatorCommission(
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
    }

    // send tx
    const dialogRef = this.loadingDialog.open('Sending');

    let txResult: InlineResponse20050 | undefined;
    let txHash: string | undefined;

    try {
      txResult = await this.distribution.withdrawValidatorCommission(
        validatorAddress,
        currentCosmosWallet,
        gas,
        fee,
      );
      txHash = txResult.tx_response?.txhash;
      if (txHash === undefined) {
        throw Error('Invalid txHash!');
      }
    } catch (error) {
      console.error(error);
      const msg = (error as Error).toString();
      this.snackBar.open(`An error has occur: ${msg}`, 'Close');
      return;
    } finally {
      dialogRef.close();
    }

    this.snackBar.open('Successfully withdraw validator commission.', undefined, {
      duration: 6000,
    });

    return txHash;
  }
}
