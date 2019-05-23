export enum Type {
    Common = 1,
    Timeout,
    Alert,
}

export interface FormatFunc<T> {
    (source: T, type?: Type): any;
}