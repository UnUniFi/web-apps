import { StrategyInfo } from '../config.service';

export type DepositToVaultRequest = {
  vaultId: string;
  denom: string;
  readableAmount: number;
};

export type WithdrawFromVaultRequest = {
  vaultId: string;
  lp_denom: string;
  readableAmount: number;
  redeemAmount: number;
  feeAmount: number;
  symbol: string;
};

export type WithdrawFromVaultWithUnbondingRequest = {
  vaultId: string;
  lp_denom: string;
  readableAmount: number;
};

export type CreateVaultRequest = {
  name: string;
  symbol: string;
  description: string;
  strategies: { denom: string; id: string; weight: number }[];
  commissionRate: number;
  reserveRate: number;
  fee: { denom: string; amount: string };
  deposit: { denom: string; amount: string };
  feeCollectorAddress: string;
};

export type TransferVaultRequest = {
  vaultId: string;
  recipientAddress: string;
};

export type VaultInfo = {
  id: string;
  symbol?: string;
  name?: string;
  description?: string;
  gitUrl?: string;
  minApy: number;
  maxApy?: number;
  certainty: boolean;
  poolInfos: (StrategyInfo & { weight?: string })[];
};
