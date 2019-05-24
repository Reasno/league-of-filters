import { Observable } from "rxjs";
/**
 * StreamRegistry is a collection of observables
 * taking notes of what have gone through the
 * filters. This is useful when you want to gain
 * more *observability* into the stream processing.
 *
 * registry.common is for the filtered items.
 * registry.timeout is for all timeouts.
 * registry.alert is for all alerts.
 */
export class StreamRegistry {
  private static instance: StreamRegistry;
  /**
   * generic Observable for filtered results.
   * @type {Observable<any>}
   */
  public common: Observable<any>;
  /**
   * Dedicated timeout Observable for all timeouts.
   * @type {Observable<any>}
   */
  public timeout: Observable<any>;
  /**
   * Dedicated alert Observable for all alerts.
   * @type {Observable<any>}
   */
  public alert: Observable<any>;
  private constructor(...errors: Observable<any>[]) {
    this.common = errors[0];
    this.timeout = errors[1];
    this.alert = errors[2];
  }

  /**
   * Get the global default registry, initialize it if
   * necessary.
   * @return {StreamRegistry}
   */
  static getInstance(): StreamRegistry {
    if (!StreamRegistry.instance) {
      StreamRegistry.instance = new StreamRegistry(
        new Observable(),
        new Observable(),
        new Observable()
      );
    }
    return StreamRegistry.instance;
  }

  /**
   * Createa instance of custom stream registry.
   * This method allows user to make their own
   * registries based on their need, without
   * having to hack the global default.
   *
   * @return {StreamRegistry}
   */
  static factory(): StreamRegistry {
    return new StreamRegistry(
      new Observable(),
      new Observable(),
      new Observable()
    );
  }
}
/**
 * The global default registry.
 */
export const registry = StreamRegistry.getInstance();
