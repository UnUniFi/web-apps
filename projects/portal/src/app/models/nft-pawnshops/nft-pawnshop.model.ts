import ununificlient from 'ununifi-client';

export type PlaceBidRequest = {
  classID: string;
  nftID: string;
  symbol: string;
  bidAmount: number;
  biddingPeriod: Date;
  depositLendingRate: number;
  autoPayment: boolean;
  depositAmount: number;
};
