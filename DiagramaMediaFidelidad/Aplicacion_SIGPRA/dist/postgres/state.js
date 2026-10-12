"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupPostgres = setupPostgres;
exports.readState = readState;
exports.changeState = changeState;
exports.replaceState = replaceState;
exports.postgresReady = postgresReady;
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const pg_1 = require("pg");
const seedData_1 = require("../models/seedData");
const pool = new pg_1.Pool({ connectionString: process.env.DATABASE_URL, max: 5 });
const storage = node_path_1.default.join(process.cwd(), 'data', 'sigpra-store.json');
const clone = (x) => JSON.parse(JSON.stringify(x));
function valid(state) {
    if (!state || typeof state !== 'object')
        return false;
    const d = state;
    return ['programs', 'users', 'periods', 'institutions', 'agreements', 'places', 'assignments',
        'activities', 'evidences', 'visits', 'audit'].every(k => Array.isArray(d[k]));
}
async function setupPostgres() {
    if (!process.env.DATABASE_URL)
        throw new Error('DATABASE_URL no configurada');
    await pool.query('CREATE SCHEMA IF NOT EXISTS sigpra');
    await pool.query(`CREATE TABLE IF NOT EXISTS sigpra.estado_mvp (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    contenido JSONB NOT NULL,
    actualizado_en TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`);
    const existing = await pool.query('SELECT id FROM sigpra.estado_mvp WHERE id=1');
    if (existing.rowCount)
        return;
    // Nunca se importan datos sin consentimiento explicito.
    let start = clone(seedData_1.seedData);
    if (node_fs_1.default.existsSync(storage)) {
        if (process.env.SIGPRA_PG_IMPORT_JSON !== '1') {
            throw new Error('Existe data/sigpra-store.json: configura SIGPRA_PG_IMPORT_JSON=1 para importarlo sin reemplazarlo.');
        }
        const saved = JSON.parse(node_fs_1.default.readFileSync(storage, 'utf8'));
        if (!valid(saved))
            throw new Error('JSON local invalido; se cancela importacion para proteger los datos');
        start = saved;
    }
    await pool.query('INSERT INTO sigpra.estado_mvp(id, contenido) VALUES(1, $1::jsonb) ON CONFLICT(id) DO NOTHING', [JSON.stringify(start)]);
}
async function readState() {
    const r = await pool.query('SELECT contenido FROM sigpra.estado_mvp WHERE id = 1');
    if (!r.rows.length || !valid(r.rows[0].contenido))
        throw new Error('Estado PostgreSQL no inicializado o invalido');
    return r.rows[0].contenido;
}
// Todas las mutaciones usan bloqueo de fila en una transaccion.
async function changeState(fn) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const result = await client.query('SELECT contenido FROM sigpra.estado_mvp WHERE id=1 FOR UPDATE');
        const state = result.rows[0]?.contenido;
        if (!valid(state))
            throw new Error('Estado no valido en PostgreSQL');
        const outcome = fn(state);
        if (!valid(state))
            throw new Error('La operacion genero un estado invalido');
        await client.query('UPDATE sigpra.estado_mvp SET contenido=$1::jsonb, actualizado_en=NOW() WHERE id=1', [JSON.stringify(state)]);
        await client.query('COMMIT');
        return outcome;
    }
    catch (error) {
        await client.query('ROLLBACK');
        throw error;
    }
    finally {
        client.release();
    }
}
async function replaceState(next) {
    if (!valid(next))
        throw new Error('Estructura de estado invalida');
    return changeState(state => {
        // Conserva la referencia y reemplaza todo el estado de modo atomico.
        for (const key of Object.keys(state))
            delete state[key];
        Object.assign(state, clone(next));
        return clone(state);
    });
}
async function postgresReady() {
    const r = await pool.query('SELECT 1');
    return r.rowCount === 1;
}
