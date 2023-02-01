import { CreateUnitFormDialogComponent } from '../../pages/dialogs/incentive/create-unit-form-dialog/create-unit-form-dialog.component';
import { WithdrawIncentiveAllRewardsFormDialogComponent } from '../../pages/dialogs/incentive/withdraw-incentive-all-rewards-form-dialog/withdraw-incentive-all-rewards-form-dialog.component';
import { WithdrawIncentiveRewardFormDialogComponent } from '../../pages/dialogs/incentive/withdraw-incentive-reward-form-dialog/withdraw-incentive-reward-form-dialog.component';
import { TxFeeConfirmDialogComponent } from '../../views/cosmos/tx-fee-confirm-dialog/tx-fee-confirm-dialog.component';
import { SimulatedTxResultResponse } from '../cosmos/tx-common.model';
import { WalletApplicationService } from '../wallets/wallet.application.service';
import { WalletType } from '../wallets/wallet.model';
import { WalletService } from '../wallets/wallet.service';
import { DerivativesService } from './derivatives.service';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import cosmosclient from '@cosmos-client/core';
import { BroadcastTx200Response } from '@cosmos-client/core/esm/openapi';
import { LoadingDialogService } from 'projects/shared/src/lib/components/loading-dialog';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DerivativesApplicationService {
  constructor(
    private readonly router: Router,
    private readonly snackBar: MatSnackBar,
    private readonly dialog: MatDialog,
    private readonly loadingDialog: LoadingDialogService,
    private readonly walletApplicationService: WalletApplicationService,
    private readonly walletService: WalletService,
    private readonly derivativesService: DerivativesService,
  ) {}

  async openCreateUnitFormDialog(address: string): Promise<void> {
    const txHash = await this.dialog
      .open(CreateUnitFormDialogComponent, { data: address })
      .afterClosed()
      .toPromise();
    await this.router.navigate(['txs', txHash]);
  }

  async openWithdrawIncentiveRewardFormDialog(denom: string): Promise<void> {
    const txHash = await this.dialog
      .open(WithdrawIncentiveRewardFormDialogComponent, { data: denom })
      .afterClosed()
      .toPromise();
    await this.router.navigate(['txs', txHash]);
  }

  async openWithdrawIncentiveAllRewardsFormDialog(address: string): Promise<void> {
    const txHash = await this.dialog
      .open(WithdrawIncentiveAllRewardsFormDialogComponent, { data: address })
      .afterClosed()
      .toPromise();
    await this.router.navigate(['txs', txHash]);
  }

  async Register(
    derivativesUnitId: string,
    subjectAddresses: string[],
    weights: string[],
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
      simulatedResultData = await this.derivativesService.simulateToRegister(
        derivativesUnitId,
        subjectAddresses,
        weights,
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

    let txResult: BroadcastTx200Response | undefined;
    let txHash: string | undefined;

    try {
      txResult = await this.derivativesService.register(
        derivativesUnitId,
        subjectAddresses,
        weights,
        currentCosmosWallet,
        gas,
        fee,
      );
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
    this.snackBar.open('Successfully registered frontend derivatives.', undefined, {
      duration: 6000,
    });
    return txHash;
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
      simulatedResultData = await this.derivativesService.simulateToWithdrawReward(
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
    let txResult: BroadcastTx200Response | undefined;
    let txHash: string | undefined;
    try {
      txResult = await this.derivativesService.withdrawReward(denom, currentCosmosWallet, gas, fee);
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
    this.snackBar.open('Successfully withdrew frontend derivatives reward.', undefined, {
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
      simulatedResultData = await this.derivativesService.simulateToWithdrawAllRewards(
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
    let txResult: BroadcastTx200Response | undefined;
    let txHash: string | undefined;
    try {
      txResult = await this.derivativesService.withdrawAllRewards(currentCosmosWallet, gas, fee);
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
    this.snackBar.open('Successfully withdrew frontend derivatives reward.', undefined, {
      duration: 6000,
    });
    return txHash;
  }
}
