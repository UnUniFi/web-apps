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
  symbol: string;
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

export type OsmosisPools = {
  pool_id: number;
  apr_list: {
    start_date: string;
    denom: string;
    symbol: string;
    apr_1d: number;
    apr_7d: number;
    apr_14d: number;
    apr_superfluid: number;
  }[];
}[];
