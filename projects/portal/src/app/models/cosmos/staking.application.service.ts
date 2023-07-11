import { DelegateFormDialogComponent } from '../../pages/dialogs/delegate/delegate-form-dialog/delegate-form-dialog.component';
import { DelegateMenuDialogComponent } from '../../pages/dialogs/delegate/delegate-menu-dialog/delegate-menu-dialog.component';
import { RedelegateFormDialogComponent } from '../../pages/dialogs/delegate/redelegate-form-dialog/redelegate-form-dialog.component';
import { UndelegateFormDialogComponent } from '../../pages/dialogs/delegate/undelegate-form-dialog/undelegate-form-dialog.component';
import { convertHexStringToUint8Array } from '../../utils/converter';
import { validatePrivateStoredWallet } from '../../utils/validation';
import {
  TxFeeConfirmDialogData,
  TxFeeConfirmDialogComponent,
} from '../../views/cosmos/tx-fee-confirm-dialog/tx-fee-confirm-dialog.component';
import {
  TxConfirmDialogComponent,
  TxConfirmDialogData,
} from '../../views/dialogs/txs/tx-confirm/tx-confirm-dialog.component';
import { KeyType } from '../keys/key.model';
import { WalletApplicationService } from '../wallets/wallet.application.service';
import { StoredWallet, WalletType } from '../wallets/wallet.model';
import { WalletService } from '../wallets/wallet.service';
import { CreateValidatorData, EditValidatorData } from './staking.model';
import { StakingService } from './staking.service';
import { SimulatedTxResultResponse } from './tx-common.model';
import { Dialog } from '@angular/cdk/dialog';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import cosmosclient from '@cosmos-client/core';
import {
  StakingDelegatorValidators200ResponseValidatorsInner,
  BroadcastTx200Response,
} from '@cosmos-client/core/esm/openapi';
import { LoadingDialogService } from 'projects/shared/src/lib/components/loading-dialog';
import { take } from 'rxjs/operators';

export interface InterfaceValidatorSimpleOptions {
  disableRedirect?: boolean;
  disableErrorSnackBar?: boolean;
  disableSimulate?: boolean;
}
export interface InterfaceGasAndFee {
  gas: cosmosclient.proto.cosmos.base.v1beta1.ICoin;
  fee: cosmosclient.proto.cosmos.base.v1beta1.ICoin | null;
}

@Injectable({
  providedIn: 'root',
})
export class StakingApplicationService {
  constructor(
    private readonly router: Router,
    private readonly snackBar: MatSnackBar,
    private readonly dialog: Dialog,
    private readonly loadingDialog: LoadingDialogService,
    private readonly staking: StakingService,
    private readonly walletService: WalletService,
    private readonly walletApplicationService: WalletApplicationService,
  ) {}

  async openDelegateMenuDialog(
    validator: StakingDelegatorValidators200ResponseValidatorsInner,
  ): Promise<void> {
    await this.dialog.open(DelegateMenuDialogComponent, { data: validator }).closed.toPromise();
  }

  async openDelegateFormDialog(
    validator: StakingDelegatorValidators200ResponseValidatorsInner,
  ): Promise<void> {
    const txHash = await this.dialog
      .open<string>(DelegateFormDialogComponent, { data: validator })
      .closed.toPromise();
    if (txHash) {
      await this.dialog
        .open<TxConfirmDialogData>(TxConfirmDialogComponent, {
          data: {
            txHash: txHash,
            msg: 'Successfully delegated to the validator. Please check your balance and Delegation status.',
          },
        })
        .closed.toPromise();
      location.reload();
    }
  }

  async openRedelegateFormDialog(
    validator: StakingDelegatorValidators200ResponseValidatorsInner,
  ): Promise<void> {
    const txHash = await this.dialog
      .open<string>(RedelegateFormDialogComponent, { data: validator })
      .closed.toPromise();
    if (txHash) {
      await this.dialog
        .open<TxConfirmDialogData>(TxConfirmDialogComponent, {
          data: {
            txHash: txHash,
            msg: 'Successfully redelegated to the validator. Please check delegation status.',
          },
        })
        .closed.toPromise();
      location.reload();
    }
  }

