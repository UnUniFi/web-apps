import { Pipe, PipeTransform } from '@angular/core';
import cosmosclient from '@cosmos-client/core';

@Pipe({
  name: 'coin',
})
export class CoinPipe implements PipeTransform {
  transform(value: cosmosclient.proto.cosmos.base.v1beta1.ICoin | undefined | null): unknown {
    if (value && value.amount && value.denom) {
      const amount = value.amount;
      const denom = value.denom;
      const decimalAmount = Number(amount) / 1000000;
      const symbolDenom = denom.slice(1).toUpperCase();
      return decimalAmount + symbolDenom;
    } else {
      return value;
    }
  }
}
