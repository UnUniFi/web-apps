import { SimulatedTxResultResponse } from '../cosmos/tx-common.model';
import { TxCommonService } from '../cosmos/tx-common.service';
import { CosmosWallet } from '../wallets/wallet.model';
import { IAuctionInfrastructure } from './auction.service';
import { Injectable } from '@angular/core';
import { cosmosclient, proto } from '@cosmos-client/core';
import { InlineResponse20075 } from '@cosmos-client/core/esm/openapi';
import { ununifi } from 'ununifi-client';

@Injectable({
  providedIn: 'root',
})
export class AuctionInfrastructureService implements IAuctionInfrastructure {
  constructor(private readonly txCommonService: TxCommonService) {}

  async placeBid(
    auctionID: number,
    amount: proto.cosmos.base.v1beta1.ICoin,
    currentCosmosWallet: CosmosWallet,
    gas: proto.cosmos.base.v1beta1.ICoin,
    fee: proto.cosmos.base.v1beta1.ICoin,
  ): Promise<InlineResponse20075> {
    const cosmosPublicKey = currentCosmosWallet.public_key;
    const txBuilder = await this.buildPlaceBidTxBuilder(
      auctionID,
      amount,
      cosmosPublicKey,
      gas,
      fee,
    );
    return await this.txCommonService.announceTx(txBuilder);
  }

  async simulateToPlaceBid(
    auctionID: number,
    amount: proto.cosmos.base.v1beta1.ICoin,
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
    const SimulatedTxBuilder = await this.buildPlaceBidTxBuilder(
      auctionID,
      amount,
      cosmosPublicKey,
      dummyGas,
      dummyFee,
    );
    return await this.txCommonService.simulateTx(SimulatedTxBuilder, minimumGasPrice, gasRatio);
  }

  async buildPlaceBidTxBuilder(
    auctionID: number,
    amount: proto.cosmos.base.v1beta1.ICoin,
    cosmosPublicKey: cosmosclient.PubKey,
    gas: proto.cosmos.base.v1beta1.ICoin,
    fee: proto.cosmos.base.v1beta1.ICoin,
  ): Promise<cosmosclient.TxBuilder> {
    const baseAccount = await this.txCommonService.getBaseAccount(cosmosPublicKey);
    if (!baseAccount) {
      throw Error('Unused Account or Unsupported Account Type!');
    }
    const bidder = cosmosclient.AccAddress.fromPublicKey(cosmosPublicKey);

    // build tx
    const msgPlaceBid = this.buildMsgPlaceBid(auctionID, bidder.toString(), amount);
    const txBuilder = await this.txCommonService.buildTxBuilder(
      [msgPlaceBid],
      cosmosPublicKey,
      baseAccount,
      gas,
      fee,
    );
    return txBuilder;
  }
  buildMsgPlaceBid(
    auctionID: number,
    bidder: string,
    amount: proto.cosmos.base.v1beta1.ICoin,
  ): ununifi.auction.MsgPlaceBid {
    const msgPlaceBid = new ununifi.auction.MsgPlaceBid({
      auction_id: cosmosclient.Long.fromNumber(auctionID),
      bidder: bidder,
      amount: amount,
    });
    return msgPlaceBid;
  }
}
