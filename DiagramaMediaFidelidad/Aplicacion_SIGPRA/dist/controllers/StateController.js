"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateController = void 0;
const StateService_1 = require("../services/StateService");
class StateController {
    static show(_req, res) {
        res.json({ data: StateService_1.StateService.show() });
    }
    static replace(req, res) {
        res.json({ data: StateService_1.StateService.replace(req.body) });
    }
}
exports.StateController = StateController;
