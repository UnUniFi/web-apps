import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'unitConversion',
})
export class UnitConversionPipe implements PipeTransform {
  transform(value: number | string | undefined | null, ...args: unknown[]): string {
    if (!Number(value)) {
      return '';
    }

    const size = Number(value);
    const { target, unit } = getTarget(size);
    const d = Math.pow(10, 2);
    const newSize = target !== null ? Math.floor((size / target) * d) / d : size;

    return String(newSize) + unit;
  }
}

function getTarget(size: number) {
  const k = 1000;
  const m = Math.pow(k, 2);
  const g = Math.pow(k, 3);
  const t = Math.pow(k, 4);

  if (size >= t) return { target: t, unit: 'T' };
  if (size >= g) return { target: g, unit: 'G' };
  if (size >= m) return { target: m, unit: 'M' };
  if (size >= k) return { target: k, unit: 'K' };

  return { target: null, unit: '' };
}
