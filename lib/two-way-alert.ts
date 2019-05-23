import { merge, partition, Observable, OperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';
import { StreamRegistry } from './stream-registry';
import { FormatFunc, Type } from './types';

export const twoWayAlert = <T>(predicate: (value: T, index: number) => boolean, errFormat?: FormatFunc<T>) : OperatorFunction<T,T> => (source: Observable<T>) => {
  const sr = StreamRegistry.getInstance();
  const [ok$, err$] = partition(source, predicate);
  const final$ = merge(ok$, err$);
  if (errFormat) {
    const msg$ = err$.pipe(map(x => errFormat(x, Type.Alert)));
    sr.alert = merge(sr.alert, msg$);
  } else {
    sr.alert = merge(sr.alert, err$);
  }
  return final$;
};