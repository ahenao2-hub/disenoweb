"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const AuthService_1 = require("../services/AuthService");
class AuthController {
    static login(req, res) {
        const user = AuthService_1.AuthService.login(String(req.body.email || ""), String(req.body.password || ""));
        if (!user)
            return res.status(401).json({ message: "Credenciales invalidas" });
        return res.json({ user });
    }
}
exports.AuthController = AuthController;
