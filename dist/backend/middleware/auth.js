"use strict";
/**
 * Backend Authentication Middleware
 *
 * This file contains Express.js middleware for protecting backend routes.
 * Do NOT confuse this with frontend route protection (ProtectedRoute component).
 *
 * Backend (Express) route protection:
 * ✅ CORRECT:
 * import { authenticateJWT } from '../middleware/auth';
 * router.post('/api/protected', authenticateJWT, handler);
 *
 * ❌ INCORRECT:
 * router.post('/api/protected', requireAuth, handler);     // Don't use this name
 * router.post('/api/protected', authenticate, handler);    // Don't use this name
 * router.post('/api/protected', authenticateJWT());       // Don't call as function
 *
 * Note: While the frontend's ProtectedRoute component uses a prop named 'requireAuth',
 * this is completely separate from backend middleware. They serve different purposes:
 * - Backend (this file): Protects API endpoints using JWT validation
 * - Frontend (ProtectedRoute): Controls React component rendering based on auth state
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateJWT = authenticateJWT;
exports.authenticateLocal = authenticateLocal;
const passport_1 = __importDefault(require("passport"));
const constants_1 = require("../config/constants");
const errorHandler_1 = require("./errorHandler");
// Middleware for routes that require authentication
function authenticateJWT(req, res, next) {
    passport_1.default.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return next(new errorHandler_1.AppError(constants_1.AUTH_ERRORS.UNAUTHORIZED, 401));
        }
        // Set user on request
        req.user = user;
        next();
    })(req, res, next);
}
// Middleware for login and signup
function authenticateLocal(req, res, next) {
    passport_1.default.authenticate('local', { session: false }, (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return next(new errorHandler_1.AppError(info?.message || constants_1.AUTH_ERRORS.INVALID_CREDENTIALS, 401));
        }
        // Set user on request
        req.user = user;
        next();
    })(req, res, next);
}
