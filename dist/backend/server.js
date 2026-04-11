"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const passport_1 = __importDefault(require("./config/passport"));
const constants_1 = require("./config/constants");
const errorHandler_1 = require("./middleware/errorHandler");
const auth_1 = __importDefault(require("./routes/auth"));
const courses_1 = __importDefault(require("./routes/courses"));
const reviews_1 = __importDefault(require("./routes/reviews"));
const app = (0, express_1.default)();
/**
 * Body Parsers
 */
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
/**
 * Passport initialization
 */
app.use(passport_1.default.initialize());
/**
 * Static Files
 */
const REACT_BUILD_FOLDER = path_1.default.join(__dirname, '..', 'frontend', 'dist');
app.use(express_1.default.static(REACT_BUILD_FOLDER, {
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.css') || filePath.endsWith('.js')) {
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
            res.setHeader('Pragma', 'no-cache');
            res.setHeader('Expires', '0');
        }
    },
}));
app.use('/assets', express_1.default.static(path_1.default.join(REACT_BUILD_FOLDER, 'assets'), {
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.css') || filePath.endsWith('.js')) {
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
            res.setHeader('Pragma', 'no-cache');
            res.setHeader('Expires', '0');
        }
    },
}));
/**
 * API Routes
 */
app.use('/api/auth', auth_1.default);
app.use('/api/courses', courses_1.default);
app.use('/api/reviews', reviews_1.default);
/**
 * SPA Fallback Route
 */
app.get('*', (_req, res) => {
    res.sendFile(path_1.default.join(REACT_BUILD_FOLDER, 'index.html'));
});
/**
 * Error Handler
 */
app.use(errorHandler_1.errorHandler);
/**
 * Start Server
 */
app.listen(constants_1.SERVER_CONFIG.PORT, () => {
    console.log(`Server ready on port ${constants_1.SERVER_CONFIG.PORT}`);
});
exports.default = app;
