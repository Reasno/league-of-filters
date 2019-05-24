import { from, merge, Observable, OperatorFunction, partition } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { StreamRegistry } from './stream-registry';
import { AsyncPredicate, FormatFunc, SyncPredicate, Type } from './types';

export const twoWayAlert = <T>(predicate: SyncPredicate<T> | AsyncPredicate<T>, errFormat?: FormatFunc<T>): OperatorFunction<T, T> => (source: Observable<T>) => {
  const sr = StreamRegistry.getInstance();
  let count = 0;
  const tested$ = source.pipe(
    mergeMap((data: T) => {
      return from(Promise.resolve(predicate(data, count++)))
        .pipe(map((isValid) => ({ filterResult: isValid, entry: data })));
    }),
  );
  const [ok$, err$] = partition(tested$, (data: { filterResult: boolean, entry: T }) => data.filterResult === true);
  const final$ = merge(ok$, err$);
  if (errFormat) {
    const msg$ = err$.pipe(map(x => errFormat(x.entry, Type.Alert)));
    sr.alert = merge(sr.alert, msg$);
  } else {
    sr.alert = merge(sr.alert, err$);
  }
  return final$.pipe(map(data => data.entry));
};