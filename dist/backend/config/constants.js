"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AUTH_ERRORS = exports.JWT_CONFIG = exports.SERVER_CONFIG = void 0;
exports.SERVER_CONFIG = {
    PORT: process.env.PORT || 3002,
    NODE_ENV: process.env.NODE_ENV || 'development',
};
exports.JWT_CONFIG = {
    SECRET: process.env.JWT_SECRET,
    FALLBACK_SECRET: 'fallback_secret_change_in_production',
    EXPIRES_IN: '7d',
};
exports.AUTH_ERRORS = {
    UNAUTHORIZED: 'Unauthorized',
    INVALID_CREDENTIALS: 'Invalid email or password',
    EMAIL_ALREADY_EXISTS: 'Email already exists',
    USER_NOT_FOUND: 'User not found',
};
