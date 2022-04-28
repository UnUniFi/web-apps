import { DelegateFormDialogComponent } from '../../../pages/dialogs/delegate/delegate-form-dialog/delegate-form-dialog.component';
import { DelegateMenuDialogComponent } from '../../../pages/dialogs/delegate/delegate-menu-dialog/delegate-menu-dialog.component';
import { RedelegateFormDialogComponent } from '../../../pages/dialogs/delegate/redelegate-form-dialog/redelegate-form-dialog.component';
import { UndelegateFormDialogComponent } from '../../../pages/dialogs/delegate/undelegate-form-dialog/undelegate-form-dialog.component';
import { convertHexStringToUint8Array } from '../../../utils/converter';
import { validatePrivateStoredWallet } from '../../../utils/validater';
import { TxFeeConfirmDialogComponent } from '../../../views/cosmos/tx-fee-confirm-dialog/tx-fee-confirm-dialog.component';
import { WalletApplicationService } from '../../wallets/wallet.application.service';
import { StoredWallet } from '../../wallets/wallet.model';
import { WalletService } from '../../wallets/wallet.service';
import { CreateValidatorData } from '../staking.model';
import { SimulatedTxResultResponse } from '../tx-common.model';
import { KeplrStakingService } from './keplr-staking.service';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { proto } from '@cosmos-client/core';
import {
  InlineResponse20066Validators,
  InlineResponse20075,
} from '@cosmos-client/core/esm/openapi';
import { LoadingDialogService } from 'ng-loading-dialog';

@Injectable({
  providedIn: 'root',
})
export class KeplrStakingApplicationService {
  constructor(
    private readonly router: Router,
    private readonly snackBar: MatSnackBar,
    private readonly dialog: MatDialog,
    private readonly loadingDialog: LoadingDialogService,
    private readonly keplrStaking: KeplrStakingService,
    private readonly walletService: WalletService,
  ) {}

