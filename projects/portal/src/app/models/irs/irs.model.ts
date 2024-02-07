import ununificlient from 'ununifi-client';

export type MintLpRequest = {
  trancheId: string;
  lpReadableAmount: number;
  lpDenom: string;
  readableAmountMapInMax?: { [denom: string]: number };
};

export type RedeemLpRequest = {
  trancheId: string;
  lpReadableAmount: number;
  lpDenom: string;
  readableAmountMapOutMin?: { [denom: string]: number };
};

export type MintPtYtRequest = {
  trancheId: string;
  trancheType: ununificlient.proto.ununifi.irs.TrancheType.NORMAL_YIELD;
  depositDenom: string;
  readableAmount: number;
};

export type MintPtRequest = {
  trancheId: string;
  trancheType: ununificlient.proto.ununifi.irs.TrancheType.FIXED_YIELD;
  depositDenom: string;
  readableAmount: number;
};

export type MintYtRequest = {
  trancheId: string;
  trancheType: ununificlient.proto.ununifi.irs.TrancheType.LEVERAGED_VARIABLE_YIELD;
  depositDenom: string;
  readableAmount: number;
  requiredYT: number;
};

export type RedeemPtYtRequest = {
  trancheId: string;
  trancheType: ununificlient.proto.ununifi.irs.TrancheType.NORMAL_YIELD;
  readableAmountMap: { [denom: string]: number };
  depositDenom: string;
  requiredRedeemDeposit: number;
};

export type RedeemPtRequest = {
  trancheId: string;
  trancheType: ununificlient.proto.ununifi.irs.TrancheType.FIXED_YIELD;
  ptDenom: string;
  readableAmount: number;
};

export type RedeemYtRequest = {
  trancheId: string;
  trancheType: ununificlient.proto.ununifi.irs.TrancheType.LEVERAGED_VARIABLE_YIELD;
  ytDenom: string;
  readableAmount: number;
  depositDenom?: string;
  requiredRedeemDeposit?: number;
};
