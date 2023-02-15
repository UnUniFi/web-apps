import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'percentage',
})
export class PercentagePipe implements PipeTransform {
  transform(value: string | number | null | undefined): unknown {
    if (value === undefined || value === null) {
      return value;
    }
    if (!Number(value)) {
      return '';
    }

    const percent = (Number(value) * 100).toLocaleString();
    return percent.toLocaleString() + '%';
  }
}