  async openUndelegateFormDialog(
    validator: StakingDelegatorValidators200ResponseValidatorsInner,
  ): Promise<void> {
    const txHash = await this.dialog
      .open<string>(UndelegateFormDialogComponent, { data: validator })
      .closed.toPromise();
    if (txHash) {
      await this.dialog
        .open<TxConfirmDialogData>(TxConfirmDialogComponent, {
          data: {
            txHash: txHash,
            msg: 'Successfully undelegated to the validator. It takes a certain amount of time for the balance to reflect.',
          },
        })
        .closed.toPromise();
      location.reload();
    }
  }

  async handleSimulateToCreateValidator(
    createValidatorData: CreateValidatorData,
    minimumGasPrice: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    gasRatio: number,
    privateKey: Uint8Array,
    disableSimulate?: boolean,
  ): Promise<InterfaceGasAndFee> {
    if (!disableSimulate) {
      const simulatedResultData = await this.staking.simulateToCreateValidator(
        KeyType.secp256k1,
        createValidatorData,
        minimumGasPrice,
        privateKey,
        gasRatio,
      );
      const gas = simulatedResultData.estimatedGasUsedWithMargin;
      const fee = simulatedResultData.estimatedFeeWithMargin;
      return {
        gas,
        fee,
      };
    }

    const gas = {
      denom: 'uguu',
      amount: '1000000',
    };
    const fee = null;

    return {
      gas,
      fee,
    };
  }

  async createValidatorSimple(
    createValidatorData: CreateValidatorData,
    minimumGasPrice: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    privateKeyString: string,
    gasRatio: number,
    options?: InterfaceValidatorSimpleOptions,
  ): Promise<string | undefined> {
    const privateKey = convertHexStringToUint8Array(privateKeyString);
    if (!privateKey) {
      this.snackBar.open('Invalid PrivateKey!', 'Close');
      return;
    }

    const dialogRef = this.loadingDialog.open('Sending Tx to be validator...');

    const { disableRedirect, disableErrorSnackBar, disableSimulate } = options || {};

    try {
      const { gas, fee } = await this.handleSimulateToCreateValidator(
        createValidatorData,
        minimumGasPrice,
        gasRatio,
        privateKey,
        disableSimulate,
      );
      const createValidatorResult = await this.staking.createValidator(
        KeyType.secp256k1,
        createValidatorData,
        gas,
        fee,
        privateKey,
      );

      const txHash = createValidatorResult.tx_response?.txhash;
      if (txHash === undefined) {
        throw Error('Invalid txHash!');
      }

      this.snackBar.open('Success', undefined, { duration: 6000 });

      if (!disableRedirect) {
        const redirectUrl = `${location.protocol}//${location.host}/explorer/validators/${createValidatorData.validator_address}`;
        window.location.href = redirectUrl;
      }
      return txHash;
    } catch (error) {
      console.error(error);
      if (!disableErrorSnackBar) {
        this.snackBar.open(`Error: ${(error as Error).message}`, 'Close');
      }
      return;
    } finally {
      dialogRef.close();
    }
  }

