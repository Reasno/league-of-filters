# league-of-filters
A collection of filters for rxjs. This library provides method to gain insight of rxjs streams by branching filtered elements into sencondary streams. 

## example
```javascript
import { range } from 'rxjs';
import { registry, twoWayAlert, twoWayFilter, twoWayFilterTimeout } from '../lib';

const observableValues = range(1, 100);

function timeout(ms: number) {
	return new Promise(resolve => setTimeout(resolve, ms));
}
async function sleep(fn, ...args) {
	await timeout(3000);
	return fn(...args);
}

observableValues.pipe(
	twoWayAlert((value: number, index: number) => value % 3 === 0, x => `${x} is about to fail at 2nd step`),
	twoWayFilterTimeout<number>(() => sleep(() => true), 1000, true, x => `timeout! ${x}`),
	twoWayFilter((value: number, index: number) => Promise.resolve(value % 2 === 0), x => `${x} fails at 1st step`),
	twoWayFilter((value: number, index: number) => value % 3 === 0, x => `${x} fails at 2nd step`)
).subscribe(x => console.log('ok', x));

registry.common.subscribe(x => console.log('err', x));
registry.timeout.subscribe(x => console.log('timeout', x));
registry.alert.subscribe(x => console.log('alert', x));
```

## StreamRegistry

*StreamRegistry* is a collection of observables taking notes of what have gone through the filters. This is useful when you want to gain more *observability* into the stream processing.

registry.common is for the filtered items.
registry.timeout is for all timeouts.
registry.alert is for all alerts.

## twoWayFilter

*twoWayFilter* behaves just like a normal filter in rxjs, except that it will output filtered results to a predefined stream.

The predicate in this filter may also be asynchronouse.

## twoWayAlert

*twoWayAlert* behaves just like twoWayFiler, except that instead of the actual filtering, it will keep all elements in the main stream, only making a copy of elements matching predicate to the predefined alert stream.

The predicate in this filter may also be asynchronouse.

## twoWayFilterTimeout

*twoWayFilterTimeout* behaves just like twoWayFilter, except that it will timeout the predicate exectution, and output all timeouts to a predefined stream. A fallback behavior of timeouts should be provided by the caller, allowing the main stream to continue.

The predicate in this filter may also be asynchronouse.


