"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportController = void 0;
const ReportService_1 = require("../services/ReportService");
class ReportController {
    static consolidated(_req, res) {
        res.json({ rows: ReportService_1.ReportService.consolidated() });
    }
}
exports.ReportController = ReportController;
