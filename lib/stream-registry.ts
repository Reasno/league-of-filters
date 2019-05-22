import { Observable } from 'rxjs';
export class StreamRegistry {
  private static instance: StreamRegistry;
  public common: Observable<any>;
  public timeout: Observable<any>;
  public errors: Observable<any>[];
  private constructor(...errors: Observable<any>[]) {
    this.common = errors[0];
    this.timeout = errors[1];
    this.errors = errors;
  }

  static getInstance(): StreamRegistry {
    if (!StreamRegistry.instance) {
      StreamRegistry.instance = new StreamRegistry(new Observable(), new Observable());
    }
    return StreamRegistry.instance;
  }
}