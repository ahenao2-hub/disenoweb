"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgreementController = void 0;
const AgreementService_1 = require("../services/AgreementService");
class AgreementController {
    static index(_req, res) {
        res.json(AgreementService_1.AgreementService.list());
    }
    static store(req, res) {
        res.status(201).json({ agreement: AgreementService_1.AgreementService.create(req.body) });
    }
}
exports.AgreementController = AgreementController;
