"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestController = void 0;
const SigpraStore_1 = require("../models/SigpraStore");
class RequestController {
    static getRequests(req, res) {
        try {
            const studentId = req.query.studentId ? Number(req.query.studentId) : undefined;
            const status = typeof req.query.status === "string" ? req.query.status : undefined;
            const list = SigpraStore_1.sigpraStore.requests({ studentId, status });
            return res.json(list);
        }
        catch (error) {
            return res.status(500).json({ error: "Error al consultar las solicitudes de práctica." });
        }
    }
    static getRequestById(req, res) {
        try {
            const id = Number(req.params.id);
            const request = SigpraStore_1.sigpraStore.requestById(id);
            if (!request) {
                return res.status(404).json({ error: "Solicitud no encontrada." });
            }
            return res.json(request);
        }
        catch (error) {
            return res.status(500).json({ error: "Error al consultar la solicitud." });
        }
    }
    static createOrUpdate(req, res) {
        try {
            const { studentId, periodId, level, modality, placeId, suggestedCompany, status, documents, comments, userName } = req.body;
            if (!studentId || !periodId) {
                return res.status(400).json({ error: "studentId y periodId son obligatorios." });
            }
            if (status !== "BORRADOR" && (!level || !modality)) {
                return res.status(400).json({ error: "El nivel y la modalidad son obligatorios para radicar la solicitud." });
            }
            const result = SigpraStore_1.sigpraStore.createOrUpdateRequest({
                studentId: Number(studentId),
                periodId: Number(periodId),
                level: String(level || "VIII semestre"),
                modality: String(modality || "Convenio institucional"),
                placeId: placeId ? Number(placeId) : undefined,
                suggestedCompany: suggestedCompany ? String(suggestedCompany) : undefined,
                status: status === "BORRADOR" ? "BORRADOR" : "PENDIENTE_REVISION",
                documents: documents || {},
                comments: comments ? String(comments) : ""
            }, userName || "Estudiante");
            return res.status(201).json({
                message: status === "BORRADOR" ? "Borrador de solicitud guardado exitosamente." : "Solicitud formal de práctica radicada exitosamente.",
                request: result
            });
        }
        catch (error) {
            return res.status(400).json({ error: error.message || "Error al procesar la solicitud." });
        }
    }
    static review(req, res) {
        try {
            const id = Number(req.params.id);
            const { status, justification, reviewerName, reviewerId } = req.body;
            if (!status || !["APROBADA", "DEVUELTA", "RECHAZADA"].includes(status)) {
                return res.status(400).json({ error: "El estado debe ser APROBADA, DEVUELTA o RECHAZADA." });
            }
            if ((status === "DEVUELTA" || status === "RECHAZADA") && (!justification || !String(justification).trim())) {
                return res.status(400).json({ error: "La justificación es obligatoria para devolver o rechazar una solicitud." });
            }
            const updated = SigpraStore_1.sigpraStore.reviewRequest(id, {
                status,
                justification: justification ? String(justification).trim() : undefined
            }, reviewerName || "Director de Programa", reviewerId ? Number(reviewerId) : 4);
            if (!updated) {
                return res.status(404).json({ error: "Solicitud no encontrada." });
            }
            return res.json({
                message: `Solicitud ${status.toLowerCase()} exitosamente.`,
                request: updated
            });
        }
        catch (error) {
            return res.status(400).json({ error: error.message || "Error al revisar la solicitud." });
        }
    }
}
exports.RequestController = RequestController;
