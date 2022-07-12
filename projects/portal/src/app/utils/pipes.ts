import { Observable, pipe, UnaryFunction } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * nullかundefinedの場合はそのまま返し、そうでない場合はコールバックの返り値を返す
 */
export const throughMap = <T, U>(
  fn: (value: T) => U,
): UnaryFunction<Observable<T | null | undefined>, Observable<U | null | undefined>> =>
  pipe(
    map((v: T | null | undefined) =>
      v !== null && v !== undefined ? fn(v) : (v as null | undefined),
    ),
  );
