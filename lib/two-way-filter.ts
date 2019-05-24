import { from, merge, partition, Observable, OperatorFunction } from "rxjs";
import { map, mergeMap } from "rxjs/operators";
import { StreamRegistry } from "./stream-registry";
import { FormatFunc, Type, SyncPredicate, AsyncPredicate } from "./types";

/**
 * twoWayFilter behaves just like a normal filter in rxjs,
 * except that it will output filtered results to a predefined
 * stream.
 *
 * The predicate in this filter may also be asynchronouse.
 * @type {OperatorFunction<T, T>b  }
 */
export const twoWayFilter = <T>(
  predicate: SyncPredicate<T> | AsyncPredicate<T>,
  errFormat?: FormatFunc<T>,
  registry?: StreamRegistry
): OperatorFunction<T, T> => (source: Observable<T>) => {
  let count = 0;
  const sr = registry || StreamRegistry.getInstance();
  const tested$ = source.pipe(
    mergeMap((data: T) => {
      return from(Promise.resolve(predicate(data, count++))).pipe(
        map(isValid => ({ filterResult: isValid, entry: data }))
      );
    })
  );
  const [ok$, err$] = partition(
    tested$,
    (data: { filterResult: boolean; entry: T }) => data.filterResult === true
  );
  if (errFormat) {
    const msg$ = err$.pipe(
      map((data: { filterResult: boolean; entry: T }) =>
        errFormat(data.entry, Type.Common)
      )
    );
    sr.common = merge(sr.common, msg$);
  } else {
    sr.common = merge(sr.common, err$.pipe(map(data => data.entry)));
  }
  return ok$.pipe(map(data => data.entry));
};
