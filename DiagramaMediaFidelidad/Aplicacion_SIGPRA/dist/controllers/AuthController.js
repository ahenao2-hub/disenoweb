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
    static register(req, res) {
        try {
            const { name, email, password, code, semester } = req.body;
            if (!name || !email || !password) {
                return res.status(400).json({ error: "Nombre, correo y contraseña son obligatorios." });
            }
            const user = AuthService_1.AuthService.register({ name, email, password, code, semester });
            return res.status(201).json({ message: "Estudiante registrado exitosamente.", user });
        }
        catch (error) {
            return res.status(400).json({ error: error.message || "Error al registrar el estudiante." });
        }
    }
}
exports.AuthController = AuthController;
