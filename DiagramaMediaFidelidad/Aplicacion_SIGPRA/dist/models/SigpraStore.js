"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sigpraStore = exports.SigpraStore = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const seedData_1 = require("./seedData");
function getStorePath() {
    const localData = path_1.default.join(process.cwd(), "data", "sigpra-store.json");
    if (fs_1.default.existsSync(localData))
        return localData;
    const moduleData = path_1.default.resolve(__dirname, "..", "data", "sigpra-store.json");
    if (fs_1.default.existsSync(moduleData))
        return moduleData;
    return localData;
}
const storePath = getStorePath();
function clone(value) {
    return JSON.parse(JSON.stringify(value));
}
function nextId(items) {
    return Math.max(0, ...items.map((item) => Number(item.id))) + 1;
}
function nowFormatted() {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const hh = String(now.getHours()).padStart(2, "0");
    const min = String(now.getMinutes()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
}
class SigpraStore {
    constructor() {
        this.data = this.load();
        if (!this.data.requests) {
            this.data.requests = clone(seedData_1.seedData.requests || []);
        }
    }
    all() {
        return clone(this.data);
    }
    replace(data) {
        this.data = clone(data);
        this.persist();
        return this.all();
    }
    // S1: Planeacion y convenios
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
    // CU-08: Solicitud formal de practicas academicas
    requests(filter) {
        let list = clone(this.data.requests || []);
        if (filter?.studentId) {
            list = list.filter((r) => r.studentId === Number(filter.studentId));
        }
        if (filter?.status) {
            list = list.filter((r) => r.status === filter.status);
        }
        return list;
    }
    requestById(id) {
        const found = (this.data.requests || []).find((r) => r.id === Number(id));
        return found ? clone(found) : null;
    }
    createOrUpdateRequest(input, userName = "Estudiante") {
        if (!this.data.requests)
            this.data.requests = [];
        const timestamp = nowFormatted();
        // Buscar si ya existe una solicitud para este estudiante y periodo
        let existingIndex = this.data.requests.findIndex((r) => r.studentId === input.studentId && r.periodId === input.periodId);
        let result;
        const isDraft = input.status === "BORRADOR";
        const status = isDraft ? "BORRADOR" : "PENDIENTE_REVISION";
        if (existingIndex >= 0) {
            const existing = this.data.requests[existingIndex];
            // Si ya estaba aprobada, no se puede sobreescribir sin motivo
            if (existing.status === "APROBADA") {
                throw new Error("El estudiante ya posee una solicitud aprobada para este periodo.");
            }
            result = {
                ...existing,
                ...input,
                status,
                updatedAt: timestamp,
                submittedAt: isDraft ? existing.submittedAt : timestamp
            };
            this.data.requests[existingIndex] = result;
        }
        else {
            result = {
                id: nextId(this.data.requests),
                studentId: input.studentId,
                periodId: input.periodId,
                level: input.level,
                modality: input.modality,
                placeId: input.placeId,
                suggestedCompany: input.suggestedCompany,
                status,
                documents: input.documents || {},
                comments: input.comments || "",
                submittedAt: isDraft ? undefined : timestamp,
                createdAt: timestamp,
                updatedAt: timestamp
            };
            this.data.requests.push(result);
        }
        // Registrar en auditoria
        const auditEvent = {
            id: nextId(this.data.audit),
            date: timestamp,
            user: userName,
            event: isDraft
                ? `Guardó borrador de solicitud de práctica #${result.id}`
                : `Radicó solicitud formal de práctica #${result.id}`,
            entity: "SOLICITUD"
        };
        this.data.audit.push(auditEvent);
        this.persist();
        return clone(result);
    }
    reviewRequest(id, decision, reviewerName = "Director de Programa", reviewerId = 4) {
        if (!this.data.requests)
            this.data.requests = [];
        const target = this.data.requests.find((r) => r.id === Number(id));
        if (!target)
            return null;
        if ((decision.status === "DEVUELTA" || decision.status === "RECHAZADA") && !decision.justification?.trim()) {
            throw new Error("La justificación es obligatoria para devolver o rechazar una solicitud.");
        }
        const timestamp = nowFormatted();
        target.status = decision.status;
        target.justification = decision.justification || "";
        target.reviewedAt = timestamp;
        target.reviewedBy = reviewerId;
        target.updatedAt = timestamp;
        // Actualizar estado habilitado del estudiante
        const student = this.data.users.find((u) => u.id === target.studentId);
        if (student) {
            student.enabledForAssignment = decision.status === "APROBADA";
        }
        // Evento de auditoria
        const eventVerb = decision.status === "APROBADA" ? "Aprobó" : decision.status === "DEVUELTA" ? "Devolvió" : "Rechazó";
        const auditEvent = {
            id: nextId(this.data.audit),
            date: timestamp,
            user: reviewerName,
            event: `${eventVerb} solicitud de práctica #${target.id} (${decision.status})${decision.justification ? ': ' + decision.justification : ''}`,
            entity: "SOLICITUD"
        };
        this.data.audit.push(auditEvent);
        this.persist();
        return clone(target);
    }
    // S2: Asignacion de practicas
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
    // S3: Ejecucion y seguimiento
    activities() {
        return clone(this.data.activities);
    }
    createActivity(input) {
        const activity = { ...input, id: nextId(this.data.activities) };
        this.data.activities.push(activity);
        this.persist();
        return clone(activity);
    }
    updateActivity(id, input) {
        const index = this.data.activities.findIndex((item) => item.id === id);
        if (index === -1)
            return null;
        this.data.activities[index] = { ...this.data.activities[index], ...input };
        this.persist();
        return clone(this.data.activities[index]);
    }
    visits() {
        return clone(this.data.visits);
    }
    createVisit(input) {
        const visit = { ...input, id: nextId(this.data.visits) };
        this.data.visits.push(visit);
        this.persist();
        return clone(visit);
    }
    // S4: Informes y auditoria
    audit() {
        return clone(this.data.audit);
    }
    load() {
        try {
            if (fs_1.default.existsSync(storePath)) {
                const parsed = JSON.parse(fs_1.default.readFileSync(storePath, "utf8"));
                if (!parsed.requests) {
                    parsed.requests = clone(seedData_1.seedData.requests || []);
                }
                return parsed;
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
