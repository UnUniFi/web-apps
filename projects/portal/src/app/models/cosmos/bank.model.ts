export type BankSendRequest = {
  toAddress: string;
  symbolAmounts: { symbol: string; amount: number }[];
};
