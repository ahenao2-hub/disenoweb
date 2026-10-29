"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrackingController = void 0;
const TrackingService_1 = require("../services/TrackingService");
/**
 * Controlador para Servicio S3: Ejecucion y seguimiento
 */
class TrackingController {
    static listActivities(req, res) {
        const assignmentId = req.query.assignmentId ? Number(req.query.assignmentId) : undefined;
        const activities = TrackingService_1.TrackingService.listActivities(assignmentId);
        return res.json({ activities });
    }
    static createActivity(req, res) {
        try {
            const activity = TrackingService_1.TrackingService.createActivity(req.body);
            return res.status(201).json({ activity });
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
    static updateActivity(req, res) {
        try {
            const id = Number(req.params.id);
            const { status, observation } = req.body;
            const activity = TrackingService_1.TrackingService.updateActivityStatus(id, status, observation);
            return res.json({ activity });
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
    static listVisits(req, res) {
        const assignmentId = req.query.assignmentId ? Number(req.query.assignmentId) : undefined;
        const visits = TrackingService_1.TrackingService.listVisits(assignmentId);
        return res.json({ visits });
    }
    static createVisit(req, res) {
        try {
            const visit = TrackingService_1.TrackingService.createVisit(req.body);
            return res.status(201).json({ visit });
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
}
exports.TrackingController = TrackingController;
