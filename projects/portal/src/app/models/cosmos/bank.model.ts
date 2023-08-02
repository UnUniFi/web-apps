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
  'ibc/ACBD2CEFAC2CC3ED6EEAF67BBDFDF168F1E4EDA159DFE1CA6B4A57A9CAF4DA11': 6,
  '': 0,
};

const ibcPattern = /^ibc\//;
const iyaPattern = /^yield-aggregator\/vaults\//;

export function getDenomExponent(denom?: string): number {
  if (!denom) {
    return 6;
  }
  if (ibcPattern.test(denom)) {
    return 6;
  }
  if (iyaPattern.test(denom)) {
    return 6;
  }
  return getDenomExponent(denom) || 6;
}
