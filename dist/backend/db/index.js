"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
require("dotenv/config");
const postgres_js_1 = require("drizzle-orm/postgres-js");
const postgres_1 = __importDefault(require("postgres"));
const schema = __importStar(require("./schema"));
// In-memory database for development fallback
class InMemoryDB {
    data = {
        users: [],
        teachers: [],
        courses: [],
        reviews: [],
        reviewLikes: [],
        comments: [],
        reports: [],
        uploads: []
    };
    generateId() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    async insert(table, data) {
        const id = this.generateId();
        const now = new Date().toISOString();
        const item = {
            id,
            ...data,
            createdAt: now,
            updatedAt: now
        };
        if (this.data[table]) {
            this.data[table].push(item);
        }
        return [item];
    }
    async select(table, where) {
        let items = this.data[table] || [];
        if (where) {
            const key = Object.keys(where)[0];
            const value = where[key];
            items = items.filter(item => item[key] === value);
        }
        return items;
    }
    async execute(sql, params) {
        return { success: true };
    }
}
let db;
try {
    // Try to connect to PostgreSQL
    const connectionString = process.env.DATABASE_URL;
    if (connectionString) {
        const client = (0, postgres_1.default)(connectionString);
        exports.db = db = (0, postgres_js_1.drizzle)(client, { schema });
        console.log('Connected to PostgreSQL database');
    }
    else {
        throw new Error('DATABASE_URL not found');
    }
}
catch (error) {
    // Fallback to in-memory database
    console.warn('PostgreSQL connection failed, using in-memory database:', error.message);
    exports.db = db = new InMemoryDB();
}
__exportStar(require("./schema"), exports);
