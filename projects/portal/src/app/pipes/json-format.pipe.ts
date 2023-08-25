import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'jsonFormat',
})
export class JsonFormatPipe implements PipeTransform {
  transform(value: any): string {
    try {
      const parsedValue = JSON.parse(value);
      return JSON.stringify(parsedValue, null, 2);
    } catch (error) {
      return value;
    }
  }
}
