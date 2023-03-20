import { SimulatedTxResultResponse } from '../cosmos/tx-common.model';
import { TxCommonService } from '../cosmos/tx-common.service';
import { CosmosWallet } from '../wallets/wallet.model';
import { IAuctionInfrastructure } from './auction.service';
import { Injectable } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import { BroadcastTx200Response } from '@cosmos-client/core/esm/openapi';
import Long from 'long';
import ununifi from 'ununifi-client';

@Injectable({
  providedIn: 'root',
})
export class AuctionInfrastructureService implements IAuctionInfrastructure {
  constructor(private readonly txCommonService: TxCommonService) {}

  async placeBid(
    auctionID: number,
    amount: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    currentCosmosWallet: CosmosWallet,
    gas: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    fee: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    privateKey?: string,
  ): Promise<BroadcastTx200Response> {
    const cosmosPublicKey = currentCosmosWallet.public_key;
    const txBuilder = await this.buildPlaceBidTxBuilder(
      auctionID,
      amount,
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

  async simulateToPlaceBid(
    auctionID: number,
    amount: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
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
    amount: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    cosmosPublicKey: cosmosclient.PubKey,
    gas: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
    fee: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
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
    amount: cosmosclient.proto.cosmos.base.v1beta1.ICoin,
  ): ununifi.proto.ununifi.auction.MsgPlaceBid {
    //Todo: make auction.MsgPlaceBid
    const msgPlaceBid: any = undefined;
    /*
    const msgPlaceBid = new ununifi.rest.auction.MsgPlaceBid({
      auction_id: Long.fromNumber(auctionID),
      bidder: bidder,
      amount: amount,
    }); */
    return msgPlaceBid;
  }
}
