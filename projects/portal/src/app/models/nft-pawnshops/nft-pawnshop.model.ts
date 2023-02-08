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
  listingType: ununificlient.proto.ununifi.nftmarket.ListingType;
  bidSymbol: string;
  minimumDepositRate: number;
  autoRefinancing: boolean;
};

export type BorrowRequest = {
  classID: string;
  nftID: string;
  symbol: string;
  amount: number;
};

export type RepayRequest = {
  classID: string;
  nftID: string;
  symbol: string;
  amount: number;
};

export type NftRequest = {
  classID: string;
  nftID: string;
};
