"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sigpraStore = exports.SigpraStore = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const seedData_1 = require("./seedData");
const storePath = path_1.default.join(process.cwd(), "data", "sigpra-store.json");
function clone(value) {
    return JSON.parse(JSON.stringify(value));
}
function nextId(items) {
    return Math.max(0, ...items.map((item) => Number(item.id))) + 1;
}
class SigpraStore {
    constructor() {
        this.data = this.load();
    }
    all() {
        return clone(this.data);
    }
    replace(data) {
        this.data = clone(data);
        this.persist();
        return this.all();
    }
    periods() {
        return clone(this.data.periods);
    }
    createPeriod(input) {
        const period = { ...input, id: nextId(this.data.periods) };
        this.data.periods.push(period);
        this.persist();
        return clone(period);
    }
    agreements() {
        return {
            institutions: clone(this.data.institutions),
            agreements: clone(this.data.agreements),
            places: clone(this.data.places)
        };
    }
    createAgreement(input) {
        const agreement = { ...input, id: nextId(this.data.agreements) };
        this.data.agreements.push(agreement);
        this.persist();
        return clone(agreement);
    }
    assignments() {
        return clone(this.data.assignments);
    }
    createAssignment(input) {
        const assignment = { ...input, id: nextId(this.data.assignments) };
        this.data.assignments.push(assignment);
        const place = this.data.places.find((item) => item.id === assignment.placeId);
        if (place)
            place.occupied += 1;
        this.persist();
        return clone(assignment);
    }
    load() {
        try {
            if (fs_1.default.existsSync(storePath)) {
                return JSON.parse(fs_1.default.readFileSync(storePath, "utf8"));
            }
        }
        catch {
            // Si el archivo local se corrompe, se restaura con datos demo.
        }
        return clone(seedData_1.seedData);
    }
    persist() {
        fs_1.default.mkdirSync(path_1.default.dirname(storePath), { recursive: true });
        fs_1.default.writeFileSync(storePath, JSON.stringify(this.data, null, 2));
    }
}
exports.SigpraStore = SigpraStore;
exports.sigpraStore = new SigpraStore();
