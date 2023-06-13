import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { cosmos } from '@cosmos-client/core/esm/proto';
import { denomExponentMap } from '../cosmos/bank.model';

export const rest = 'https://laozi1.bandchain.org/api';
export type TokenAmountUSD = { symbol: string; symbolAmount: number; usdAmount: number };
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

  async convertToUSDAmount(
    symbol: string,
    amount: string,
    symbolMetadataMap: { [symbol: string]: cosmos.bank.v1beta1.IMetadata },
  ): Promise<TokenAmountUSD> {
    const price = await this.getPrice(symbol);
    const denom = symbolMetadataMap?.[symbol].base;
    if (!denom) {
      throw new Error(`Denom not found for symbol ${symbol}`);
    }
    const exponent = denomExponentMap[denom];
    const symbolAmount = Number(amount) / 10 ** (exponent || 0);
    const usdAmount = symbolAmount * price;
    return { symbol, symbolAmount, usdAmount };
  }
}
