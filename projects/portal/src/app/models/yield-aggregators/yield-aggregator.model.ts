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
  reserveRate: number;
  feeAmount: number;
  feeSymbol: string;
  depositAmount: number;
  depositSymbol: string;
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
