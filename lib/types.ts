export enum Type {
  Common = 1,
  Timeout,
  Alert
}

export interface FormatFunc<T> {
  (source: T, type?: Type): any;
}

export type SyncPredicate<T> = (value: T, index: number) => boolean;

export type AsyncPredicate<T> = (value: T, index: number) => Promise<boolean>;
