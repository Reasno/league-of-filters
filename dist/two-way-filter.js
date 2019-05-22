"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const stream_registry_1 = require("./stream-registry");
exports.twoWayFilter = (predicate, errFormat) => (source) => {
    const sr = stream_registry_1.StreamRegistry.getInstance();
    const [ok$, err$] = rxjs_1.partition(source, predicate);
    if (errFormat) {
        const msg$ = err$.pipe(operators_1.map(errFormat));
        sr.common = rxjs_1.merge(sr.common, msg$);
    }
    else {
        sr.common = rxjs_1.merge(sr.common, err$);
    }
    return ok$;
};
