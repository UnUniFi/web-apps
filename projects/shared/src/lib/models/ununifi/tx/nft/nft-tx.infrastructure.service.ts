import { CosmosSDKService } from '../../../cosmos-sdk/cosmos-sdk.service';
import { SimulatedTxResultResponse } from '../../../cosmos/tx/common/tx-common.model';
import { TxCommonService } from '../../../cosmos/tx/common/tx-common.service';
import { CosmosWallet } from '../../../wallets/wallet.model';
import { MsgListNftData } from './nft-tx.model';
import { INftTxInfrastructureService } from './nft-tx.service';
import { Injectable } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import { InlineResponse20050 } from '@cosmos-client/core/esm/openapi';

@Injectable({
  providedIn: 'root',
})
export class NftTxInfrastructureService implements INftTxInfrastructureService {
  constructor(
    private readonly cosmosSDK: CosmosSDKService,
    private readonly txCommonService: TxCommonService,
  ) { }

  // List NFT
  async listNft(
    msgListNftData: MsgListNftData,
    currentCosmosWallet: CosmosWallet,
    gas: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    fee: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    privateKey?: string,
  ): Promise<InlineResponse20050> {
    const cosmosPublicKey = currentCosmosWallet.public_key;
    const txBuilder = await this.buildListNftTxBuilder(msgListNftData, cosmosPublicKey, gas, fee);
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

  async simulateToListNft(
    msgListNftData: MsgListNftData,
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
    const simulatedTxBuilder = await this.buildListNftTxBuilder(
      msgListNftData,
      cosmosPublicKey,
      dummyGas,
      dummyFee,
    );
    return await this.txCommonService.simulateTx(simulatedTxBuilder, minimumGasPrice, gasRatio);
  }

  private async buildListNftTxBuilder(
    msgListNftData: MsgListNftData,
    cosmosPublicKey: cosmosclient.PubKey,
    gas: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    fee: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
  ): Promise<cosmosclient.TxBuilder> {
    const baseAccount = await this.txCommonService.getBaseAccount(cosmosPublicKey);
    if (!baseAccount) {
      throw Error('Unused Account or Unsupported Account Type!');
    }
    const fromAddress = cosmosclient.AccAddress.fromPublicKey(cosmosPublicKey);
    const msgListNft = this.buildMsgListNft(msgListNftData);

    const txBuilder = await this.txCommonService.buildTxBuilder(
      [msgListNft],
      cosmosPublicKey,
      baseAccount,
      gas,
      fee,
    );
    return txBuilder;
  }

  private buildMsgListNft(
    msgListNftData: MsgListNftData,
  ): cosmosclient.proto.cosmos.staking.v1beta1.MsgDelegate {
    // Todo: Currently dummy msgDelegate is created. Need to fix to ununifi.nftmarket.MsgListNft
    // Todo: After install new ununifi-client version, enable following implementation and remove current implementation.
    // const msgListNft = new ununifi.nftmarket.MsgListNft(msgListNftData);
    const msgListNft = new cosmosclient.proto.cosmos.staking.v1beta1.MsgDelegate({
      delegator_address: '',
      validator_address: '',
      amount: {
        denom: 'uguu',
        amount: '1',
      },
    });
    return msgListNft;
  }
}
