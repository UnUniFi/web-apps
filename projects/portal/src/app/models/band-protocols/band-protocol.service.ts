import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export const rest = 'https://laozi1.bandchain.org/api';

@Injectable({
  providedIn: 'root',
})
export class BandProtocolService {
  constructor(private http: HttpClient) {}

  async getPrice(symbol: string): Promise<number> {
    const url = `${rest}/oracle/oracle/v1/request_prices?symbols=${symbol}`;
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
}
