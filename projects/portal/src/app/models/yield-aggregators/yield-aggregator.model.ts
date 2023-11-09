export type DepositToVaultRequest = {
  vaultId: string;
  denom: string;
  readableAmount: number;
};

export type WithdrawFromVaultRequest = {
  vaultId: string;
  denom: string;
  readableAmount: number;
};

export type CreateVaultRequest = {
  name: string;
  denom: string;
  description: string;
  strategies: { id: string; weight: number }[];
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
