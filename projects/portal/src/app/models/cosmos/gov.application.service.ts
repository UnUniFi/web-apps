import { DepositFormDialogComponent } from '../../pages/dialogs/vote/deposit-form-dialog/deposit-form-dialog.component';
import { VoteFormDialogComponent } from '../../pages/dialogs/vote/vote-form-dialog/vote-form-dialog.component';
import { convertHexStringToUint8Array } from '../../utils/converter';
import {
  TxFeeConfirmDialogData,
  TxFeeConfirmDialogComponent,
} from '../../views/cosmos/tx-fee-confirm-dialog/tx-fee-confirm-dialog.component';
import { WalletApplicationService } from '../wallets/wallet.application.service';
import { StoredWallet, WalletType } from '../wallets/wallet.model';
import { WalletService } from '../wallets/wallet.service';
import { GovService } from './gov.service';
import { SimulatedTxResultResponse } from './tx-common.model';
import { Dialog } from '@angular/cdk/dialog';
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
export class GovApplicationService {
  constructor(
    private readonly router: Router,
    private readonly snackBar: MatSnackBar,
    private readonly dialog: MatDialog,
    private readonly tmp_dialog: Dialog,
    private readonly loadingDialog: LoadingDialogService,
    private readonly gov: GovService,
    private readonly walletApplicationService: WalletApplicationService,
    private readonly walletService: WalletService,
  ) {}

  async openVoteFormDialog(proposalID: number): Promise<void> {
    const txHash = await this.dialog
      .open(VoteFormDialogComponent, { data: proposalID })
      .afterClosed()
      .toPromise();
    await this.router.navigate(['txs', txHash]);
  }

  async openDepositFormDialog(proposalID: number): Promise<void> {
    const txHash = await this.dialog
      .open(DepositFormDialogComponent, { data: proposalID })
      .afterClosed()
      .toPromise();
    await this.router.navigate(['txs', txHash]);
  }

  // WIP
  async submitProposal(
    minimumGasPrice: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    gasRatio: number,
  ) {
    const privateWallet: (StoredWallet & { privateKey: string }) | undefined =
      await this.walletApplicationService.openUnunifiKeyFormDialog();
    if (!privateWallet || !privateWallet.privateKey) {
      this.snackBar.open('Failed to get Wallet info from dialog! Tray again!', 'Close');
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
      simulatedResultData = await this.gov.simulateToSubmitProposal(
        privateWallet.key_type,
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
    const txFeeConfirmedResult = await this.tmp_dialog
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

    let submitProposalResult: BroadcastTx200Response | undefined;
    let txHash: string | undefined;

    try {
      submitProposalResult = await this.gov.SubmitProposal(
        privateWallet.key_type,
        gas,
        fee,
        privateKey,
      );
      txHash = submitProposalResult.tx_response?.txhash;
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

    this.snackBar.open('Successfully submit proposal', undefined, { duration: 6000 });

    await this.router.navigate(['txs', txHash]);
  }

  async Vote(
    proposalID: number,
    voteOption: cosmosclient.proto.cosmos.gov.v1beta1.VoteOption,
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
      simulatedResultData = await this.gov.simulateToVote(
        proposalID,
        voteOption,
        minimumGasPrice,
        cosmosPublicKey,
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
      const txFeeConfirmedResult = await this.tmp_dialog
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

    let voteResult: BroadcastTx200Response | undefined;
    let txHash: string | undefined;

    try {
      voteResult = await this.gov.Vote(proposalID, voteOption, currentCosmosWallet, gas, fee);
      txHash = voteResult.tx_response?.txhash;
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

    this.snackBar.open('Successfully vote the proposal', undefined, { duration: 6000 });
    await this.router.navigate(['txs', txHash]);
  }

  async Deposit(
    proposalID: number,
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
      simulatedResultData = await this.gov.simulateToDeposit(
        proposalID,
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
      const txFeeConfirmedResult = await this.tmp_dialog
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

    const dialogRef = this.loadingDialog.open('Sending');

    let depositResult: BroadcastTx200Response | undefined;
    let txHash: string | undefined;

    try {
      depositResult = await this.gov.Deposit(proposalID, amount, currentCosmosWallet, gas, fee);
      txHash = depositResult.tx_response?.txhash;
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

    this.snackBar.open('Successfully deposit the proposal', undefined, { duration: 6000 });

    return txHash;
    // await this.router.navigate(['txs', txHash]);
  }
}
