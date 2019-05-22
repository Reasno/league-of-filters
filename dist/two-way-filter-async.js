"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const stream_registry_1 = require("./stream-registry");
exports.twoWayFilterAsync = (predicate, errFormat) => (source) => {
    let count = 0;
    const sr = stream_registry_1.StreamRegistry.getInstance();
    const tested$ = source.pipe(operators_1.mergeMap((data) => {
        return rxjs_1.from(predicate(data, count++))
            .pipe(operators_1.map((isValid) => ({ filterResult: isValid, entry: data })));
    }));
    const [ok$, err$] = rxjs_1.partition(tested$, (data) => data.filterResult === true);
    if (errFormat) {
        const msg$ = err$.pipe(operators_1.map((data) => errFormat(data.entry)));
        sr.common = rxjs_1.merge(sr.common, msg$);
    }
    else {
        sr.common = rxjs_1.merge(sr.common, err$.pipe(operators_1.map(data => data.entry)));
    }
    return ok$.pipe(operators_1.map(data => data.entry));
};
