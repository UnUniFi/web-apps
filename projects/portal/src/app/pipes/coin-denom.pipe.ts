import { BankQueryService } from '../models/cosmos/bank.query.service';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'coinDenom',
})
export class CoinDenomPipe implements PipeTransform {
  constructor(private readonly bankQueryService: BankQueryService) {}
  async transform(value: string | undefined | null): Promise<string | null | undefined> {
    if (value) {
      const metadata = await this.bankQueryService.getDenomMetadata([value]);
      const symbol = metadata[0].symbol;
      return symbol;
    }
    return value;
  }
}
