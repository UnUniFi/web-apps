import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'floor',
})
export class FloorPipe implements PipeTransform {
  transform(value: string | null | undefined): unknown {
    if (value === undefined || value === null) {
      return value;
    }
    const index = value.indexOf('.');
    if (index == -1 && Number(value)) {
      return value;
    }
    const numString = value.substring(0, index);

    return Number(numString).toLocaleString();
  }
}
