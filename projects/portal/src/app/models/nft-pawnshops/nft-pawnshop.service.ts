import { CosmosSDKService } from '../cosmos-sdk.service';
import { BankService } from '../cosmos/bank.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import { Metadata } from 'projects/shared/src/lib/models/ununifi/query/nft/nft.model';
import ununificlient from 'ununifi-client';

@Injectable({
  providedIn: 'root',
})
export class NftPawnshopService {
  constructor(
    private readonly cosmosSDK: CosmosSDKService,
    private readonly bankService: BankService,
    private http: HttpClient,
  ) {}

  replaceIpfs(url: string): string {
    return url.replace('ipfs://', 'https://ununifi.mypinata.cloud/ipfs/');
  }

  async getMetadataFromUri(uri: string): Promise<Metadata> {
    const metadata = await this.http.get(uri).toPromise();
    return metadata;
  }

  async getImageFromUri(uri: string): Promise<string> {
    const replacedUri = this.replaceIpfs(uri);
    const metadata = await this.getMetadataFromUri(replacedUri);
    if (!metadata.image) {
      return '';
    }
    return this.replaceIpfs(metadata.image);
  }

  buildMsgListNft(
    senderAddress: string,
    classId: string,
    nftId: string,
    listingType: ununificlient.proto.ununifi.nftmarket.ListingType,
    bidSymbol: string,
    symbolMetadataMap: { [symbol: string]: cosmosclient.proto.cosmos.bank.v1beta1.IMetadata },
  ) {
    const bidDenom = symbolMetadataMap[bidSymbol].base;
    const msg = new ununificlient.proto.ununifi.nftmarket.MsgListNft({
      sender: senderAddress,
      nft_id: {
        class_id: classId,
        nft_id: nftId,
      },
      listing_type: listingType,
      bid_token: bidDenom,
      // TODO: check the remaining fields
    });

    return msg;
  }

  buildMsgCancelNftListing(senderAddress: string, classId: string, nftId: string) {
    const msg = new ununificlient.proto.ununifi.nftmarket.MsgCancelNftListing({
      sender: senderAddress,
      nft_id: {
        class_id: classId,
        nft_id: nftId,
      },
      // TODO: check the remaining fields
    });

    return msg;
  }

  buildMsgPlaceBid(
    senderAddress: string,
    classId: string,
    nftId: string,
    symbol: string,
    bidAmount: number,
    biddingPeriod: Date,
    lendingRate: number,
    automaticPayment: boolean,
    depositAmount: number,
    symbolMetadataMap: { [symbol: string]: cosmosclient.proto.cosmos.bank.v1beta1.IMetadata },
  ) {
    const bid = this.bankService.convertSymbolAmountMapToCoins(
      { [symbol]: bidAmount },
      symbolMetadataMap,
    )[0];
    const deposit = this.bankService.convertSymbolAmountMapToCoins(
      { [symbol]: depositAmount },
      symbolMetadataMap,
    )[0];

    const msg = new ununificlient.proto.ununifi.nftmarket.MsgPlaceBid({
      sender: senderAddress,
      nft_id: {
        class_id: classId,
        nft_id: nftId,
      },
      // TODO: check the remaining fields
    });

    return msg;
  }

  buildMsgCancelBid(senderAddress: string, classId: string, nftId: string) {
    const msg = new ununificlient.proto.ununifi.nftmarket.MsgCancelBid({
      sender: senderAddress,
      nft_id: {
        class_id: classId,
        nft_id: nftId,
      },
      // TODO: check the remaining fields
    });

    return msg;
  }

  buildMsgEndNftListing(senderAddress: string, classId: string, nftId: string) {
    const msg = new ununificlient.proto.ununifi.nftmarket.MsgEndNftListing({
      sender: senderAddress,
      nft_id: {
        class_id: classId,
        nft_id: nftId,
      },
      // TODO: check the remaining fields
    });

    return msg;
  }

  buildMsgSellingDecision(senderAddress: string, classId: string, nftId: string) {
    const msg = new ununificlient.proto.ununifi.nftmarket.MsgSellingDecision({
      sender: senderAddress,
      nft_id: {
        class_id: classId,
        nft_id: nftId,
      },
      // TODO: check the remaining fields
    });

    return msg;
  }

  buildMsgPayFullBid(senderAddress: string, classId: string, nftId: string) {
    const msg = new ununificlient.proto.ununifi.nftmarket.MsgPayFullBid({
      sender: senderAddress,
      nft_id: {
        class_id: classId,
        nft_id: nftId,
      },
      // TODO: check the remaining fields
    });

    return msg;
  }

  buildMsgBorrow(
    senderAddress: string,
    classId: string,
    nftId: string,
    symbol: string,
    amount: number,
    symbolMetadataMap: { [symbol: string]: cosmosclient.proto.cosmos.bank.v1beta1.IMetadata },
  ) {
    const coin = this.bankService.convertSymbolAmountMapToCoins(
      { [symbol]: amount },
      symbolMetadataMap,
    )[0];

    const msg = new ununificlient.proto.ununifi.nftmarket.MsgBorrow({
      sender: senderAddress,
      nft_id: {
        class_id: classId,
        nft_id: nftId,
      },
      amount: coin,
      // TODO: check the remaining fields
    });

    return msg;
  }

  buildMsgRepay(
    senderAddress: string,
    classId: string,
    nftId: string,
    symbol: string,
    amount: number,
    symbolMetadataMap: { [symbol: string]: cosmosclient.proto.cosmos.bank.v1beta1.IMetadata },
  ) {
    const coin = this.bankService.convertSymbolAmountMapToCoins(
      { [symbol]: amount },
      symbolMetadataMap,
    )[0];

    const msg = new ununificlient.proto.ununifi.nftmarket.MsgRepay({
      sender: senderAddress,
      nft_id: {
        class_id: classId,
        nft_id: nftId,
      },
      amount: coin,
      // TODO: check the remaining fields
    });

    return msg;
  }
}
