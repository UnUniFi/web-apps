import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'coinAmount',
})
export class CoinAmountPipe implements PipeTransform {
  transform(value: string | undefined | null): unknown {
    if (value) {
      const amount = value;
      const decimalAmount = Number(amount) / 1000000;
      return decimalAmount;
    } else {
      return value;
    }
  }
}
