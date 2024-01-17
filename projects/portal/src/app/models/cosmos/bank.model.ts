export type BankSendRequest = {
  toAddress: string;
  denomReadableAmountMap: { [denom: string]: number };
};

export const denomExponentMap: { [denom: string]: number } = {
  uguu: 6,
  uatom: 6,
  ubtc: 6,
  ueth: 6,
  uusd: 6,
  uusdc: 6,
  udlp: 6,
  '': 6,
};

export const symbolExponent: { [symbol: string]: number } = {};

const ibcPattern = /^ibc\//;
const iyaPattern = /^yieldaggregator\/vaults\//;
const irsPattern = /^irs\//;

export function getDenomExponent(denom?: string): number {
  if (!denom) {
    return 6;
  }
  if (ibcPattern.test(denom) || iyaPattern.test(denom) || irsPattern.test(denom)) {
    return 6;
  }
  return denomExponentMap[denom];
}

export function getSymbolExponent(symbol?: string): number {
  if (!symbol) {
    return 6;
  }
  return symbolExponent[symbol] || 6;
}
