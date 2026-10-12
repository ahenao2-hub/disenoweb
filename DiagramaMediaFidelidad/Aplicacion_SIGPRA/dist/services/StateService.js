"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateService = void 0;
const SigpraStore_1 = require("../models/SigpraStore");
class StateService {
    static show() {
        return SigpraStore_1.sigpraStore.all();
    }
    static replace(data) {
        return SigpraStore_1.sigpraStore.replace(data);
    }
}
exports.StateService = StateService;
