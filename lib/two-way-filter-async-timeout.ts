import { of, from, merge, partition, Observable, Subscription } from 'rxjs';
import { map, mergeMap, timeoutWith } from 'rxjs/operators';
import { StreamRegistry } from './stream-registry';

interface item<T> {
  filterResult: boolean,
  entry: T,
  timeout: boolean
}

export const twoWayFilterAsyncTimeout = <T>(predicate: (value: T, index: number) => Promise<boolean>, errFormat: (value: T) => any, timeout: number, fallbackAs: boolean) => (source: Observable<T>) => {
  let count = 0;
  const sr = StreamRegistry.getInstance();
  const tested$ = source.pipe(
    mergeMap((data: T) => {
      return from(predicate(data, count++))
        .pipe(
          timeoutWith(timeout, of({ filterResult: fallbackAs, entry: data, timeout: true } as item<T>)),
          map( isValid => ({ filterResult: isValid, entry: data, timeout: false } as item<T>))
        );
    }),
  );
  const [noTimeout$, timeout$] = partition(tested$, (data: item<T>) => data.timeout === false);
  const [ok$, err$] = partition(tested$, (data: item<T>) => data.filterResult === true);
  if (errFormat) {
    const msg$ = err$.pipe(map((data: { filterResult: boolean, entry: T }) => errFormat(data.entry)));
    sr.common = merge(sr.common, msg$);
  } else {
    sr.common = merge(sr.common, err$.pipe(map(data => data.entry)));
  }
  sr.timeout = merge(sr.timeout, timeout$);
  return ok$.pipe(map(data => data.entry));
}