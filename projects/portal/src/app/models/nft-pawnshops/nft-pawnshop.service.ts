import { CosmosSDKService } from '../cosmos-sdk.service';
import { BankService } from '../cosmos/bank.service';
import { Nfts } from './nft-pawnshop.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import { Metadata } from 'projects/shared/src/lib/models/ununifi/query/nft/nft.model';
import ununificlient from 'ununifi-client';
import { ListedClass200Response } from 'ununifi-client/esm/openapi';

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
    const replacedUri = this.replaceIpfs(uri);
    const metadata = await this.http.get(replacedUri).toPromise();
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

  convertDateToTimestamp(date: Date) {
    const millisecond = date.getTime();
    return ununificlient.proto.google.protobuf.Timestamp.fromObject({
      seconds: millisecond / 1000,
      nanos: (millisecond % 1000) * 1e6,
    });
  }

  async listNftImages(data: ListedClass200Response | Nfts): Promise<string[]> {
    if (!data.nfts) {
      return [];
    }
    return Promise.all(
      data.nfts.map(async (nft) => {
        if (!nft.uri) {
          return '';
        }
        const imageUri = await this.getImageFromUri(nft.uri);
        return imageUri;
      }),
    );
  }

  async listNftsMetadata(data: ListedClass200Response | Nfts): Promise<Metadata[]> {
    if (!data.nfts) {
      return [];
    }
    return Promise.all(
      data.nfts.map(async (nft) => {
        if (!nft.uri) {
          return {};
        }
        const metadata = await this.getMetadataFromUri(nft.uri);
        return metadata;
      }),
    );
  }

  buildMsgListNft(
    senderAddress: string,
    classId: string,
    nftId: string,
    listingType: ununificlient.proto.ununifi.nftmarket.ListingType,
    bidSymbol: string,
    symbolMetadataMap: { [symbol: string]: cosmosclient.proto.cosmos.bank.v1beta1.IMetadata },
    minimumDepositRate: number,
    autoRefinancing: boolean,
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
      minimum_deposit_rate: minimumDepositRate.toString(),
      automatic_refinancing: autoRefinancing,
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
    const biddingPeriodTimestamp = this.convertDateToTimestamp(biddingPeriod);

    const msg = new ununificlient.proto.ununifi.nftmarket.MsgPlaceBid({
      sender: senderAddress,
      nft_id: {
        class_id: classId,
        nft_id: nftId,
      },
      bid_amount: bid,
      bidding_period: biddingPeriodTimestamp,
      deposit_lending_rate: lendingRate.toString(),
      automatic_payment: automaticPayment,
      deposit_amount: deposit,
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
    });

    return msg;
  }
}
