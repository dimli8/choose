"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewRepository = exports.ReviewRepository = void 0;
const db_1 = require("../db");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
class ReviewRepository {
    async findByCourse(courseId, status) {
        const conditions = [(0, drizzle_orm_1.eq)(schema_1.reviews.courseId, courseId)];
        if (status)
            conditions.push((0, drizzle_orm_1.eq)(schema_1.reviews.status, status));
        const results = await db_1.db
            .select({ review: schema_1.reviews, user: schema_1.users })
            .from(schema_1.reviews)
            .leftJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.reviews.userId, schema_1.users.id))
            .where((0, drizzle_orm_1.and)(...conditions))
            .orderBy((0, drizzle_orm_1.desc)(schema_1.reviews.createdAt));
        return results.map(({ review, user }) => ({
            ...review,
            userName: review.isAnonymous ? null : user?.name,
        }));
    }
    async findAll(status) {
        const conditions = status ? [(0, drizzle_orm_1.eq)(schema_1.reviews.status, status)] : [];
        const results = await db_1.db
            .select({ review: schema_1.reviews, user: schema_1.users, course: schema_1.courses })
            .from(schema_1.reviews)
            .leftJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.reviews.userId, schema_1.users.id))
            .leftJoin(schema_1.courses, (0, drizzle_orm_1.eq)(schema_1.reviews.courseId, schema_1.courses.id))
            .where(conditions.length > 0 ? (0, drizzle_orm_1.and)(...conditions) : undefined)
            .orderBy((0, drizzle_orm_1.desc)(schema_1.reviews.createdAt));
        return results.map(({ review, user, course }) => ({
            ...review,
            userName: review.isAnonymous ? null : user?.name,
            courseName: course?.name,
            courseCode: course?.code,
        }));
    }
    async findById(id) {
        const [result] = await db_1.db
            .select({ review: schema_1.reviews, user: schema_1.users, course: schema_1.courses })
            .from(schema_1.reviews)
            .leftJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.reviews.userId, schema_1.users.id))
            .leftJoin(schema_1.courses, (0, drizzle_orm_1.eq)(schema_1.reviews.courseId, schema_1.courses.id))
            .where((0, drizzle_orm_1.eq)(schema_1.reviews.id, id));
        if (!result)
            return null;
        return {
            ...result.review,
            userName: result.review.isAnonymous ? null : result.user?.name,
            courseName: result.course?.name,
            courseCode: result.course?.code,
        };
    }
    async create(data) {
        const [review] = await db_1.db.insert(schema_1.reviews).values(data).returning();
        return review;
    }
    async updateStatus(id, status) {
        const [review] = await db_1.db
            .update(schema_1.reviews)
            .set({ status, updatedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(schema_1.reviews.id, id))
            .returning();
        return review;
    }
    async delete(id) {
        const result = await db_1.db.delete(schema_1.reviews).where((0, drizzle_orm_1.eq)(schema_1.reviews.id, id)).returning();
        return result.length > 0;
    }
    async toggleLike(reviewId, userId) {
        const existing = await db_1.db
            .select()
            .from(schema_1.reviewLikes)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.reviewLikes.reviewId, reviewId), (0, drizzle_orm_1.eq)(schema_1.reviewLikes.userId, userId)));
        if (existing.length > 0) {
            await db_1.db.delete(schema_1.reviewLikes).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.reviewLikes.reviewId, reviewId), (0, drizzle_orm_1.eq)(schema_1.reviewLikes.userId, userId)));
            await db_1.db.update(schema_1.reviews).set({ likeCount: db_1.db.$count(schema_1.reviewLikes, (0, drizzle_orm_1.eq)(schema_1.reviewLikes.reviewId, reviewId)) }).where((0, drizzle_orm_1.eq)(schema_1.reviews.id, reviewId));
            // Decrement
            const [rev] = await db_1.db.select().from(schema_1.reviews).where((0, drizzle_orm_1.eq)(schema_1.reviews.id, reviewId));
            await db_1.db.update(schema_1.reviews).set({ likeCount: Math.max(0, (rev?.likeCount ?? 1) - 1) }).where((0, drizzle_orm_1.eq)(schema_1.reviews.id, reviewId));
            return { liked: false };
        }
        else {
            await db_1.db.insert(schema_1.reviewLikes).values({ reviewId, userId });
            const [rev] = await db_1.db.select().from(schema_1.reviews).where((0, drizzle_orm_1.eq)(schema_1.reviews.id, reviewId));
            await db_1.db.update(schema_1.reviews).set({ likeCount: (rev?.likeCount ?? 0) + 1 }).where((0, drizzle_orm_1.eq)(schema_1.reviews.id, reviewId));
            return { liked: true };
        }
    }
    async getLikedByUser(userId) {
        const likes = await db_1.db.select().from(schema_1.reviewLikes).where((0, drizzle_orm_1.eq)(schema_1.reviewLikes.userId, userId));
        return likes.map((l) => l.reviewId);
    }
    async addComment(data) {
        const [comment] = await db_1.db.insert(schema_1.comments).values(data).returning();
        return comment;
    }
    async getComments(reviewId) {
        const results = await db_1.db
            .select({ comment: schema_1.comments, user: schema_1.users })
            .from(schema_1.comments)
            .leftJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.comments.userId, schema_1.users.id))
            .where((0, drizzle_orm_1.eq)(schema_1.comments.reviewId, reviewId))
            .orderBy((0, drizzle_orm_1.desc)(schema_1.comments.createdAt));
        return results.map(({ comment, user }) => ({ ...comment, userName: user?.name }));
    }
    async addReport(data) {
        const [report] = await db_1.db.insert(schema_1.reports).values(data).returning();
        return report;
    }
    async getReports(status) {
        const conditions = status ? [(0, drizzle_orm_1.eq)(schema_1.reports.status, status)] : [];
        const results = await db_1.db
            .select({ report: schema_1.reports, user: schema_1.users, review: schema_1.reviews })
            .from(schema_1.reports)
            .leftJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.reports.userId, schema_1.users.id))
            .leftJoin(schema_1.reviews, (0, drizzle_orm_1.eq)(schema_1.reports.reviewId, schema_1.reviews.id))
            .where(conditions.length > 0 ? (0, drizzle_orm_1.and)(...conditions) : undefined)
            .orderBy((0, drizzle_orm_1.desc)(schema_1.reports.createdAt));
        return results.map(({ report, user, review }) => ({
            ...report,
            reporterName: user?.name,
            reviewContent: review?.content,
        }));
    }
    async updateReportStatus(id, status) {
        const [report] = await db_1.db.update(schema_1.reports).set({ status }).where((0, drizzle_orm_1.eq)(schema_1.reports.id, id)).returning();
        return report;
    }
}
exports.ReviewRepository = ReviewRepository;
exports.reviewRepository = new ReviewRepository();
