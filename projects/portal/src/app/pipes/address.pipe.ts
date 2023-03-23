import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ellipsis',
})
export class EllipsisPipe implements PipeTransform {
  transform(value: string | undefined | null): unknown {
    if (value && value.length > 12) {
      const prefix = value.slice(0, 9);
      const suffix = value.slice(-2);
      return prefix + '…' + suffix;
    } else {
      return value;
    }
  }
}
