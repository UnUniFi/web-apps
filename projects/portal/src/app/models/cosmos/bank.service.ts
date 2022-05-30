import { CosmosSDKService } from '../cosmos-sdk.service';
import { CosmosWallet } from '../wallets/wallet.model';
import { SimulatedTxResultResponse } from './tx-common.model';
import { TxCommonService } from './tx-common.service';
import { Injectable } from '@angular/core';
import { cosmosclient, proto } from '@cosmos-client/core';
import { InlineResponse20075 } from '@cosmos-client/core/esm/openapi';

@Injectable({
  providedIn: 'root',
})
export class BankService {
  constructor(
    private readonly cosmosSDK: CosmosSDKService,
    private readonly txCommonService: TxCommonService,
  ) {}

  async send(
    toAddress: string,
    amount: proto.cosmos.base.v1beta1.ICoin[],
    currentCosmosWallet: CosmosWallet,
    gas: proto.cosmos.base.v1beta1.ICoin,
    fee: proto.cosmos.base.v1beta1.ICoin,
    privateKey?: string,
  ): Promise<InlineResponse20075> {
    const cosmosPublicKey = currentCosmosWallet.public_key;
    const txBuilder = await this.buildSendTxBuilder(toAddress, amount, cosmosPublicKey, gas, fee);
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

  async simulateToSend(
    toAddress: string,
    amount: proto.cosmos.base.v1beta1.ICoin[],
    cosmosPublicKey: cosmosclient.PubKey,
    minimumGasPrice: proto.cosmos.base.v1beta1.ICoin,
    gasRatio: number,
  ): Promise<SimulatedTxResultResponse> {
    const dummyFee: proto.cosmos.base.v1beta1.ICoin = {
      denom: minimumGasPrice.denom,
      amount: '1',
    };
    const dummyGas: proto.cosmos.base.v1beta1.ICoin = {
      denom: minimumGasPrice.denom,
      amount: '1',
    };
    const simulatedTxBuilder = await this.buildSendTxBuilder(
      toAddress,
      amount,
      cosmosPublicKey,
      dummyGas,
      dummyFee,
    );
    return await this.txCommonService.simulateTx(simulatedTxBuilder, minimumGasPrice, gasRatio);
  }

  async buildSendTxBuilder(
    toAddress: string,
    amount: proto.cosmos.base.v1beta1.ICoin[],
    cosmosPublicKey: cosmosclient.PubKey,
    gas: proto.cosmos.base.v1beta1.ICoin,
    fee: proto.cosmos.base.v1beta1.ICoin,
  ): Promise<cosmosclient.TxBuilder> {
    const baseAccount = await this.txCommonService.getBaseAccount(cosmosPublicKey);
    if (!baseAccount) {
      throw Error('Unused Account or Unsupported Account Type!');
    }
    const fromAddress = cosmosclient.AccAddress.fromPublicKey(cosmosPublicKey);
    // remove unintentional whitespace
    const toAddressWithNoWhitespace = toAddress.replace(/\s+/g, '');

    const msgSend = this.buildMsgSend(fromAddress.toString(), toAddressWithNoWhitespace, amount);

    // build tx
    const txBuilder = await this.txCommonService.buildTxBuilder(
      [msgSend],
      cosmosPublicKey,
      baseAccount,
      gas,
      fee,
    );

    return txBuilder;
  }

  buildMsgSend(
    fromAddress: string,
    toAddress: string,
    amount: proto.cosmos.base.v1beta1.ICoin[],
  ): proto.cosmos.bank.v1beta1.MsgSend {
    const msgSend = new proto.cosmos.bank.v1beta1.MsgSend({
      from_address: fromAddress,
      to_address: toAddress,
      amount,
    });
    return msgSend;
  }
}
