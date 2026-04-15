"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const protect = (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    else if (req.cookies && req.cookies.telemed_token) {
        token = req.cookies.telemed_token;
    }
    if (token) {
        try {
            // Verify token
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            // Mock user attachment (In real app, fetch user from DB)
            req.user = { id: decoded.id, role: decoded.role };
            next();
            return;
        }
        catch (error) {
            console.error(error);
            // Ignore error, fall through to token missing
        }
    }
    // Token missing or invalid
    if (req.originalUrl.startsWith('/api')) {
        res.status(401).json({ message: 'Not authorized, token failed or missing' });
    }
    else {
        res.redirect('/login.html');
    }
};
exports.protect = protect;
