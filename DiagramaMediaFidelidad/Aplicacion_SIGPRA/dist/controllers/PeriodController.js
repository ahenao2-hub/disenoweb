"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PeriodController = void 0;
const PeriodService_1 = require("../services/PeriodService");
class PeriodController {
    static index(_req, res) {
        res.json({ periods: PeriodService_1.PeriodService.list() });
    }
    static store(req, res) {
        res.status(201).json({ period: PeriodService_1.PeriodService.create(req.body) });
    }
}
exports.PeriodController = PeriodController;
