import {
  TxConfirmDialogComponent,
  TxConfirmDialogData,
} from '../../views/dialogs/txs/tx-confirm/tx-confirm-dialog.component';
import { BankQueryService } from '../cosmos/bank.query.service';
import { TxCommonApplicationService } from '../cosmos/tx-common.application.service';
import { YieldAggregatorService } from './yield-aggregator.service';
import { Dialog } from '@angular/cdk/dialog';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class YieldAggregatorApplicationService {
  constructor(
    private readonly router: Router,
    private readonly bankQueryService: BankQueryService,
    private readonly yieldAggregatorService: YieldAggregatorService,
    private readonly txCommonApplication: TxCommonApplicationService,
    private readonly dialog: Dialog,
  ) {}

  async depositToVault(vaultId: string, symbol: string, amount: number) {
    const prerequisiteData = await this.txCommonApplication.getPrerequisiteData();
    if (!prerequisiteData) {
      return;
    }
    const { address, publicKey, account, currentCosmosWallet, minimumGasPrice } = prerequisiteData;

    const symbolMetadataMap = await this.bankQueryService
      .getSymbolMetadataMap$()
      .pipe(take(1))
      .toPromise();

    const msg = this.yieldAggregatorService.buildMsgDepositToVault(
      address,
      vaultId,
      symbol,
      amount,
      symbolMetadataMap,
    );

    const simulationResult = await this.txCommonApplication.simulate(
      msg,
      publicKey,
      account,
      minimumGasPrice,
    );
    if (!simulationResult) {
      return;
    }
    const { gas, fee } = simulationResult;

    if (!(await this.txCommonApplication.confirmFeeIfUnUniFiWallet(currentCosmosWallet, fee))) {
      return;
    }

    const txHash = await this.txCommonApplication.broadcast(
      msg,
      currentCosmosWallet,
      publicKey,
      account,
      gas,
      fee,
    );
    if (!txHash) {
      return;
    }

    await this.dialog
      .open<TxConfirmDialogData>(TxConfirmDialogComponent, {
        data: { txHash: txHash, msg: 'Successfully deposit to the vault.' },
      })
      .closed.toPromise();
    this.router.navigate(['yield-aggregator']);
  }

  async withdrawFromVault(vaultId: string, symbol: string, amount: number) {
    const prerequisiteData = await this.txCommonApplication.getPrerequisiteData();
    if (!prerequisiteData) {
      return;
    }
    const { address, publicKey, account, currentCosmosWallet, minimumGasPrice } = prerequisiteData;

    const symbolMetadataMap = await this.bankQueryService
      .getSymbolMetadataMap$()
      .pipe(take(1))
      .toPromise();

    const msg = this.yieldAggregatorService.buildMsgWithdrawFromVault(address, vaultId, amount);

    const simulationResult = await this.txCommonApplication.simulate(
      msg,
      publicKey,
      account,
      minimumGasPrice,
    );
    if (!simulationResult) {
      return;
    }
    const { gas, fee } = simulationResult;

    if (!(await this.txCommonApplication.confirmFeeIfUnUniFiWallet(currentCosmosWallet, fee))) {
      return;
    }

    const txHash = await this.txCommonApplication.broadcast(
      msg,
      currentCosmosWallet,
      publicKey,
      account,
      gas,
      fee,
    );
    if (!txHash) {
      return;
    }

    if (txHash) {
      await this.dialog
        .open<TxConfirmDialogData>(TxConfirmDialogComponent, {
          data: { txHash: txHash, msg: 'Successfully withdraw from the vault.' },
        })
        .closed.toPromise();
      this.router.navigate(['yield-aggregator']);
    }
  }

  async createVault(
    name: string,
    symbol: string,
    strategies: { id: string; weight: number }[],
    commissionRate: number,
    feeAmount: number,
    feeSymbol: string,
    depositAmount: number,
    depositSymbol: string,
  ) {
    const prerequisiteData = await this.txCommonApplication.getPrerequisiteData();
    if (!prerequisiteData) {
      return;
    }
    const { address, publicKey, account, currentCosmosWallet, minimumGasPrice } = prerequisiteData;

    const symbolMetadataMap = await this.bankQueryService
      .getSymbolMetadataMap$()
      .pipe(take(1))
      .toPromise();

    const msg = this.yieldAggregatorService.buildMsgCreateVault(
      address,
      symbol,
      strategies,
      commissionRate,
      feeAmount,
      feeSymbol,
      depositAmount,
      depositSymbol,
      symbolMetadataMap,
    );

    // comment-out simulate
    // const simulationResult = await this.txCommonApplication.simulate(
    //   msg,
    //   publicKey,
    //   account,
    //   minimumGasPrice,
    // );
    // if (!simulationResult) {
    //   return;
    // }
    // const { gas, fee } = simulationResult;

    // if (!(await this.txCommonApplication.confirmFeeIfUnUniFiWallet(currentCosmosWallet, fee))) {
    //   return;
    // }

    const txHash = await this.txCommonApplication.broadcast(
      msg,
      currentCosmosWallet,
      publicKey,
      account,
    );
    if (!txHash) {
      return;
    }

    if (txHash) {
      await this.dialog
        .open<TxConfirmDialogData>(TxConfirmDialogComponent, {
          data: { txHash: txHash, msg: 'Successfully created your new vault.' },
        })
        .closed.toPromise();
      this.router.navigate(['yield-aggregator']);
    }
  }

  async deleteVault(vaultId: string) {
    const prerequisiteData = await this.txCommonApplication.getPrerequisiteData();
    if (!prerequisiteData) {
      return;
    }
    const { address, publicKey, account, currentCosmosWallet, minimumGasPrice } = prerequisiteData;

    const msg = this.yieldAggregatorService.buildMsgDeleteVault(address, vaultId);

    const simulationResult = await this.txCommonApplication.simulate(
      msg,
      publicKey,
      account,
      minimumGasPrice,
    );
    if (!simulationResult) {
      return;
    }
    const { gas, fee } = simulationResult;

    if (!(await this.txCommonApplication.confirmFeeIfUnUniFiWallet(currentCosmosWallet, fee))) {
      return;
    }

    const txHash = await this.txCommonApplication.broadcast(
      msg,
      currentCosmosWallet,
      publicKey,
      account,
      gas,
      fee,
    );
    if (!txHash) {
      return;
    }

    if (txHash) {
      await this.dialog
        .open<TxConfirmDialogData>(TxConfirmDialogComponent, {
          data: { txHash: txHash, msg: 'Successfully delete your vault.' },
        })
        .closed.toPromise();
      this.router.navigate(['yield-aggregator']);
    }
  }

  async transferVaultOwnership(vaultId: string, recipientAddress: string) {
    const prerequisiteData = await this.txCommonApplication.getPrerequisiteData();
    if (!prerequisiteData) {
      return;
    }
    const { address, publicKey, account, currentCosmosWallet, minimumGasPrice } = prerequisiteData;

    const msg = this.yieldAggregatorService.buildMsgTransferVaultOwnership(
      address,
      vaultId,
      recipientAddress,
    );

    const simulationResult = await this.txCommonApplication.simulate(
      msg,
      publicKey,
      account,
      minimumGasPrice,
    );
    if (!simulationResult) {
      return;
    }
    const { gas, fee } = simulationResult;

    if (!(await this.txCommonApplication.confirmFeeIfUnUniFiWallet(currentCosmosWallet, fee))) {
      return;
    }

    const txHash = await this.txCommonApplication.broadcast(
      msg,
      currentCosmosWallet,
      publicKey,
      account,
      gas,
      fee,
    );
    if (!txHash) {
      return;
    }

    if (txHash) {
      await this.dialog
        .open<TxConfirmDialogData>(TxConfirmDialogComponent, {
          data: { txHash: txHash, msg: 'Successfully delete your vault.' },
        })
        .closed.toPromise();
      this.router.navigate(['yield-aggregator']);
    }
  }
}
