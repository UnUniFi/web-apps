export type BankSendRequest = {
  toAddress: string;
  symbolAmounts: { symbol: string; amount: number }[];
};

export const denomExponentMap: { [denom: string]: number } = {
  uguu: 6,
  uatom: 6,
  ubtc: 6,
  ueth: 6,
  uusd: 6,
  uusdc: 6,
  udlp: 6,
  // ibc
  'ibc/ED07A3391A112B175915CD8FAF43A2DA8E4790EDE12566649D0C2F97716B8518': 6,
};
