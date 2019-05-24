export enum Type {
  Common = 1,
  Timeout,
  Alert
}

/**
 * Function to format the filtered elements 
 * into the format we want in the secondary 
 * streams.
 */
export interface FormatFunc<T> {
  (source: T, type?: Type): any;
}

export type SyncPredicate<T> = (value: T, index: number) => boolean;

export type AsyncPredicate<T> = (value: T, index: number) => Promise<boolean>;
