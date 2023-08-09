import { getDenomExponent } from '../models/cosmos/bank.model';
import { BankQueryService } from '../models/cosmos/bank.query.service';
import { Pipe, PipeTransform } from '@angular/core';
import cosmosclient from '@cosmos-client/core';

@Pipe({
  name: 'coin',
})
export class CoinPipe implements PipeTransform {
  constructor(private readonly bankQueryService: BankQueryService) {}
  async transform(
    value: cosmosclient.proto.cosmos.base.v1beta1.ICoin | undefined | null,
  ): Promise<string> {
    if (value && value.denom) {
      const metadata = await this.bankQueryService.getDenomMetadata([value.denom]);
      const exponent = getDenomExponent(value.denom);
      const amount = Number(value.amount) / Math.pow(10, exponent);
      const symbol = metadata[0].symbol;
      if (!symbol) {
        return value.amount + ' ' + value.denom;
      }
      return amount + ' ' + symbol;
    }
    return '';
  }
}
