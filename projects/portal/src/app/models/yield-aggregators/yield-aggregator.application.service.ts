import { ExternalTxConfirmDialogComponent } from '../../views/dialogs/txs/external-tx-confirm/external-tx-confirm-dialog.component';
import {
  TxConfirmDialogComponent,
  TxConfirmDialogData,
} from '../../views/dialogs/txs/tx-confirm/tx-confirm-dialog.component';
import { TxCommonApplicationService } from '../cosmos/tx-common.application.service';
import { EthersService } from '../ethers/ethers.service';
import { ExternalCosmosSdkService } from '../external-cosmos/external-cosmos-sdk.service';
import { ExternalCosmosApplicationService } from '../external-cosmos/external-cosmos.application.service';
import { IbcService } from '../ibc/ibc.service';
import { WalletType } from '../wallets/wallet.model';
import { DepositToVaultMsg } from './YieldaggregatorAdapter.types';
import { DepositToVaultFromEvmArg } from './yield-aggregator.model';
import { YieldAggregatorService } from './yield-aggregator.service';
import { Dialog } from '@angular/cdk/dialog';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import cosmosclient from '@cosmos-client/core';

@Injectable({
  providedIn: 'root',
})
export class YieldAggregatorApplicationService {
  // todo enter contract address
  ununifiContractAddress = 'ununifi1v6qjx5smfdxnh5gr8vprswl60rstyprj3wh4gz5mg7gcl7mtl5xqd9l8a9';
  neutronAddress = 'neutron155u042u8wk3al32h3vzxu989jj76k4zcwg0u68';

  constructor(
    private readonly router: Router,
    private readonly yieldAggregatorService: YieldAggregatorService,
    private readonly txCommonApplication: TxCommonApplicationService,
    private readonly externalCosmosSdkService: ExternalCosmosSdkService,
    private readonly externalCosmosApp: ExternalCosmosApplicationService,
    private readonly ibcService: IbcService,
    private readonly ethersService: EthersService,
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
    externalChainName: string,
    externalAddress: string,
    externalDenom: string,
    denom: string,
    readableAmount: number,
    walletType: WalletType,
    pubKey: Uint8Array,
  ) {
    const prerequisiteData = await this.txCommonApplication.getPrerequisiteData();
    if (!prerequisiteData) {
      return;
    }
    const { address } = prerequisiteData;

    const chain = await this.externalCosmosSdkService.chainInfo(externalChainName);
    if (!chain?.iyaSourceChannel || !chain?.iyaSourcePort) {
      alert('No chain info for ' + externalChainName);
      return;
    }
    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
    const timestamp = oneHourLater.getTime() * Math.pow(10, 6);
    // todo
    const memo: { wasm: { deposit_to_vault: DepositToVaultMsg } } = {
      wasm: {
        deposit_to_vault: {
          depositor: address,
          swap_output_denom: denom,
          vault_id: parseInt(vaultId),
        },
      },
    };
    const msg = this.ibcService.buildMsgTransfer(
      chain.iyaSourcePort,
      chain.iyaSourceChannel,
      externalAddress,
      this.ununifiContractAddress,
      memo,
      timestamp,
      undefined,
      { readableAmount: readableAmount, denom: externalDenom },
    );

    const txHash = await this.externalCosmosApp.broadcast(
      externalChainName,
      externalAddress,
      walletType,
      msg,
      pubKey,
    );
    if (!txHash) {
      return;
    }

    await this.dialog
      .open<TxConfirmDialogData>(ExternalTxConfirmDialogComponent, {
        data: { txHash: txHash, msg: 'Sent the Deposit to vault request to ' + externalChainName },
      })
      .closed.toPromise();
    location.reload();
  }

  async depositToVaultFromEvm(
    vaultId: string,
    externalChainName: string,
    erc20Symbol: string,
    denom: string,
    readableAmount: number,
    externalAddress?: string,
  ) {
    const prerequisiteData = await this.txCommonApplication.getPrerequisiteData();
    if (!prerequisiteData) {
      return;
    }
    const { address } = prerequisiteData;

    const chain = await this.externalCosmosSdkService.chainInfo(externalChainName);
    if (!chain?.iyaContractAddress || !chain.iyaContractABI || !chain.iyaContractFunction) {
      return;
    }
    const arg: DepositToVaultFromEvmArg = {
      // destinationChain: 'ununifi',
      destinationChain: 'neutron',
      destinationAddress: this.neutronAddress,
      depositor: address,
      vaultDenom: denom,
      vaultId: vaultId,
      // erc20: erc20Symbol,
      erc20: 'aUSDC',
      amount: readableAmount,
    };
    const txHash = await this.ethersService.connectContract(
      chain.iyaContractAddress,
      chain.iyaContractABI,
      chain.iyaContractFunction,
      arg,
      externalAddress,
    );

    if (!txHash) {
      return;
    }
    await this.dialog
      .open<TxConfirmDialogData>(ExternalTxConfirmDialogComponent, {
        data: { txHash: txHash, msg: 'Sent the Deposit to vault request to ' + externalChainName },
      })
      .closed.toPromise();
    location.reload();
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
