import { CreateUnitFormDialogComponent } from '../../pages/dialogs/incentive/create-unit-form-dialog/create-unit-form-dialog.component';
import { WithdrawIncentiveAllRewardsFormDialogComponent } from '../../pages/dialogs/incentive/withdraw-incentive-all-rewards-form-dialog/withdraw-incentive-all-rewards-form-dialog.component';
import { WithdrawIncentiveRewardFormDialogComponent } from '../../pages/dialogs/incentive/withdraw-incentive-reward-form-dialog/withdraw-incentive-reward-form-dialog.component';
import {
  TxFeeConfirmDialogData,
  TxFeeConfirmDialogComponent,
} from '../../views/dialogs/tx-fee-confirm/tx-fee-confirm-dialog.component';
import {
  TxConfirmDialogComponent,
  TxConfirmDialogData,
} from '../../views/dialogs/txs/tx-confirm/tx-confirm-dialog.component';
import { SimulatedTxResultResponse } from '../cosmos/tx-common.model';
import { WalletApplicationService } from '../wallets/wallet.application.service';
import { WalletType } from '../wallets/wallet.model';
import { WalletService } from '../wallets/wallet.service';
import { IncentiveService } from './incentive.service';
import { Dialog } from '@angular/cdk/dialog';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import cosmosclient from '@cosmos-client/core';
import { BroadcastTx200Response } from '@cosmos-client/core/esm/openapi';
import { LoadingDialogService } from 'projects/shared/src/lib/components/loading-dialog';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class IncentiveApplicationService {
  constructor(
    private readonly router: Router,
    private readonly snackBar: MatSnackBar,
    private readonly dialog: Dialog,
    private readonly loadingDialog: LoadingDialogService,
    private readonly walletApplicationService: WalletApplicationService,
    private readonly walletService: WalletService,
    private readonly incentiveService: IncentiveService,
  ) {}

  async openCreateUnitFormDialog(address: string): Promise<void> {
    const txHash = await this.dialog
      .open<string>(CreateUnitFormDialogComponent, { data: address })
      .closed.toPromise();
    if (txHash) {
      await this.dialog
        .open<TxConfirmDialogData>(TxConfirmDialogComponent, {
          data: { txHash: txHash, msg: 'Successfully created the Ecosystem Incentive Unit.' },
        })
        .closed.toPromise();
      location.reload();
    }
  }

  async openWithdrawIncentiveRewardFormDialog(denom: string): Promise<void> {
    const txHash = await this.dialog
      .open<string>(WithdrawIncentiveRewardFormDialogComponent, { data: denom })
      .closed.toPromise();
    if (txHash) {
      await this.dialog
        .open<TxConfirmDialogData>(TxConfirmDialogComponent, {
          data: { txHash: txHash, msg: 'Successfully withdraw your Ecosystem Incentive reward.' },
        })
        .closed.toPromise();
      location.reload();
    }
  }

  async openWithdrawIncentiveAllRewardsFormDialog(address: string): Promise<void> {
    const txHash = await this.dialog
      .open<string>(WithdrawIncentiveAllRewardsFormDialogComponent, { data: address })
      .closed.toPromise();
    if (txHash) {
      await this.dialog
        .open<TxConfirmDialogData>(TxConfirmDialogComponent, {
          data: { txHash: txHash, msg: 'Successfully withdraw all Ecosystem Incentive rewards.' },
        })
        .closed.toPromise();
      location.reload();
    }
  }

  async withdrawReward(
    denom: string,
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
      simulatedResultData = await this.incentiveService.simulateToWithdrawReward(
        denom,
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
    const dialogRef = this.loadingDialog.open('Sending');
    let txResult: BroadcastTx200Response | undefined;
    let txHash: string | undefined;
    try {
      txResult = await this.incentiveService.withdrawReward(denom, currentCosmosWallet, gas, fee);
      txHash = txResult?.tx_response?.txhash;
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
    this.snackBar.open('Successfully withdrew frontend incentive reward.', undefined, {
      duration: 6000,
    });
    return txHash;
  }

  async withdrawAllRewards(
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
      simulatedResultData = await this.incentiveService.simulateToWithdrawAllRewards(
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
    const dialogRef = this.loadingDialog.open('Sending');
    let txResult: BroadcastTx200Response | undefined;
    let txHash: string | undefined;
    try {
      txResult = await this.incentiveService.withdrawAllRewards(currentCosmosWallet, gas, fee);
      txHash = txResult?.tx_response?.txhash;
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
    this.snackBar.open('Successfully withdrew frontend incentive reward.', undefined, {
      duration: 6000,
    });
    return txHash;
  }
}
