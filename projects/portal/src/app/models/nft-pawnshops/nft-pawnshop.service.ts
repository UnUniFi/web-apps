import { CosmosSDKService } from '../cosmos-sdk.service';
import { BankService } from '../cosmos/bank.service';
import { TxCommonService } from '../cosmos/tx-common.service';
import { Nfts } from './nft-pawnshop.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import { Metadata } from 'projects/shared/src/lib/models/ununifi/query/nft/nft.model';
import ununificlient from 'ununifi-client';
import {
  BidderBids200ResponseBidsInner,
  Liquidation200ResponseLiquidations,
  ListedClass200Response,
} from 'ununifi-client/esm/openapi';

@Injectable({
  providedIn: 'root',
})
export class NftPawnshopService {
  constructor(
    private readonly cosmosSDK: CosmosSDKService,
    private readonly txCommon: TxCommonService,
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

  convertMillisecToDuration(millisecond: number) {
    const seconds = Math.floor(millisecond / 1000);
    const nanos = (millisecond % 1000) * 1e6;
    return cosmosclient.proto.google.protobuf.Duration.fromObject({
      seconds: seconds,
      nanos: nanos,
    });
  }

  convertDateToTimestamp(date: Date) {
    const millisecond = date.getTime();
    return ununificlient.proto.google.protobuf.Timestamp.fromObject({
      seconds: Math.floor(millisecond / 1000),
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
    bidSymbol: string,
    symbolMetadataMap: { [symbol: string]: cosmosclient.proto.cosmos.bank.v1beta1.IMetadata },
    minimumDepositRate: number,
    milliseconds: number,
  ) {
    const bidDenom = symbolMetadataMap[bidSymbol].base;
    const msg = new ununificlient.proto.ununifi.nftbackedloan.MsgListNft({
      sender: senderAddress,
      nft_id: {
        class_id: classId,
        nft_id: nftId,
      },
      bid_denom: bidDenom,
      minimum_deposit_rate: this.txCommon.numberToDecString(minimumDepositRate),
      minimum_bidding_period: this.convertMillisecToDuration(milliseconds),
    });

    return msg;
  }

  buildMsgCancelNftListing(senderAddress: string, classId: string, nftId: string) {
    const msg = new ununificlient.proto.ununifi.nftbackedloan.MsgCancelNftListing({
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

    const msg = new ununificlient.proto.ununifi.nftbackedloan.MsgPlaceBid({
      sender: senderAddress,
      nft_id: {
        class_id: classId,
        nft_id: nftId,
      },
      price: bid,
      expiry: biddingPeriodTimestamp,
      interest_rate: this.txCommon.numberToDecString(lendingRate),
      automatic_payment: automaticPayment,
      deposit: deposit,
    });

    return msg;
  }

  buildMsgCancelBid(senderAddress: string, classId: string, nftId: string) {
    const msg = new ununificlient.proto.ununifi.nftbackedloan.MsgCancelBid({
      sender: senderAddress,
      nft_id: {
        class_id: classId,
        nft_id: nftId,
      },
    });

    return msg;
  }

  buildMsgEndNftListing(senderAddress: string, classId: string, nftId: string) {
    const msg = new ununificlient.proto.ununifi.nftbackedloan.MsgEndNftListing({
      sender: senderAddress,
      nft_id: {
        class_id: classId,
        nft_id: nftId,
      },
    });

    return msg;
  }

  buildMsgSellingDecision(senderAddress: string, classId: string, nftId: string) {
    const msg = new ununificlient.proto.ununifi.nftbackedloan.MsgSellingDecision({
      sender: senderAddress,
      nft_id: {
        class_id: classId,
        nft_id: nftId,
      },
    });

    return msg;
  }

  buildMsgPayRemainder(senderAddress: string, classId: string, nftId: string) {
    const msg = new ununificlient.proto.ununifi.nftbackedloan.MsgPayRemainder({
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
    borrowBids: ununificlient.proto.ununifi.nftbackedloan.IBorrowBid[],
  ) {
    const msg = new ununificlient.proto.ununifi.nftbackedloan.MsgBorrow({
      sender: senderAddress,
      nft_id: {
        class_id: classId,
        nft_id: nftId,
      },
      borrow_bids: borrowBids,
    });

    return msg;
  }

  buildMsgRepay(
    senderAddress: string,
    classId: string,
    nftId: string,
    repayBids: ununificlient.proto.ununifi.nftbackedloan.IBorrowBid[],
  ) {
    const msg = new ununificlient.proto.ununifi.nftbackedloan.MsgRepay({
      sender: senderAddress,
      nft_id: {
        class_id: classId,
        nft_id: nftId,
      },
      repay_bids: repayBids,
    });

    return msg;
  }

  convertBorrowBids(
    bids: { address: string; amount: number }[],
    symbol: string,
    symbolMetadataMap: { [symbol: string]: cosmosclient.proto.cosmos.bank.v1beta1.IMetadata },
  ): ununificlient.proto.ununifi.nftbackedloan.IBorrowBid[] {
    return bids.map((bid) => {
      const coin = this.bankService.convertSymbolAmountMapToCoins(
        { [symbol]: bid.amount },
        symbolMetadataMap,
      )[0];
      return {
        bidder: bid.address,
        amount: coin,
      };
    });
  }

  autoBorrowBids(
    bids: BidderBids200ResponseBidsInner[],
    amount: number,
    symbol: string,
    symbolMetadataMap: { [symbol: string]: cosmosclient.proto.cosmos.bank.v1beta1.IMetadata },
  ): ununificlient.proto.ununifi.nftbackedloan.IBorrowBid[] {
    const interestSort = bids.sort((a, b) => Number(a.interest_rate) - Number(b.interest_rate));
    const borrowBids: ununificlient.proto.ununifi.nftbackedloan.IBorrowBid[] = [];
    const coin = this.bankService.convertSymbolAmountMapToCoins(
      { [symbol]: amount },
      symbolMetadataMap,
    )[0];
    let remainingAmount = Number(coin.amount);

    for (const bid of interestSort) {
      const deposit = Number(bid.deposit?.amount);
      if (remainingAmount <= 0) {
        break;
      }

      if (deposit <= remainingAmount) {
        borrowBids.push({
          bidder: bid.id?.bidder,
          amount: { amount: deposit.toString(), denom: coin.denom },
        });
        remainingAmount -= deposit;
      } else {
        borrowBids.push({
          bidder: bid.id?.bidder,
          amount: { amount: remainingAmount.toString(), denom: coin.denom },
        });
        remainingAmount = 0;
      }
    }
    return borrowBids;
  }

  autoRepayBids(
    bids: BidderBids200ResponseBidsInner[],
    liquidation: Liquidation200ResponseLiquidations,
    amount: number,
    symbol: string,
    symbolMetadataMap: { [symbol: string]: cosmosclient.proto.cosmos.bank.v1beta1.IMetadata },
  ): ununificlient.proto.ununifi.nftbackedloan.IBorrowBid[] {
    const expirySort = bids.sort((a, b) => {
      const dateA = new Date(a.expiry!).getTime();
      const dateB = new Date(b.expiry!).getTime();
      return dateA - dateB;
    });
    const coin = this.bankService.convertSymbolAmountMapToCoins(
      { [symbol]: amount },
      symbolMetadataMap,
    )[0];
    let remainingAmount = Number(coin.amount);
    const repayBids: ununificlient.proto.ununifi.nftbackedloan.IBorrowBid[] = [];

    const firstLiquidationAmount = Number(liquidation.liquidation?.amount?.amount);

    if (firstLiquidationAmount >= remainingAmount) {
      repayBids.push({
        bidder: expirySort[0].id?.bidder,
        amount: { amount: remainingAmount.toString(), denom: coin.denom },
      });
      return repayBids;
    } else {
      remainingAmount -= firstLiquidationAmount;
      repayBids.push({
        bidder: expirySort[0].id?.bidder,
        amount: { amount: firstLiquidationAmount.toString(), denom: coin.denom },
      });
    }

    let i = 1;
    for (const li of liquidation.next_liquidation!) {
      const liquidationAmount = Number(li.amount?.amount);
      if (liquidationAmount >= remainingAmount) {
        repayBids.push({
          bidder: expirySort[i].id?.bidder,
          amount: { amount: remainingAmount.toString(), denom: coin.denom },
        });
        return repayBids;
      } else {
        remainingAmount -= liquidationAmount;
        repayBids.push({
          bidder: expirySort[i].id?.bidder,
          amount: { amount: liquidationAmount.toString(), denom: coin.denom },
        });
      }
      i++;
    }
    return repayBids;
  }

  averageInterestRate(
    bids: BidderBids200ResponseBidsInner[],
    borrows: ununificlient.proto.ununifi.nftbackedloan.IBorrowBid[],
  ): number {
    let total = 0;
    let totalAmount = 0;
    for (const borrow of borrows) {
      const bid = bids.find((b) => b.id?.bidder === borrow.bidder);
      if (bid) {
        total += Number(bid.interest_rate) * Number(borrow.amount?.amount);
        totalAmount += Number(borrow.amount?.amount);
      }
    }
    return total / totalAmount;
  }

  shortestExpiryDate(
    bids: BidderBids200ResponseBidsInner[],
    borrows: ununificlient.proto.ununifi.nftbackedloan.IBorrowBid[],
  ): Date {
    let borrowBids: BidderBids200ResponseBidsInner[] = [];
    for (const borrow of borrows) {
      const bid = bids.find((b) => b.id?.bidder === borrow.bidder);
      if (bid) {
        borrowBids.push(bid);
      }
    }
    const period = borrowBids.reduce((min, curr) => {
      const currentDate = new Date(curr.expiry!);
      return currentDate < min ? currentDate : min;
    }, new Date(borrowBids[0].expiry!));
    return period;
  }

  getMaxBorrowAmount(bids: BidderBids200ResponseBidsInner[]): number {
    // 昇順にソート
    const interestSort = bids.sort((a, b) => Number(a.interest_rate) - Number(b.interest_rate));
    const now = new Date();
    let minSettlement = this.getMinimumSettlementAmount(bids);
    let borrowAmount = 0;

    for (const bid of interestSort) {
      const rate = Number(bid.interest_rate);
      const deposit = Number(bid.deposit?.amount);
      const yearInterest = deposit * rate;
      const end = new Date(bid.expiry!);
      const interest =
        (yearInterest * (end.getTime() - now.getTime())) / (1000 * 60 * 60 * 24 * 365);
      const repayAmount = deposit + interest;
      if (repayAmount < minSettlement) {
        minSettlement -= repayAmount;
        borrowAmount += deposit;
      } else {
        borrowAmount += (deposit * minSettlement) / repayAmount;
        minSettlement = 0;
        break;
      }
    }
    return Math.floor(borrowAmount);
  }

  getMinimumSettlementAmount(bids: BidderBids200ResponseBidsInner[]): number {
    // 降順にソート
    if (!bids.length) {
      return 0;
    }
    const priceSort = bids.sort((a, b) => Number(b.price?.amount) - Number(a.price?.amount));
    let minSettlement = 0;
    let forfeitDeposit = 0;
    for (const bid of priceSort) {
      if (!minSettlement || forfeitDeposit + Number(bid.price?.amount) < minSettlement) {
        minSettlement = forfeitDeposit + Number(bid.price?.amount);
      }
      forfeitDeposit += Number(bid.deposit?.amount);
    }

    if (forfeitDeposit < minSettlement) {
      return forfeitDeposit;
    }
    return minSettlement;
  }
}
