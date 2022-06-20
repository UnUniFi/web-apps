import Long from 'long';

export type MsgListNftData = {
  sender: string; // accAddress
  nft_id: {
    class_id: string;
    nft_id: string;
  };
  listing_type: ListingType;
  bid_token: string; // denom
  min_bid: string; // string number
  bid_hook: Long; // string number but need to convert to Long before use in ununifi-client
};

export type ListingType = 'DIRECT_ASSET_BORROW';
