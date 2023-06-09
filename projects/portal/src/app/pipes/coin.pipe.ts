import { Pipe, PipeTransform } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import { denomExponentMap } from '../models/cosmos/bank.model';
import { BankQueryService } from '../models/cosmos/bank.query.service';

@Pipe({
  name: 'coin',
})
export class CoinPipe implements PipeTransform {
  constructor(private readonly bankQueryService: BankQueryService) {}
  async transform(
    value: cosmosclient.proto.cosmos.base.v1beta1.ICoin | undefined | null,
  ): Promise<unknown> {
    if (value && value.denom) {
      const denomExponents = denomExponentMap;
      const metadata = await this.bankQueryService.getDenomMetadata([value.denom]);
      const exponent = denomExponents[value.denom];
      const amount = Number(value.amount) / Math.pow(10, exponent);
      const symbol = metadata[0].symbol;
      if (!symbol) {
        return value.amount + ' ' + value.denom;
      }
      return amount + ' ' + symbol;
    }
    return value;
  }
}
