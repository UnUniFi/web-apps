import { ExternalTxConfirmDialogComponent } from '../../views/dialogs/txs/external-tx-confirm/external-tx-confirm-dialog.component';
import {
  TxConfirmDialogComponent,
  TxConfirmDialogData,
} from '../../views/dialogs/txs/tx-confirm/tx-confirm-dialog.component';
import { Config, ConfigService } from '../config.service';
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
import { first, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class YieldAggregatorApplicationService {
  constructor(
    private readonly router: Router,
    private readonly yieldAggregatorService: YieldAggregatorService,
    private readonly txCommonApplication: TxCommonApplicationService,
    private readonly externalCosmosSdkService: ExternalCosmosSdkService,
    private readonly externalCosmosApp: ExternalCosmosApplicationService,
    private readonly ibcService: IbcService,
    private readonly ethersService: EthersService,
    private readonly configS: ConfigService,
    private readonly dialog: Dialog,
  ) {}

  async getConfig(): Promise<Config | undefined> {
    const config$ = this.configS.config$.pipe(map((config) => config));
    return config$.pipe(first()).toPromise();
  }

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
    readableAmount: number,
    walletType: WalletType,
    pubKey: Uint8Array,
  ) {
    const prerequisiteData = await this.txCommonApplication.getPrerequisiteData();
    if (!prerequisiteData) {
      return;
    }
    const { address } = prerequisiteData;

    const config = await this.getConfig();
    if (!config) {
      alert('Invalid UnUniFi config');
      return;
    }
    const contract = config.yieldAggregatorContractAddress;
    if (!contract) {
      alert('No contract address for yield aggregator on ' + config.chainID);
      return;
    }

    const chain = config?.externalChains.find((chain) => chain.chainId === externalChainId);
    if (!chain?.ibcSourcePort || !chain.ibcSourceChannel || !chain.availableTokens) {
      alert('No chain info for ' + externalChainId);
      return;
    }
    const token = chain.availableTokens.find((token) => token.denom === externalDenom);
    if (!token) {
      alert('Not certified for ' + externalDenom);
      return;
    }

    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
    const timestamp = oneHourLater.getTime() * Math.pow(10, 6);
    const memo: { wasm: { contract: string; msg: { deposit_to_vault: DepositToVaultMsg } } } = {
      wasm: {
        contract: contract,
        msg: {
          deposit_to_vault: {
            depositor: address,
            vault_id: vaultId,
          },
        },
      },
    };
    const msg = this.ibcService.buildMsgTransfer(
      chain.ibcSourcePort,
      chain.ibcSourceChannel,
      externalAddress,
      contract,
      memo,
      timestamp,
      undefined,
      { amount: (readableAmount * Math.pow(10, token.decimal)).toString(), denom: externalDenom },
    );
    console.log('MsgTransfer', msg);

    const txHash = await this.externalCosmosApp.broadcast(
      externalChainId,
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
        data: { txHash: txHash, msg: 'Sent the Deposit to vault request to ' + externalChainId },
      })
      .closed.toPromise();
    location.reload();
  }

  async depositToVaultFromEvm(
    vaultId: string,
    externalChainName: string,
    erc20Symbol: string,
    readableAmount: number,
    externalAddress?: string,
  ) {
    const prerequisiteData = await this.txCommonApplication.getPrerequisiteData();
    if (!prerequisiteData) {
      return;
    }
    const { address } = prerequisiteData;
    const config = await this.getConfig();
    if (!config) {
      alert('Invalid UnUniFi config');
      return;
    }
    const contract = config.yieldAggregatorContractAddress;
    if (!contract) {
      alert('No contract address for yield aggregator on ' + config.chainID);
      return;
    }

    const chain = config?.externalChains.find((chain) => chain.chainName === externalChainName);
    if (!chain?.yieldAggregatorContractAddress || !chain.availableTokens) {
      alert('No chain info for ' + externalChainName);
      return;
    }
    const erc20 = chain.availableTokens.find((token) => token.symbol === erc20Symbol);
    if (!erc20) {
      alert('Not certified for ' + erc20Symbol);
      return;
    }
    const arg: DepositToVaultFromEvmArg = {
      destinationChain: 'ununifi',
      // destinationChain: 'neutron',
      destinationAddress: contract,
      depositor: address,
      vaultId: vaultId,
      erc20: erc20Symbol,
      amount: readableAmount * Math.pow(10, erc20.decimal || 6),
    };
    const txHash = await this.ethersService.depositToVault(
      externalChainName,
      chain.yieldAggregatorContractAddress,
      erc20.contractAddress,
      arg,
      externalAddress,
    );

    if (!txHash) {
      console.log("txHash doesn't exist");
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
