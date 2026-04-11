"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const drizzle_kit_1 = require("drizzle-kit");
require("dotenv/config");
if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is required');
}
exports.default = (0, drizzle_kit_1.defineConfig)({
    schema: './backend/db/schema.ts',
    out: './backend/db/migrations',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
    },
    migrations: {
        prefix: 'timestamp',
    },
    verbose: true,
    strict: true,
});
