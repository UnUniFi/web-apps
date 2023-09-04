import { getDenomExponent } from '../cosmos/bank.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import cosmosclient from '@cosmos-client/core';

export const rest = 'https://laozi1.bandchain.org/api';
export type TokenAmountUSD = {
  symbol: string;
  display: string;
  symbolAmount: number;
  usdAmount: number;
};
@Injectable({
  providedIn: 'root',
})
export class BandProtocolService {
  constructor(private http: HttpClient) {}

  async getPrice(symbol: string): Promise<number> {
    const url = `${rest}/oracle/v1/request_prices?symbols=${symbol}`;
    const result = await this.http
      .get(url)
      .toPromise()
      .then((res: any) => {
        const multiplier = Number(res.price_results[0].multiplier);
        const px = Number(res.price_results[0].px);
        return px / multiplier;
      });
    return result;
  }

  async convertToUSDAmountSymbol(
    symbol: string,
    amount: string,
    symbolMetadataMap: { [symbol: string]: cosmosclient.proto.cosmos.bank.v1beta1.IMetadata },
  ): Promise<TokenAmountUSD> {
    const price = await this.getPrice(symbol);
    const denom = symbolMetadataMap?.[symbol].base;
    const display = symbolMetadataMap?.[symbol].display;
    if (!denom) {
      throw new Error(`Denom not found for symbol ${symbol}`);
    }
    if (!display) {
      throw new Error(`Display not found for denom ${denom}`);
    }
    const exponent = getDenomExponent(denom);
    const symbolAmount = Number(amount) / 10 ** (exponent || 0);
    const usdAmount = symbolAmount * price;
    return { symbol, display, symbolAmount, usdAmount };
  }

  async convertToUSDAmountDenom(
    denom: string,
    amount: string,
    denomMetadataMap: { [denom: string]: cosmosclient.proto.cosmos.bank.v1beta1.IMetadata },
  ): Promise<TokenAmountUSD> {
    const symbol = denomMetadataMap[denom].symbol;
    const display = denomMetadataMap[denom].display;
    if (!symbol) {
      throw new Error(`Symbol not found for denom ${denom}`);
    }
    if (!display) {
      throw new Error(`Display not found for denom ${denom}`);
    }
    const price = await this.getPrice(symbol);
    const exponent = getDenomExponent(denom);
    const symbolAmount = Number(amount) / 10 ** (exponent || 0);
    const usdAmount = symbolAmount * price;
    return { symbol, display, symbolAmount, usdAmount };
  }
}
