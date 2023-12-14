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
  utDenom: string;
  readableAmount: number;
};

export type MintPtRequest = {
  trancheId: string;
  trancheType: ununificlient.proto.ununifi.irs.TrancheType.FIXED_YIELD;
  utDenom: string;
  readableAmount: number;
};

export type MintYtRequest = {
  trancheId: string;
  trancheType: ununificlient.proto.ununifi.irs.TrancheType.LEVERAGED_VARIABLE_YIELD;
  utDenom: string;
  readableAmount: number;
  requiredYT: number;
};

export type RedeemPtYtRequest = {
  trancheId: string;
  trancheType: ununificlient.proto.ununifi.irs.TrancheType.NORMAL_YIELD;
  readableAmountMap: { [denom: string]: number };
  utDenom: string;
  requiredUT: number;
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
  utDenom?: string;
  requiredUT?: number;
};
