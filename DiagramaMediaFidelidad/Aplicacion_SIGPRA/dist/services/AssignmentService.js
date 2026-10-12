"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssignmentService = void 0;
const SigpraStore_1 = require("../models/SigpraStore");
class AssignmentService {
    static list() {
        return SigpraStore_1.sigpraStore.assignments();
    }
    static create(input) {
        return SigpraStore_1.sigpraStore.createAssignment(input);
    }
}
exports.AssignmentService = AssignmentService;