  // WIP
  async createValidatorKeplr(
    createValidatorData: CreateValidatorData,
    minimumGasPrice: proto.cosmos.base.v1beta1.ICoin,
    gasRatio: number,
  ) {
    const currentWallet = await this.walletService.getCurrentStoredWallet();
    if (!currentWallet || !currentWallet.public_key) {
      this.snackBar.open('Failed to get Wallet info from dialog! Tray again!', 'Close');
      return;
    }
    const pubkey = convertHexStringToUint8Array(currentWallet.public_key);

    if (!pubkey) {
      this.snackBar.open('Invalid PublicKey!', 'Close');
      return;
    }

    // simulate
    let simulatedResultData: SimulatedTxResultResponse;
    let gas: proto.cosmos.base.v1beta1.ICoin;
    let fee: proto.cosmos.base.v1beta1.ICoin;

    const dialogRefSimulating = this.loadingDialog.open('Simulating...');

    try {
      simulatedResultData = await this.keplrStaking.simulateToCreateValidator(
        currentWallet.key_type,
        createValidatorData,
        minimumGasPrice,
        pubkey,
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

    const dialogRef = this.loadingDialog.open('Loading...');

    let createValidatorResult: InlineResponse20075 | undefined;
    let txHash: string | undefined;

    try {
      createValidatorResult = await this.keplrStaking.createValidator(
        currentWallet.key_type,
        createValidatorData,
        gas,
        fee,
        pubkey,
      );
      txHash = createValidatorResult.tx_response?.txhash;
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

    this.snackBar.open('Successfully create validator', undefined, { duration: 6000 });

    await this.router.navigate(['txs', txHash]);
  }

  async createDelegateKeplr(
    validatorAddress: string,
    amount: proto.cosmos.base.v1beta1.ICoin,
    minimumGasPrice: proto.cosmos.base.v1beta1.ICoin,
    gasRatio: number,
  ) {
    const currentWallet = await this.walletService.getCurrentStoredWallet();
    if (!currentWallet || !currentWallet.public_key) {
      this.snackBar.open('Failed to get Wallet info from dialog! Tray again!', 'Close');
      return;
    }
    const pubkey = convertHexStringToUint8Array(currentWallet.public_key);

    if (!pubkey) {
      this.snackBar.open('Invalid PublicKey!', 'Close');
      return;
    }

    // simulate
    let simulatedResultData: SimulatedTxResultResponse;
    let gas: proto.cosmos.base.v1beta1.ICoin;
    let fee: proto.cosmos.base.v1beta1.ICoin;

    const dialogRefSimulating = this.loadingDialog.open('Simulating...');

    try {
      simulatedResultData = await this.keplrStaking.simulateToCreateDelegate(
        currentWallet.key_type,
        validatorAddress,
        amount,
        minimumGasPrice,
        pubkey,
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

    const dialogRef = this.loadingDialog.open('Sending');

    let createDelegatorResult: InlineResponse20075 | undefined;
    let txHash: string | undefined;

    try {
      createDelegatorResult = await this.keplrStaking.createDelegate(
        currentWallet.key_type,
        validatorAddress,
        amount,
        gas,
        fee,
        pubkey,
      );
      txHash = createDelegatorResult.tx_response?.txhash;
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

    this.snackBar.open('Successfully delegate to the validator', undefined, { duration: 6000 });

    return txHash;
    // await this.router.navigate(['txs', txHash]);
  }

  async RedelegateKeplr(
    validatorAddressBefore: string,
    validatorAddressAfter: string,
    amount: proto.cosmos.base.v1beta1.ICoin,
    minimumGasPrice: proto.cosmos.base.v1beta1.ICoin,
    gasRatio: number,
  ) {
    const currentWallet = await this.walletService.getCurrentStoredWallet();
    if (!currentWallet || !currentWallet.public_key) {
      this.snackBar.open('Failed to get Wallet info from dialog! Tray again!', 'Close');
      return;
    }
    const pubkey = convertHexStringToUint8Array(currentWallet.public_key);

    if (!pubkey) {
      this.snackBar.open('Invalid PublicKey!', 'Close');
      return;
    }

    // simulate
    let simulatedResultData: SimulatedTxResultResponse;
    let gas: proto.cosmos.base.v1beta1.ICoin;
    let fee: proto.cosmos.base.v1beta1.ICoin;

    const dialogRefSimulating = this.loadingDialog.open('Simulating...');

    try {
      simulatedResultData = await this.keplrStaking.simulateToRedelegate(
        currentWallet.key_type,
        validatorAddressBefore,
        validatorAddressAfter,
        amount,
        minimumGasPrice,
        pubkey,
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

    const dialogRef = this.loadingDialog.open('Sending');

    let createDelegatorResult: InlineResponse20075 | undefined;
    let txHash: string | undefined;

    try {
      createDelegatorResult = await this.keplrStaking.redelegate(
        currentWallet.key_type,
        validatorAddressBefore,
        validatorAddressAfter,
        amount,
        gas,
        fee,
        pubkey,
      );
      txHash = createDelegatorResult.tx_response?.txhash;
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

    this.snackBar.open('Successfully redelegate to the validator', undefined, { duration: 6000 });

    return txHash;
    // await this.router.navigate(['txs', txHash]);
  }

  async undelegateKeplr(
    validatorAddress: string,
    amount: proto.cosmos.base.v1beta1.ICoin,
    minimumGasPrice: proto.cosmos.base.v1beta1.ICoin,
    gasRatio: number,
  ) {
    const currentWallet = await this.walletService.getCurrentStoredWallet();
    if (!currentWallet || !currentWallet.public_key) {
      this.snackBar.open('Failed to get Wallet info from dialog! Tray again!', 'Close');
      return;
    }
    const pubkey = convertHexStringToUint8Array(currentWallet.public_key);

    if (!pubkey) {
      this.snackBar.open('Invalid PublicKey!', 'Close');
      return;
    }

    // simulate
    let simulatedResultData: SimulatedTxResultResponse;
    let gas: proto.cosmos.base.v1beta1.ICoin;
    let fee: proto.cosmos.base.v1beta1.ICoin;

    const dialogRefSimulating = this.loadingDialog.open('Simulating...');

    try {
      simulatedResultData = await this.keplrStaking.simulateToUndelegate(
        currentWallet.key_type,
        validatorAddress,
        amount,
        minimumGasPrice,
        pubkey,
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

    const dialogRef = this.loadingDialog.open('Sending');

    let createDelegatorResult: InlineResponse20075 | undefined;
    let txHash: string | undefined;

    try {
      createDelegatorResult = await this.keplrStaking.undelegate(
        currentWallet.key_type,
        validatorAddress,
        amount,
        gas,
        fee,
        pubkey,
      );
      txHash = createDelegatorResult.tx_response?.txhash;
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

    this.snackBar.open('Successfully undelegate to the validator', undefined, { duration: 6000 });

    return txHash;
    // await this.router.navigate(['txs', txHash]);
  }
}
