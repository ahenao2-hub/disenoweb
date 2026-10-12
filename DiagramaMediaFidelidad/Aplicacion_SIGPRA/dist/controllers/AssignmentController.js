"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssignmentController = void 0;
const AssignmentService_1 = require("../services/AssignmentService");
class AssignmentController {
    static index(_req, res) {
        res.json({ assignments: AssignmentService_1.AssignmentService.list() });
    }
    static store(req, res) {
        res.status(201).json({ assignment: AssignmentService_1.AssignmentService.create(req.body) });
    }
}
exports.AssignmentController = AssignmentController;
