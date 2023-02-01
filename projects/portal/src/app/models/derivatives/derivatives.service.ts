import { CosmosSDKService } from '../cosmos-sdk.service';
import { SimulatedTxResultResponse } from '../cosmos/tx-common.model';
import { TxCommonService } from '../cosmos/tx-common.service';
import { KeyService } from '../keys/key.service';
import { CosmosWallet } from '../wallets/wallet.model';
import { Injectable } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import { BroadcastTx200Response } from '@cosmos-client/core/esm/openapi';
import ununificlient from 'ununifi-client';

@Injectable({
  providedIn: 'root',
})
export class DerivativesService {
  constructor(
    private readonly cosmosSDK: CosmosSDKService,
    private readonly key: KeyService,
    private readonly txCommonService: TxCommonService,
  ) {}

  // register incentive token
  async register(
    incentiveUnitId: string,
    subjectAddresses: string[],
    weights: string[],
    currentCosmosWallet: CosmosWallet,
    gas: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    fee: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    privateKey?: string,
  ): Promise<BroadcastTx200Response> {
    const cosmosPublicKey = currentCosmosWallet.public_key;
    const txBuilder = await this.buildRegisterTxBuilder(
      incentiveUnitId,
      subjectAddresses,
      weights,
      cosmosPublicKey,
      gas,
      fee,
    );
    const signerBaseAccount = await this.txCommonService.getBaseAccount(cosmosPublicKey);
    if (!signerBaseAccount) {
      throw Error('Unsupported Account!');
    }
    const signedTxBuilder = await this.txCommonService.signTx(
      txBuilder,
      signerBaseAccount,
      currentCosmosWallet,
      privateKey,
    );
    if (!signedTxBuilder) {
      throw Error('Failed to sign!');
    }
    const txResult = await this.txCommonService.announceTx(signedTxBuilder);
    return txResult;
  }

  async simulateToRegister(
    incentiveUnitId: string,
    subjectAddresses: string[],
    weight: string[],
    cosmosPublicKey: cosmosclient.PubKey,
    minimumGasPrice: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    gasRatio: number,
  ): Promise<SimulatedTxResultResponse> {
    const dummyFee: cosmosclient.proto.cosmos.base.v1beta1.ICoin = {
      denom: minimumGasPrice.denom,
      amount: '1',
    };
    const dummyGas: cosmosclient.proto.cosmos.base.v1beta1.ICoin = {
      denom: minimumGasPrice.denom,
      amount: '1',
    };
    const simulatedTxBuilder = await this.buildRegisterTxBuilder(
      incentiveUnitId,
      subjectAddresses,
      weight,
      cosmosPublicKey,
      dummyGas,
      dummyFee,
    );
    return await this.txCommonService.simulateTx(simulatedTxBuilder, minimumGasPrice, gasRatio);
  }

  async buildRegisterTxBuilder(
    incentiveUnitId: string,
    subjectAddresses: string[],
    weights: string[],
    cosmosPublicKey: cosmosclient.PubKey,
    gas: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    fee: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
  ): Promise<cosmosclient.TxBuilder> {
    const baseAccount = await this.txCommonService.getBaseAccount(cosmosPublicKey);
    if (!baseAccount) {
      throw Error('Unused Account or Unsupported Account Type!');
    }
    const senderAddress = cosmosclient.AccAddress.fromPublicKey(cosmosPublicKey);
    const msgRegister = this.buildMsgRegister(
      senderAddress.toString(),
      incentiveUnitId,
      subjectAddresses,
      weights,
    );

    const txBuilder = await this.txCommonService.buildTxBuilder(
      [msgRegister],
      cosmosPublicKey,
      baseAccount,
      gas,
      fee,
    );
    return txBuilder;
  }

  buildMsgRegister(
    senderAddress: string,
    incentiveUnitId: string,
    subjectAddresses: string[],
    weights: string[],
  ): ununificlient.proto.ununifi.ecosystemincentive.MsgRegister {
    const msgRegister = new ununificlient.proto.ununifi.ecosystemincentive.MsgRegister({
      sender: senderAddress,
      incentive_unit_id: incentiveUnitId,
      subject_addrs: subjectAddresses,
      weights: weights,
    });
    return msgRegister;
  }

  // withdraw reward
  async withdrawReward(
    denom: string,
    currentCosmosWallet: CosmosWallet,
    gas: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    fee: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    privateKey?: string,
  ): Promise<BroadcastTx200Response> {
    const cosmosPublicKey = currentCosmosWallet.public_key;
    const txBuilder = await this.buildWithdrawRewardTxBuilder(denom, cosmosPublicKey, gas, fee);
    const signerBaseAccount = await this.txCommonService.getBaseAccount(cosmosPublicKey);
    if (!signerBaseAccount) {
      throw Error('Unsupported Account!');
    }
    const signedTxBuilder = await this.txCommonService.signTx(
      txBuilder,
      signerBaseAccount,
      currentCosmosWallet,
      privateKey,
    );
    if (!signedTxBuilder) {
      throw Error('Failed to sign!');
    }
    const txResult = await this.txCommonService.announceTx(signedTxBuilder);
    return txResult;
  }

