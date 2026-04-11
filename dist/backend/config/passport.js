"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const passport_jwt_1 = require("passport-jwt");
const users_1 = require("../repositories/users");
const constants_1 = require("./constants");
const userRepo = new users_1.UserRepository();
// Configure local strategy for username/password authentication
passport_1.default.use(new passport_local_1.Strategy({
    usernameField: 'email',
    passwordField: 'password',
}, async (email, password, done) => {
    try {
        // Find the user by email
        const user = await userRepo.findByEmail(email);
        // If user not found or password doesn't match
        if (!user) {
            return done(null, false, { message: 'Invalid email or password' });
        }
        // Verify password
        const isValidPassword = await userRepo.verifyPassword(password, user.password);
        if (!isValidPassword) {
            return done(null, false, { message: 'Invalid email or password' });
        }
        // Return the user without the password
        const { password: _, ...userWithoutPassword } = user;
        return done(null, userWithoutPassword);
    }
    catch (error) {
        return done(error);
    }
}));
// Configure JWT strategy for token authentication
const jwtSecret = constants_1.JWT_CONFIG.SECRET || constants_1.JWT_CONFIG.FALLBACK_SECRET;
passport_1.default.use(new passport_jwt_1.Strategy({
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwtSecret,
}, async (jwtPayload, done) => {
    try {
        // Find the user by email from JWT payload
        const user = await userRepo.findByEmail(jwtPayload.email);
        if (!user) {
            return done(null, false);
        }
        // Return the user without the password
        const { password: _, ...userWithoutPassword } = user;
        return done(null, userWithoutPassword);
    }
    catch (error) {
        return done(error, false);
    }
}));
exports.default = passport_1.default;
