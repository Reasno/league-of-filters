import { from, merge, Observable, OperatorFunction, partition } from "rxjs";
import { map, mergeMap } from "rxjs/operators";
import { StreamRegistry } from "./stream-registry";
import { AsyncPredicate, FormatFunc, SyncPredicate, Type } from "./types";

/**
 * twoWayAlert behaves just like twoWayFiler,
 * except that instead of the actual filtering,
 * it will keep all elements in the main stream,
 * only making a copy of elements matching
 * predicate to the predefined alert stream.
 *
 * The predicate in this filter may also be asynchronouse.
 * @type {OperatorFunction<T, T>}
 */
export const twoWayAlert = <T>(
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
  const final$ = merge(ok$, err$);
  if (errFormat) {
    const msg$ = err$.pipe(map(x => errFormat(x.entry, Type.Alert)));
    sr.alert = merge(sr.alert, msg$);
  } else {
    sr.alert = merge(sr.alert, err$.pipe(map(data => data.entry)));
  }
  return final$.pipe(map(data => data.entry));
};
