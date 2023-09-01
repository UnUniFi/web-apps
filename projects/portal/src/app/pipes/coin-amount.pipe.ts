import { getDenomExponent } from '../models/cosmos/bank.model';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'coinAmount',
})
export class CoinAmountPipe implements PipeTransform {
  transform(value: string | undefined | null, denom?: string | null): string {
    if (denom) {
      const exponent = getDenomExponent(denom);
      const amount = Number(value) / Math.pow(10, exponent);
      return amount.toString();
    }
    if (value) {
      // if no denom, assume micro
      const amount = Number(value) / Math.pow(10, 6);
      return amount.toString();
    }
    return '';
  }
}