  async createValidator(
    createValidatorData: CreateValidatorData,
    minimumGasPrice: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    gasRatio: number,
  ) {
    const privateWallet: (StoredWallet & { privateKey: string }) | undefined =
      await this.walletApplicationService.openUnunifiKeyFormDialog();
    if (!privateWallet || !privateWallet.privateKey) {
      this.snackBar.open('Failed to get Wallet info from dialog! Tray again!', 'Close');
      return;
    }

    if (!validatePrivateStoredWallet(privateWallet)) {
      this.snackBar.open('Invalid Wallet info!', 'Close');
      return;
    }

    const privateKey = convertHexStringToUint8Array(privateWallet.privateKey);

    if (!privateKey) {
      this.snackBar.open('Invalid PrivateKey!', 'Close');
      return;
    }

    // simulate
    let simulatedResultData: SimulatedTxResultResponse;
    let gas: cosmosclient.proto.cosmos.base.v1beta1.ICoin;
    let fee: cosmosclient.proto.cosmos.base.v1beta1.ICoin;

    const dialogRefSimulating = this.loadingDialog.open('Simulating...');

    try {
      simulatedResultData = await this.staking.simulateToCreateValidator(
        privateWallet.key_type,
        createValidatorData,
        minimumGasPrice,
        privateKey,
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

    const dialogRef = this.loadingDialog.open('Loading...');

    let createValidatorResult: BroadcastTx200Response | undefined;
    let txHash: string | undefined;

    try {
      createValidatorResult = await this.staking.createValidator(
        privateWallet.key_type,
        createValidatorData,
        gas,
        fee,
        privateKey,
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

    // this.snackBar.open('Successfully create validator', undefined, { duration: 6000 });

    if (txHash) {
      await this.dialog
        .open<TxConfirmDialogData>(TxConfirmDialogComponent, {
          data: { txHash: txHash, msg: 'Successfully created a new Validator.' },
        })
        .closed.toPromise();
      location.reload();
    }
  }

  async handleSimulateToEditValidator(
    editValidatorData: EditValidatorData,
    minimumGasPrice: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    gasRatio: number,
    cosmosPublicKey: cosmosclient.PubKey,
    disableSimulate?: boolean,
  ): Promise<InterfaceGasAndFee> {
    if (!disableSimulate) {
      const dialogRefSimulating = this.loadingDialog.open('Simulating...');

      try {
        const simulatedResultData = await this.staking.simulateToEditValidator(
          editValidatorData,
          minimumGasPrice,
          cosmosPublicKey,
          gasRatio,
        );
        const gas = simulatedResultData.estimatedGasUsedWithMargin;
        const fee = simulatedResultData.estimatedFeeWithMargin;
        return { gas, fee };
      } catch (error) {
        console.error(error);
        const errorMessage = `Tx simulation failed: ${(error as Error).toString()}`;
        this.snackBar.open(`An error has occur: ${errorMessage}`, 'Close');
        const gas = { denom: 'uguu', amount: '1000000' };
        const fee = null;
        return { gas, fee };
      } finally {
        dialogRefSimulating.close();
      }
    }
    const gas = { denom: 'uguu', amount: '1000000' };
    const fee = null;
    return { gas, fee };
  }

  async editValidatorSimple(
    editValidatorData: EditValidatorData,
    minimumGasPrice: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    privateKeyString: string,
    gasRatio: number,
    options?: InterfaceValidatorSimpleOptions,
  ) {
    const currentCosmosWallet = await this.walletService.currentCosmosWallet$
      .pipe(take(1))
      .toPromise();
    if (!currentCosmosWallet) {
      throw Error('Current connected wallet is invalid!');
    }
    const privateKey = convertHexStringToUint8Array(privateKeyString);
    if (!privateKey) {
      this.snackBar.open('Invalid PrivateKey!', 'Close');
      return;
    }

    const dialogRef = this.loadingDialog.open('Sending Tx to edit validator...');
    const { disableRedirect, disableErrorSnackBar, disableSimulate } = options || {};

    try {
      const { gas, fee } = await this.handleSimulateToEditValidator(
        editValidatorData,
        minimumGasPrice,
        gasRatio,
        currentCosmosWallet.public_key,
        disableSimulate,
      );

      const editValidatorResult = await this.staking.editValidator(
        editValidatorData,
        currentCosmosWallet,
        gas,
        fee,
        privateKey,
      );
      const txHash = editValidatorResult.tx_response?.txhash;
      if (txHash === undefined) {
        throw Error('Invalid txHash!');
      }
      this.snackBar.open('Success', undefined, { duration: 6000 });
      if (!disableRedirect) {
        const redirectUrl = `${location.protocol}//${location.host}/explorer/validators/${editValidatorData.validator_address}`;
        window.location.href = redirectUrl;
      }
      return txHash;
    } catch (error) {
      console.error(error);
      if (!disableErrorSnackBar) {
        this.snackBar.open(`Error: ${(error as Error).message}`, 'Close');
      }
      return;
    } finally {
      dialogRef.close();
    }
  }

  async editValidator(
    editValidatorData: EditValidatorData,
    minimumGasPrice: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    gasRatio: number,
    options?: InterfaceValidatorSimpleOptions,
  ) {
    const privateWallet: (StoredWallet & { privateKey: string }) | undefined =
      await this.walletApplicationService.openUnunifiKeyFormDialog();
    if (!privateWallet || !privateWallet.privateKey) {
      this.snackBar.open('Failed to get Wallet info from dialog! Tray again!', 'Close');
      return;
    }

    if (!validatePrivateStoredWallet(privateWallet)) {
      this.snackBar.open('Invalid Wallet info!', 'Close');
      return;
    }

    const currentCosmosWallet = this.walletService.convertStoredWalletToCosmosWallet(privateWallet);

    const privateKey = convertHexStringToUint8Array(privateWallet.privateKey);
    if (!privateKey) {
      this.snackBar.open('Invalid PrivateKey!', 'Close');
      return;
    }

    const dialogRef = this.loadingDialog.open('Loading...');
    const { disableRedirect, disableErrorSnackBar, disableSimulate } = options || {};
    try {
      const { gas, fee } = await this.handleSimulateToEditValidator(
        editValidatorData,
        minimumGasPrice,
        gasRatio,
        currentCosmosWallet.public_key,
        disableSimulate,
      );

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

      const editValidatorResult = await this.staking.editValidator(
        editValidatorData,
        currentCosmosWallet,
        gas,
        fee,
        privateKey,
      );

      const txHash = editValidatorResult.tx_response?.txhash;
      if (txHash === undefined) {
        throw Error('Invalid txHash!');
      }

      this.snackBar.open('Successfully edit validator', undefined, { duration: 6000 });

      if (!disableRedirect) {
        const redirectUrl = `${location.protocol}//${location.host}/explorer/validators/${editValidatorData.validator_address}`;
        window.location.href = redirectUrl;
      }
    } catch (error) {
      console.error(error);
      const msg = (error as Error).toString();
      if (!disableErrorSnackBar) {
        this.snackBar.open(`An error has occur: ${msg}`, 'Close');
      }
      return;
    } finally {
      dialogRef.close();
    }
  }

  async createDelegate(
    validatorAddress: string,
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
      simulatedResultData = await this.staking.simulateToCreateDelegate(
        validatorAddress,
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
    if (currentCosmosWallet.type === WalletType.UnUniFi) {
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
      txResult = await this.staking.createDelegate(
        validatorAddress,
        amount,
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

    this.snackBar.open('Successfully delegate to the validator', undefined, { duration: 6000 });

    return txHash;
    // await this.router.navigate(['txs', txHash]);
  }

  async Redelegate(
    validatorAddressBefore: string,
    validatorAddressAfter: string,
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
      simulatedResultData = await this.staking.simulateToRedelegate(
        validatorAddressBefore,
        validatorAddressAfter,
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
    if (currentCosmosWallet.type === WalletType.UnUniFi) {
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

    //send tx
    const dialogRef = this.loadingDialog.open('Sending');

    let txResult: BroadcastTx200Response | undefined;
    let txHash: string | undefined;

    try {
      txResult = await this.staking.redelegate(
        validatorAddressBefore,
        validatorAddressAfter,
        amount,
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

    this.snackBar.open('Successfully redelegate to the validator', undefined, { duration: 6000 });

    return txHash;
    // await this.router.navigate(['txs', txHash]);
  }

  async undelegate(
    validatorAddress: string,
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
      simulatedResultData = await this.staking.simulateToUndelegate(
        validatorAddress,
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
    if (currentCosmosWallet.type === WalletType.UnUniFi) {
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

    let undelegateResult: BroadcastTx200Response | undefined;
    let txHash: string | undefined;

    try {
      undelegateResult = await this.staking.undelegate(
        validatorAddress,
        amount,
        currentCosmosWallet,
        gas,
        fee,
      );
      txHash = undelegateResult.tx_response?.txhash;
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
