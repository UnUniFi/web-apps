import { SimulatedTxResultResponse } from '../../../cosmos/tx/common/tx-common.model';
import { CosmosWallet } from '../../../wallets/wallet.model';
import { NftTxInfrastructureService } from './nft-tx.infrastructure.service';
import { MsgListNftData } from './nft-tx.model';
import { Injectable } from '@angular/core';
import { cosmosclient, proto } from '@cosmos-client/core';
import { InlineResponse20050 } from '@cosmos-client/core/esm/openapi';

export interface INftTxInfrastructureService {
  simulateToListNft(
    msgListNftData: MsgListNftData,
    cosmosPublicKey: cosmosclient.PubKey,
    minimumGasPrice: proto.cosmos.base.v1beta1.ICoin,
    gasRatio: number,
  ): Promise<SimulatedTxResultResponse>;

  listNft(
    msgListNftData: MsgListNftData,
    currentCosmosWallet: CosmosWallet,
    gas: proto.cosmos.base.v1beta1.ICoin,
    fee: proto.cosmos.base.v1beta1.ICoin,
    privateKey?: string,
  ): Promise<InlineResponse20050>;
}

@Injectable({
  providedIn: 'root',
})
export class NftTxService {
  private iNftTxInfrastructureService: INftTxInfrastructureService;

  constructor(private readonly nftTxInfrastructureService: NftTxInfrastructureService) {
    this.iNftTxInfrastructureService = this.nftTxInfrastructureService;
  }

  // List Nft
  async listNft(
    msgListNftData: MsgListNftData,
    currentCosmosWallet: CosmosWallet,
    gas: proto.cosmos.base.v1beta1.ICoin,
    fee: proto.cosmos.base.v1beta1.ICoin,
    privateKey?: string,
  ): Promise<InlineResponse20050> {
    return this.iNftTxInfrastructureService.listNft(
      msgListNftData,
      currentCosmosWallet,
      gas,
      fee,
      privateKey,
    );
  }

  async simulateToListNft(
    msgListNftData: MsgListNftData,
    cosmosPublicKey: cosmosclient.PubKey,
    minimumGasPrice: proto.cosmos.base.v1beta1.ICoin,
    gasRatio: number,
  ): Promise<SimulatedTxResultResponse> {
    return await this.iNftTxInfrastructureService.simulateToListNft(
      msgListNftData,
      cosmosPublicKey,
      minimumGasPrice,
      gasRatio,
    );
  }
}
