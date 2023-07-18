import ununificlient from 'ununifi-client';

export type Nft = {
  nft?: {
    class_id?: string;
    id?: string;
    uri?: string;
    uri_hash?: string;
    data?: null;
  };
};

export type Nfts = {
  nfts?: {
    class_id?: string;
    id?: string;
    uri?: string;
    uri_hash?: string;
    data?: null;
  }[];
};

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

export type ListRequest = {
  classID: string;
  nftID: string;
  bidSymbol: string;
  minimumDepositRate: number;
  milliSeconds: number;
};

export type BorrowRequest = {
  classID: string;
  nftID: string;
  borrowBids: ununificlient.proto.ununifi.nftbackedloan.IBorrowBid[];
};

export type RepayRequest = {
  classID: string;
  nftID: string;
  repayBids: ununificlient.proto.ununifi.nftbackedloan.IBorrowBid[];
};

export type NftRequest = {
  classID: string;
  nftID: string;
};

export type PrimaryNft = {
  address: string;
  class_id: string;
  nft_id: string;
};
