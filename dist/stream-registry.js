"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
class StreamRegistry {
    constructor(...errors) {
        this.common = errors[0];
        this.timeout = errors[1];
        this.errors = errors;
    }
    static getInstance() {
        if (!StreamRegistry.instance) {
            StreamRegistry.instance = new StreamRegistry(new rxjs_1.Observable(), new rxjs_1.Observable());
        }
        return StreamRegistry.instance;
    }
}
exports.StreamRegistry = StreamRegistry;
