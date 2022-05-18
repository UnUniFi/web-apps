import { SimulatedTxResultResponse } from '../cosmos/tx-common.model';
import { CosmosWallet } from '../wallets/wallet.model';
import { AuctionInfrastructureService } from './auction.infrastructure.service';
import { Injectable } from '@angular/core';
import { cosmosclient, proto } from '@cosmos-client/core';
import { InlineResponse20075 } from '@cosmos-client/core/esm/openapi';

export interface IAuctionInfrastructure {
  placeBid(
    auctionID: number,
    amount: proto.cosmos.base.v1beta1.ICoin,
    currentCosmosWallet: CosmosWallet,
    gas: proto.cosmos.base.v1beta1.ICoin,
    fee: proto.cosmos.base.v1beta1.ICoin,
  ): Promise<InlineResponse20075>;

  simulateToPlaceBid(
    auction_id: number,
    amount: proto.cosmos.base.v1beta1.ICoin,
    cosmosPublicKey: cosmosclient.PubKey,
    minimumGasPrice: proto.cosmos.base.v1beta1.ICoin,
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
    amount: proto.cosmos.base.v1beta1.ICoin,
    currentCosmosWallet: CosmosWallet,
    gas: proto.cosmos.base.v1beta1.ICoin,
    fee: proto.cosmos.base.v1beta1.ICoin,
  ): Promise<InlineResponse20075> {
    return this.iAuctionInfrastructure.placeBid(auctionID, amount, currentCosmosWallet, gas, fee);
  }

  simulateToPlaceBid(
    auctionID: number,
    amount: proto.cosmos.base.v1beta1.ICoin,
    cosmosPublicKey: cosmosclient.PubKey,
    minimumGasPrice: proto.cosmos.base.v1beta1.ICoin,
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
