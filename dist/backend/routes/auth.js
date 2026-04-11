"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_1 = require("../repositories/users");
const schema_1 = require("../db/schema");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const constants_1 = require("../config/constants");
const errorHandler_1 = require("../middleware/errorHandler");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const userRepo = new users_1.UserRepository();
// Signup route
const signupHandler = async (req, res, next) => {
    try {
        const validatedData = schema_1.signupUserSchema.parse(req.body);
        const existingUser = await userRepo.findByEmail(validatedData.email);
        if (existingUser) {
            throw new errorHandler_1.AppError(constants_1.AUTH_ERRORS.EMAIL_ALREADY_EXISTS, 400);
        }
        const user = await userRepo.create({
            email: validatedData.email,
            password: validatedData.password,
            name: validatedData.name,
        });
        const token = generateToken(user);
        res.status(201).json({
            success: true,
            data: {
                message: 'Signup successful',
                token,
                user: sanitizeUser(user),
            },
        });
    }
    catch (error) {
        next(error);
    }
};
// Login route
const loginHandler = (req, res) => {
    const user = req.user;
    const token = generateToken(user);
    res.json({
        success: true,
        data: {
            message: 'Login successful',
            token,
            user: sanitizeUser(user),
        },
    });
};
// Get current user
const getCurrentUser = (req, res) => {
    const user = req.user;
    res.json({
        success: true,
        data: {
            user: sanitizeUser(user),
        },
    });
};
// Helper functions
const generateToken = (user) => {
    const jwtSecret = constants_1.JWT_CONFIG.SECRET || constants_1.JWT_CONFIG.FALLBACK_SECRET;
    return jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, jwtSecret, {
        expiresIn: constants_1.JWT_CONFIG.EXPIRES_IN,
    });
};
const sanitizeUser = (user) => ({
    id: user.id,
    email: user.email,
    name: user.name,
});
// Routes
router.post('/signup', signupHandler);
router.post('/login', auth_1.authenticateLocal, loginHandler);
router.get('/me', auth_1.authenticateJWT, getCurrentUser);
exports.default = router;
