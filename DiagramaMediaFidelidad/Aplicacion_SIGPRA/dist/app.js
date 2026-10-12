"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const routes_1 = require("./postgres/routes");
const routes_2 = require("./routes");
function createApp() {
    const app = (0, express_1.default)();
    const publicDir = process.cwd();
    app.use((0, cors_1.default)());
    app.use(express_1.default.json({ limit: "2mb" }));
    app.use("/api", process.env.SIGPRA_STORAGE === "postgres" ? routes_1.postgresRouter : routes_2.apiRouter);
    app.get("/", (_req, res) => res.sendFile(path_1.default.join(publicDir, "index.html")));
    app.get("/app.js", (_req, res) => res.sendFile(path_1.default.join(publicDir, "app.js")));
    app.get("/styles.css", (_req, res) => res.sendFile(path_1.default.join(publicDir, "styles.css")));
    return app;
}
