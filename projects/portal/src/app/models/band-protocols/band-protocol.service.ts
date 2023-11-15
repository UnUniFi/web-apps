import { getDenomExponent, getSymbolExponent } from '../cosmos/bank.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import cosmosclient from '@cosmos-client/core';

export const rest = 'https://laozi1.bandchain.org/api';
export type TokenAmountUSD = {
  symbol: string;
  display: string;
  symbolAmount: number;
  usdAmount?: number;
};
@Injectable({
  providedIn: 'root',
})
export class BandProtocolService {
  constructor(private http: HttpClient) {}

  async getPrice(symbol: string): Promise<number | undefined> {
    const url = `${rest}/oracle/v1/request_prices?symbols=${symbol}`;
    try {
      const result = await this.http
        .get(url)
        .toPromise()
        .then((res: any) => {
          const multiplier = Number(res.price_results[0].multiplier);
          const px = Number(res.price_results[0].px);
          return px / multiplier;
        });
      return result;
    } catch {
      console.log(`Failed to get price for ${symbol}`);
      return;
    }
  }

  async convertToUSDAmount(symbol: string, amount: string): Promise<number> {
    const exponent = getSymbolExponent(symbol);
    const symbolAmount = Number(amount) / 10 ** (exponent || 0);
    const price = await this.getPrice(symbol);
    if (!price) {
      return 0;
    }

    const usdAmount = symbolAmount * price;
    return usdAmount;
  }

  calcDepositUSDAmount(
    denom: string,
    amount: number,
    symbolPriceMap: { [symbol: string]: number },
    denomMetadataMap: { [denom: string]: cosmosclient.proto.cosmos.bank.v1beta1.IMetadata },
  ): number {
    if (!denomMetadataMap[denom]) {
      console.error(`Denom metadata not found for denom ${denom}`);
      return 0;
    }
    const symbol = denomMetadataMap[denom].symbol;
    if (!symbol) {
      throw new Error(`Symbol not found for denom ${denom}`);
    }
    const price = symbolPriceMap[symbol];
    if (!price) {
      throw new Error(`Price not found for symbol ${symbol}`);
    }
    const exponent = getDenomExponent(denom);
    const symbolAmount = amount / 10 ** (exponent || 0);
    const usdAmount = symbolAmount * price;
    return usdAmount;
  }
}
