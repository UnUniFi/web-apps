import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'secondToDate',
})
export class SecondToDatePipe implements PipeTransform {
  transform(value: string | undefined | null): unknown {
    if (value) {
      const seconds = parseInt(value, 10);
      const date = seconds / 24 / 60 / 60;
      return date;
    } else {
      return value;
    }
  }
}