  async simulateToWithdrawReward(
    denom: string,
    cosmosPublicKey: cosmosclient.PubKey,
    minimumGasPrice: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    gasRatio: number,
  ): Promise<SimulatedTxResultResponse> {
    const dummyFee: cosmosclient.proto.cosmos.base.v1beta1.ICoin = {
      denom: minimumGasPrice.denom,
      amount: '1',
    };
    const dummyGas: cosmosclient.proto.cosmos.base.v1beta1.ICoin = {
      denom: minimumGasPrice.denom,
      amount: '1',
    };
    const simulatedTxBuilder = await this.buildWithdrawRewardTxBuilder(
      denom,
      cosmosPublicKey,
      dummyGas,
      dummyFee,
    );
    return await this.txCommonService.simulateTx(simulatedTxBuilder, minimumGasPrice, gasRatio);
  }

  async buildWithdrawRewardTxBuilder(
    denom: string,
    cosmosPublicKey: cosmosclient.PubKey,
    gas: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    fee: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
  ): Promise<cosmosclient.TxBuilder> {
    const baseAccount = await this.txCommonService.getBaseAccount(cosmosPublicKey);
    if (!baseAccount) {
      throw Error('Unused Account or Unsupported Account Type!');
    }
    const senderAddress = cosmosclient.AccAddress.fromPublicKey(cosmosPublicKey);
    const msgWithdrawReward = this.buildWithdrawReward(senderAddress.toString(), denom);

    const txBuilder = await this.txCommonService.buildTxBuilder(
      [msgWithdrawReward],
      cosmosPublicKey,
      baseAccount,
      gas,
      fee,
    );
    return txBuilder;
  }

  buildWithdrawReward(
    senderAddress: string,
    denom: string,
  ): ununificlient.proto.ununifi.ecosystemincentive.MsgWithdrawReward {
    const msgWithdrawReward = new ununificlient.proto.ununifi.ecosystemincentive.MsgWithdrawReward({
      sender: senderAddress,
      denom: denom,
    });
    return msgWithdrawReward;
  }

  // withdraw all rewards
  async withdrawAllRewards(
    currentCosmosWallet: CosmosWallet,
    gas: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    fee: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    privateKey?: string,
  ): Promise<BroadcastTx200Response> {
    const cosmosPublicKey = currentCosmosWallet.public_key;
    const txBuilder = await this.buildWithdrawAllRewardsTxBuilder(cosmosPublicKey, gas, fee);
    const signerBaseAccount = await this.txCommonService.getBaseAccount(cosmosPublicKey);
    if (!signerBaseAccount) {
      throw Error('Unsupported Account!');
    }
    const signedTxBuilder = await this.txCommonService.signTx(
      txBuilder,
      signerBaseAccount,
      currentCosmosWallet,
      privateKey,
    );
    if (!signedTxBuilder) {
      throw Error('Failed to sign!');
    }
    const txResult = await this.txCommonService.announceTx(signedTxBuilder);
    return txResult;
  }

  async simulateToWithdrawAllRewards(
    cosmosPublicKey: cosmosclient.PubKey,
    minimumGasPrice: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    gasRatio: number,
  ): Promise<SimulatedTxResultResponse> {
    const dummyFee: cosmosclient.proto.cosmos.base.v1beta1.ICoin = {
      denom: minimumGasPrice.denom,
      amount: '1',
    };
    const dummyGas: cosmosclient.proto.cosmos.base.v1beta1.ICoin = {
      denom: minimumGasPrice.denom,
      amount: '1',
    };
    const simulatedTxBuilder = await this.buildWithdrawAllRewardsTxBuilder(
      cosmosPublicKey,
      dummyGas,
      dummyFee,
    );
    return await this.txCommonService.simulateTx(simulatedTxBuilder, minimumGasPrice, gasRatio);
  }

  async buildWithdrawAllRewardsTxBuilder(
    cosmosPublicKey: cosmosclient.PubKey,
    gas: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    fee: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
  ): Promise<cosmosclient.TxBuilder> {
    const baseAccount = await this.txCommonService.getBaseAccount(cosmosPublicKey);
    if (!baseAccount) {
      throw Error('Unused Account or Unsupported Account Type!');
    }
    const senderAddress = cosmosclient.AccAddress.fromPublicKey(cosmosPublicKey);
    const msgWithdrawAllRewards = this.buildWithdrawAllRewards(senderAddress.toString());

    const txBuilder = await this.txCommonService.buildTxBuilder(
      [msgWithdrawAllRewards],
      cosmosPublicKey,
      baseAccount,
      gas,
      fee,
    );
    return txBuilder;
  }

  buildWithdrawAllRewards(
    senderAddress: string,
  ): ununificlient.proto.ununifi.ecosystemincentive.MsgWithdrawAllRewards {
    const msgWithdrawAllRewards =
      new ununificlient.proto.ununifi.ecosystemincentive.MsgWithdrawAllRewards({
        sender: senderAddress,
      });
    return msgWithdrawAllRewards;
  }
}
