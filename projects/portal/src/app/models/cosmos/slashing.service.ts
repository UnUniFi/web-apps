import { CosmosWallet } from '../wallets/wallet.model';
import { SimulatedTxResultResponse } from './tx-common.model';
import { TxCommonService } from './tx-common.service';
import { Injectable } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import { InlineResponse20050 } from '@cosmos-client/core/esm/openapi';

@Injectable({
  providedIn: 'root',
})
export class SlashingService {
  constructor(private readonly txCommonService: TxCommonService) { }

  async unjail(
    validatorAddress: string,
    currentCosmosWallet: CosmosWallet,
    gas: cosmosclient.proto.cosmos.base.v1beta1.ICoin | undefined,
    fee: cosmosclient.proto.cosmos.base.v1beta1.ICoin | undefined,
    privateKey?: string,
  ): Promise<InlineResponse20050 | undefined> {
    const cosmosPublicKey = currentCosmosWallet.public_key;
    const txBuilder = await this.buildUnjailTxBuilder(validatorAddress, cosmosPublicKey, gas, fee);
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

  async simulateToUnjail(
    validatorAddress: string,
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
    const simulatedTxBuilder = await this.buildUnjailTxBuilder(
      validatorAddress,
      cosmosPublicKey,
      dummyGas,
      dummyFee,
    );
    return await this.txCommonService.simulateTx(simulatedTxBuilder, minimumGasPrice, gasRatio);
  }

  async buildUnjailTxBuilder(
    validatorAddress: string,
    cosmosPublicKey: cosmosclient.PubKey,
    gas: cosmosclient.proto.cosmos.base.v1beta1.ICoin | null | undefined,
    fee: cosmosclient.proto.cosmos.base.v1beta1.ICoin | null | undefined,
  ): Promise<cosmosclient.TxBuilder> {
    const valAddress = cosmosclient.ValAddress.fromPublicKey(cosmosPublicKey);
    if (valAddress.toString() !== validatorAddress) {
      throw Error('Address mismatch!');
    }
    const baseAccount = await this.txCommonService.getBaseAccount(cosmosPublicKey);
    if (!baseAccount) {
      throw Error('Unused Account or Unsupported Account Type!');
    }
    const msgUnjail = this.buildMsgUnjail(validatorAddress);
    const txBuilder = await this.txCommonService.buildTxBuilder(
      [msgUnjail],
      cosmosPublicKey,
      baseAccount,
      gas,
      fee,
    );
    return txBuilder;
  }

  buildMsgUnjail(validatorAddress: string): cosmosclient.proto.cosmos.slashing.v1beta1.MsgUnjail {
    const msgUnjail = new cosmosclient.proto.cosmos.slashing.v1beta1.MsgUnjail({
      validator_addr: validatorAddress,
    });
    return msgUnjail;
  }
}
