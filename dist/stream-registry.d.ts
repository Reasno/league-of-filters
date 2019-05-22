import { Observable } from 'rxjs';
export declare class StreamRegistry {
    private static instance;
    common: Observable<any>;
    timeout: Observable<any>;
    errors: Observable<any>[];
    private constructor();
    static getInstance(): StreamRegistry;
}
