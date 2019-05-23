import { of, range, from, partition, merge } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';
import { twoWayAlert, twoWayFilterAsyncTimeout, twoWayFilterAsync, twoWayFilter, StreamRegistry } from '../lib';

const observableValues = range(1, 100);

function timeout(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function sleep(fn, ...args) {
    await timeout(3000);
    return fn(...args);
}

observableValues.pipe(
	twoWayAlert((value: number, index: number) => value % 3 === 0, x=> `${x} is about to fail at 2nd step`),
	twoWayFilterAsyncTimeout<number>(()=>sleep(()=>true), 1000, true, x=>`timeout! ${x}`),
	twoWayFilterAsync((value: number, index:number) => Promise.resolve(value % 2 === 0), x=> `${x} fails at 1st step`),
	twoWayFilter((value: number, index: number) => value % 3 === 0, x=> `${x} fails at 2nd step`)
).subscribe(x => console.log('ok', x));

StreamRegistry.getInstance().common.subscribe(x => console.log('err', x));
StreamRegistry.getInstance().timeout.subscribe(x => console.log('timeout', x));
StreamRegistry.getInstance().alert.subscribe(x => console.log('alert', x));