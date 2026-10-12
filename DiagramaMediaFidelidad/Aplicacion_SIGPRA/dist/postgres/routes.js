"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postgresRouter = void 0;
const express_1 = require("express");
const state_1 = require("./state");
exports.postgresRouter = (0, express_1.Router)();
const wrap = (fn) => (req, res, next) => { Promise.resolve(fn(req, res)).catch(next); };
const newId = (records) => Math.max(0, ...records.map(r => Number(r.id))) + 1;
exports.postgresRouter.get('/health', wrap(async (_req, res) => {
    res.json({ ok: await (0, state_1.postgresReady)(), service: 'SIGPRA', persistence: 'PostgreSQL JSONB MVP' });
}));
exports.postgresRouter.get('/state', wrap(async (_req, res) => { res.json({ data: await (0, state_1.readState)() }); }));
exports.postgresRouter.put('/state', wrap(async (req, res) => {
    res.json({ data: await (0, state_1.replaceState)(req.body) });
}));
exports.postgresRouter.post('/auth/login', wrap(async (req, res) => {
    const d = await (0, state_1.readState)();
    const u = d.users.find(x => x.email === String(req.body?.email || '') && x.password === String(req.body?.password || ''));
    if (!u) {
        res.status(401).json({ message: 'Credenciales invalidas' });
        return;
    }
    const { password: _password, ...user } = u;
    res.json({ user });
}));
exports.postgresRouter.get('/periods', wrap(async (_req, res) => { res.json({ periods: (await (0, state_1.readState)()).periods }); }));
exports.postgresRouter.get('/agreements', wrap(async (_req, res) => {
    const d = await (0, state_1.readState)();
    res.json({ institutions: d.institutions, agreements: d.agreements, places: d.places });
}));
exports.postgresRouter.get('/assignments', wrap(async (_req, res) => { res.json({ assignments: (await (0, state_1.readState)()).assignments }); }));
exports.postgresRouter.post('/periods', wrap(async (req, res) => {
    const period = await (0, state_1.changeState)((d) => {
        const input = req.body;
        if (!input || !d.programs.some(p => p.active && p.name === input.program && p.levels.includes(input.level)))
            throw new Error('Programa o nivel invalido');
        const p = { ...input, id: newId(d.periods) };
        d.periods.push(p);
        return p;
    });
    res.status(201).json({ period });
}));
exports.postgresRouter.post('/agreements', wrap(async (req, res) => {
    const agreement = await (0, state_1.changeState)(d => {
        const input = req.body;
        if (!input || !d.institutions.some(i => i.id === Number(input.institutionId)) || input.end < input.start)
            throw new Error('Convenio invalido');
        const item = { ...input, id: newId(d.agreements) };
        d.agreements.push(item);
        return item;
    });
    res.status(201).json({ agreement });
}));
exports.postgresRouter.post('/assignments', wrap(async (req, res) => {
    const assignment = await (0, state_1.changeState)(d => {
        const input = req.body;
        const place = d.places.find(p => p.id === Number(input?.placeId));
        if (!place || place.occupied >= place.offered)
            throw new Error('Plaza sin cupos');
        if (!d.periods.some(p => p.id === Number(input.periodId)) ||
            !d.users.some(u => u.id === Number(input.studentId) && u.role === 'ESTUDIANTE') ||
            !d.users.some(u => u.id === Number(input.teacherId) && u.role === 'DOCENTE_ASESOR'))
            throw new Error('Asignacion invalida');
        if (d.assignments.some(a => a.studentId === Number(input.studentId) && a.periodId === Number(input.periodId) && a.status === 'ACTIVA'))
            throw new Error('Estudiante ya asignado en el periodo');
        const a = { ...input, id: newId(d.assignments) };
        d.assignments.push(a);
        place.occupied++;
        return a;
    });
    res.status(201).json({ assignment });
}));
exports.postgresRouter.get('/reports/consolidated', wrap(async (_req, res) => {
    const data = await (0, state_1.readState)();
    const rows = data.assignments.map(a => {
        const place = data.places.find(p => p.id === a.placeId);
        const agreement = data.agreements.find(c => c.id === place?.agreementId);
        const activities = data.activities.filter(x => x.assignmentId === a.id);
        return { assignmentId: a.id,
            student: data.users.find(u => u.id === a.studentId)?.name,
            teacher: data.users.find(u => u.id === a.teacherId)?.name,
            institution: data.institutions.find(i => i.id === agreement?.institutionId)?.name,
            approvedHours: activities.filter(x => x.status === 'APROBADA').reduce((sum, x) => sum + Number(x.hours), 0) || a.approvedHours,
            activities: activities.length, visits: data.visits.filter(x => x.assignmentId === a.id).length, status: a.status };
    });
    res.json({ rows });
}));
