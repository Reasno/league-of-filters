import { merge, partition, Observable, OperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';
import { StreamRegistry } from './stream-registry';
import { FormatFunc, Type }  from './types';

export const twoWayFilter = <T>(predicate: (value: T, index: number) => boolean, errFormat?: FormatFunc<T>) : OperatorFunction<T,T> => (source: Observable<T>) => {
  const sr = StreamRegistry.getInstance();
  const [ok$, err$] = partition(source, predicate);
  if (errFormat) {
    const msg$ = err$.pipe(map(x => errFormat(x, Type.Common)));
    sr.common = merge(sr.common, msg$);
  } else {
    sr.common = merge(sr.common, err$);
  }

  return ok$;
};