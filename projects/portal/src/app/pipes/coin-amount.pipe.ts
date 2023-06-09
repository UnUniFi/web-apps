import { Pipe, PipeTransform } from '@angular/core';
import { denomExponentMap } from '../models/cosmos/bank.model';

@Pipe({
  name: 'coinAmount',
})
export class CoinAmountPipe implements PipeTransform {
  transform(value: string | undefined | null, denom?: string): unknown {
    if (denom) {
      const denomExponents = denomExponentMap;
      const exponent = denomExponents[denom];
      const amount = Number(value) / Math.pow(10, exponent);
      return amount;
    }
    if (value) {
      // if no denom, assume micro
      const amount = Number(value) / Math.pow(10, 6);
      return amount;
    }
    return value;
  }
}
