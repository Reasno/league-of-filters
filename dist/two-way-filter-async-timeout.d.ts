import { Observable } from 'rxjs';
export declare const twoWayFilterAsyncTimeout: <T>(predicate: (value: T, index: number) => Promise<boolean>, errFormat: (value: T) => any, timeout: number, fallbackAs: boolean) => (source: Observable<T>) => Observable<T>;
