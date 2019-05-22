import { Observable } from 'rxjs';
export declare const twoWayFilterAsync: <T>(predicate: (value: T, index: number) => Promise<boolean>, errFormat: (value: T) => any) => (source: Observable<T>) => Observable<T>;
