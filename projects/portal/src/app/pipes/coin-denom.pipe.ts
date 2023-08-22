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
      const display = metadata[0].display;
      return display;
    }
    return value;
  }
}
