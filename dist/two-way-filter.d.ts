import { Observable } from 'rxjs';
export declare const twoWayFilter: <T>(predicate: (value: T, index: number) => boolean, errFormat: (value: T) => any) => (source: Observable<T>) => Observable<T>;
