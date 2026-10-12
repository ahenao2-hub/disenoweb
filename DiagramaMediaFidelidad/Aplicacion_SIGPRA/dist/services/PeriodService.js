"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PeriodService = void 0;
const SigpraStore_1 = require("../models/SigpraStore");
class PeriodService {
    static list() {
        return SigpraStore_1.sigpraStore.periods();
    }
    static create(input) {
        return SigpraStore_1.sigpraStore.createPeriod(input);
    }
}
exports.PeriodService = PeriodService;
