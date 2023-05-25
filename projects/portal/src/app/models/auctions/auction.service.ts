import { SimulatedTxResultResponse } from '../cosmos/tx-common.model';
import { CosmosWallet } from '../wallets/wallet.model';
import { AuctionInfrastructureService } from './auction.infrastructure.service';
import { Injectable } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import { BroadcastTx200Response } from '@cosmos-client/core/esm/openapi';

export interface IAuctionInfrastructure {
  placeBid(
    auctionID: number,
    amount: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    currentCosmosWallet: CosmosWallet,
    gas: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    fee: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
  ): Promise<BroadcastTx200Response>;

  simulateToPlaceBid(
    auction_id: number,
    amount: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    cosmosPublicKey: cosmosclient.PubKey,
    minimumGasPrice: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    gasRatio: number,
  ): Promise<SimulatedTxResultResponse>;
}

@Injectable({
  providedIn: 'root',
})
export class AuctionService {
  private readonly iAuctionInfrastructure: IAuctionInfrastructure;
  constructor(readonly auctionInfrastructure: AuctionInfrastructureService) {
    this.iAuctionInfrastructure = auctionInfrastructure;
  }

  placeBid(
    auctionID: number,
    amount: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    currentCosmosWallet: CosmosWallet,
    gas: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    fee: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
  ): Promise<BroadcastTx200Response> {
    return this.iAuctionInfrastructure.placeBid(auctionID, amount, currentCosmosWallet, gas, fee);
  }

  simulateToPlaceBid(
    auctionID: number,
    amount: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    cosmosPublicKey: cosmosclient.PubKey,
    minimumGasPrice: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    gasRatio: number,
  ): Promise<SimulatedTxResultResponse> {
    return this.iAuctionInfrastructure.simulateToPlaceBid(
      auctionID,
      amount,
      cosmosPublicKey,
      minimumGasPrice,
      gasRatio,
    );
  }
}
