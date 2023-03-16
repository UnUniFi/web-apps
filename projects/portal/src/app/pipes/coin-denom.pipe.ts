import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'coinDenom',
})
export class CoinDenomPipe implements PipeTransform {
  transform(value: string | undefined | null): unknown {
    if (value) {
      const denom = value;
      const symbolDenom = denom.slice(1).toUpperCase();
      return symbolDenom;
    } else {
      return value;
    }
  }
}
