import { from, merge, partition, Observable, OperatorFunction } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { StreamRegistry } from './stream-registry';
import { FormatFunc, Type }  from './types';

export const twoWayFilterAsync = <T>(predicate: (value: T, index: number) => Promise<boolean>, errFormat?: FormatFunc<T>): OperatorFunction<T,T> => (source: Observable<T>) => {
  let count = 0;
  const sr = StreamRegistry.getInstance();
  const tested$ = source.pipe(
    mergeMap((data: T) => {
      return from(predicate(data, count++))
        .pipe(map((isValid) => ({ filterResult: isValid, entry: data })));
    }),
  );
  const [ok$, err$] = partition(tested$, (data: { filterResult: boolean, entry: T }) => data.filterResult === true);
  if (errFormat) {
    const msg$ = err$.pipe(map((data: { filterResult: boolean, entry: T }) => errFormat(data.entry, Type.Common)));
    sr.common = merge(sr.common, msg$);
  } else {
    sr.common = merge(sr.common, err$.pipe(map(data => data.entry)));
  }
  return ok$.pipe(map(data => data.entry));
}