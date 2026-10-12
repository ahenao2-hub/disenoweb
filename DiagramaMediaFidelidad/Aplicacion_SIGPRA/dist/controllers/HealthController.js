"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthController = void 0;
class HealthController {
    static show(_req, res) {
        res.json({
            ok: true,
            service: "SIGPRA API MVC",
            stack: ["Node.js", "Express", "TypeScript", "MVC"],
            apis: ["/api/auth/login", "/api/periods", "/api/agreements", "/api/assignments", "/api/reports/consolidated"]
        });
    }
}
exports.HealthController = HealthController;
