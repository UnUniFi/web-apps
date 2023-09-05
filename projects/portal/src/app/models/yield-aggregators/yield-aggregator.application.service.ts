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
import cosmosclient from '@cosmos-client/core';
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

  async depositToVault(vaultId: string, denom: string, amount: number) {
    const prerequisiteData = await this.txCommonApplication.getPrerequisiteData();
    if (!prerequisiteData) {
      return;
    }
    const { address, publicKey, account, currentCosmosWallet, minimumGasPrice } = prerequisiteData;

    const msg = this.yieldAggregatorService.buildMsgDepositToVault(address, vaultId, denom, amount);

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
        data: { txHash: txHash, msg: 'Deposit to the vault was successful.' },
      })
      .closed.toPromise();
    location.reload();
  }

  async depositToVaultFromCosmos(
    vaultId: string,
    externalChainId: string,
    externalAddress: string,
    externalDenom: string,
    denom: string,
    amount: number,
  ) {
    //todo
  }

  async depositToVaultFromEvm(
    vaultId: string,
    externalChainId: string,
    externalAddress: string,
    externalDenom: string,
    denom: string,
    amount: number,
  ) {
    //todo
  }

  async withdrawFromVault(vaultId: string, denom: string, amount: number) {
    const prerequisiteData = await this.txCommonApplication.getPrerequisiteData();
    if (!prerequisiteData) {
      return;
    }
    const { address, publicKey, account, currentCosmosWallet, minimumGasPrice } = prerequisiteData;

    const msg = this.yieldAggregatorService.buildMsgWithdrawFromVault(
      address,
      vaultId,
      denom,
      amount,
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
          data: { txHash: txHash, msg: 'Successfully withdraw from the vault.' },
        })
        .closed.toPromise();
      location.reload();
    }
  }

  async createVault(
    name: string,
    denom: string,
    description: string,
    strategies: { id: string; weight: number }[],
    commissionRate: number,
    reserveRate: number,
    fee: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    deposit: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    feeCollectorAddress: string,
  ) {
    const prerequisiteData = await this.txCommonApplication.getPrerequisiteData();
    if (!prerequisiteData) {
      return;
    }
    const { address, publicKey, account, currentCosmosWallet, minimumGasPrice } = prerequisiteData;

    const msg = this.yieldAggregatorService.buildMsgCreateVault(
      address,
      denom,
      name,
      description,
      strategies,
      commissionRate,
      reserveRate,
      fee,
      deposit,
      feeCollectorAddress,
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
      this.router.navigate(['yield-aggregator', 'vaults']);
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
      this.router.navigate(['yield-aggregator', 'vaults']);
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
      this.router.navigate(['yield-aggregator', 'vaults']);
    }
  }
}
