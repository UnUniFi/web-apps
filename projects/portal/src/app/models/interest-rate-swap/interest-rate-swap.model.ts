export type SwapRequest = {
  readableAmount: string;
  denom: string;
};

export type RedeemUnderlyingRequest = {
  ptReadableAmount: string;
  ptDenom: string;
  ytReadableAmount: string;
  ytDenom: string;
};
