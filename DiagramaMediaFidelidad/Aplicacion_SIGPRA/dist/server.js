"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = require("./app");
const state_1 = require("./postgres/state");
async function main() {
    if (process.env.SIGPRA_STORAGE === 'postgres') {
        await (0, state_1.setupPostgres)();
        console.log('SIGPRA: PostgreSQL conectado');
    }
    const port = Number(process.env.PORT || 3000);
    (0, app_1.createApp)().listen(port, () => console.log('SIGPRA API MVC disponible en http://localhost:' + port));
}
main().catch(err => { console.error('No se pudo iniciar SIGPRA:', err.message); process.exitCode = 1; });
