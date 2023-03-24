export type DepositToVaultRequest = {
  vaultId: string;
  symbol: string;
  amount: number;
};

export type WithdrawFromVaultRequest = {
  vaultId: string;
  symbol: string;
  amount: number;
};

export type CreateVaultRequest = {
  name: string;
  symbol: string;
  strategies: { id: string; weight: number }[];
  commissionRate: number;
  feeAmount: number;
  depositAmount: number;
};

export type TransferVaultRequest = {
  vaultId: string;
  recipientAddress: string;
};
