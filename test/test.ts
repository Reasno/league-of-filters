import { range } from "rxjs";
import {
  registry,
  twoWayAlert,
  twoWayFilter,
  twoWayFilterTimeout
} from "../lib";

const observableValues = range(1, 100);

function timeout(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
async function sleep(fn, ...args) {
  await timeout(3000);
  return fn(...args);
}

observableValues
  .pipe(
    twoWayAlert(
      (value: number, index: number) => value % 3 === 0,
      x => `${x} is about to fail at 2nd step`
    ),
    twoWayFilterTimeout<number>(
      () => sleep(() => true),
      1000,
      true,
      x => `timeout! ${x}`
    ),
    twoWayFilter(
      (value: number, index: number) => Promise.resolve(value % 2 === 0),
      x => `${x} fails at 1st step`
    ),
    twoWayFilter(
      (value: number, index: number) => value % 3 === 0,
      x => `${x} fails at 2nd step`
    )
  )
  .subscribe(x => console.log("ok", x));

registry.common.subscribe(x => console.log("err", x));
registry.timeout.subscribe(x => console.log("timeout", x));
registry.alert.subscribe(x => console.log("alert", x));