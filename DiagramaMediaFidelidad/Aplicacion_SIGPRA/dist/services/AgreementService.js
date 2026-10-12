"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgreementService = void 0;
const SigpraStore_1 = require("../models/SigpraStore");
class AgreementService {
    static list() {
        return SigpraStore_1.sigpraStore.agreements();
    }
    static create(input) {
        return SigpraStore_1.sigpraStore.createAgreement(input);
    }
}
exports.AgreementService = AgreementService;
