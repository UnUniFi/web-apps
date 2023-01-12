import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'percentage',
})
export class PercentagePipe implements PipeTransform {
  transform(value: string | null | undefined): unknown {
    if (value === undefined || value === null) {
      return value;
    }
    if (!Number(value)) {
      return '';
    }

    const percent = (Number(value) * 100).toLocaleString();
    const index = percent.indexOf('.');
    if (index == -1 && Number(percent)) {
      return percent;
    }
    const numString = percent.substring(0, index);

    return Number(numString).toLocaleString();
  }
}
