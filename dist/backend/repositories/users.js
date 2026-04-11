"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRepository = exports.UserRepository = void 0;
const db_1 = require("../db");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class UserRepository {
    async create(userData) {
        // Hash password before storing
        const hashedPassword = await bcryptjs_1.default.hash(userData.password, 10);
        const [user] = await db_1.db
            .insert(schema_1.users)
            // Drizzle expects InsertUser; we trust Zod validation and assert here.
            .values({
            ...userData,
            password: hashedPassword,
        })
            .returning();
        return user;
    }
    async findByEmail(email) {
        const [user] = await db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.email, email));
        return user;
    }
    async findAll() {
        return await db_1.db.select().from(schema_1.users);
    }
    async verifyPassword(plainPassword, hashedPassword) {
        return bcryptjs_1.default.compare(plainPassword, hashedPassword);
    }
}
exports.UserRepository = UserRepository;
exports.userRepository = new UserRepository();
