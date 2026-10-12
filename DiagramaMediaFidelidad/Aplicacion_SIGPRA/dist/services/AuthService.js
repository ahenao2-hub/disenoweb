"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const SigpraStore_1 = require("../models/SigpraStore");
class AuthService {
    static login(email, password) {
        const user = SigpraStore_1.sigpraStore.all().users.find((item) => item.email === email && item.password === password);
        if (!user)
            return null;
        const { password: _hidden, ...safeUser } = user;
        return safeUser;
    }
}
exports.AuthService = AuthService;
