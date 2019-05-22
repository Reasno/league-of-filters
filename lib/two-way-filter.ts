import { merge, partition, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { StreamRegistry } from './stream-registry';

export const twoWayFilter = <T>(predicate: (value: T, index: number) => boolean, errFormat: (value: T) => any) => (source: Observable<T>) => {
  const sr = StreamRegistry.getInstance();
  const [ok$, err$] = partition(source, predicate);
  if (errFormat) {
    const msg$ = err$.pipe(map(errFormat));
    sr.common = merge(sr.common, msg$);
  } else {
    sr.common = merge(sr.common, err$);
  }

  return ok$;
};