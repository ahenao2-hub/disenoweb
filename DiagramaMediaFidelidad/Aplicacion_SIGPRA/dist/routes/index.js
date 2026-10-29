"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiRouter = void 0;
const express_1 = require("express");
const AuthController_1 = require("../controllers/AuthController");
const HealthController_1 = require("../controllers/HealthController");
const PeriodController_1 = require("../controllers/PeriodController");
const AgreementController_1 = require("../controllers/AgreementController");
const AssignmentController_1 = require("../controllers/AssignmentController");
const RequestController_1 = require("../controllers/RequestController");
const TrackingController_1 = require("../controllers/TrackingController");
const ReportController_1 = require("../controllers/ReportController");
const StateController_1 = require("../controllers/StateController");
exports.apiRouter = (0, express_1.Router)();
// ==========================================
// Servicios Transversales (Salud, Sesion, Estado)
// ==========================================
exports.apiRouter.get("/health", HealthController_1.HealthController.show);
exports.apiRouter.get("/state", StateController_1.StateController.show);
exports.apiRouter.put("/state", StateController_1.StateController.replace);
exports.apiRouter.post("/auth/login", AuthController_1.AuthController.login);
exports.apiRouter.post("/auth/register", AuthController_1.AuthController.register);
// ==========================================
// S1. Planeacion y convenios (RF-01, RF-02, CU-01, CU-02)
// ==========================================
exports.apiRouter.get("/periods", PeriodController_1.PeriodController.index);
exports.apiRouter.post("/periods", PeriodController_1.PeriodController.store);
exports.apiRouter.get("/agreements", AgreementController_1.AgreementController.index);
exports.apiRouter.post("/agreements", AgreementController_1.AgreementController.store);
// ==========================================
// S2. Asignacion y Solicitudes de practicas (RF-03, CU-03, CU-08)
// ==========================================
exports.apiRouter.get("/requests", RequestController_1.RequestController.getRequests);
exports.apiRouter.get("/requests/:id", RequestController_1.RequestController.getRequestById);
exports.apiRouter.post("/requests", RequestController_1.RequestController.createOrUpdate);
exports.apiRouter.put("/requests/:id/review", RequestController_1.RequestController.review);
exports.apiRouter.get("/assignments", AssignmentController_1.AssignmentController.index);
exports.apiRouter.post("/assignments", AssignmentController_1.AssignmentController.store);
// ==========================================
// S3. Ejecucion y seguimiento (RF-04, RF-05, CU-04, CU-05, CU-06)
// ==========================================
exports.apiRouter.get("/activities", TrackingController_1.TrackingController.listActivities);
exports.apiRouter.post("/activities", TrackingController_1.TrackingController.createActivity);
exports.apiRouter.put("/activities/:id", TrackingController_1.TrackingController.updateActivity);
exports.apiRouter.get("/visits", TrackingController_1.TrackingController.listVisits);
exports.apiRouter.post("/visits", TrackingController_1.TrackingController.createVisit);
// ==========================================
// S4. Informes y auditoria (CU-07)
// ==========================================
exports.apiRouter.get("/reports/consolidated", ReportController_1.ReportController.consolidated);
