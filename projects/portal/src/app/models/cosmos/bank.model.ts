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
  '': 0,
};

const ibcPattern = /^ibc\//;
const iyaPattern = /^yield-aggregator\/vaults\//;

export function getDenomExponent(denom?: string): number {
  if (!denom) {
    return 0;
  }
  if (ibcPattern.test(denom) || iyaPattern.test(denom)) {
    return 6;
  }
  return denomExponentMap[denom];
}
