"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseRepository = exports.CourseRepository = void 0;
const db_1 = require("../db");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
class CourseRepository {
    async findAll(filters) {
        let query = db_1.db
            .select({
            course: schema_1.courses,
            teacher: schema_1.teachers,
        })
            .from(schema_1.courses)
            .leftJoin(schema_1.teachers, (0, drizzle_orm_1.eq)(schema_1.courses.teacherId, schema_1.teachers.id));
        const conditions = [];
        if (filters?.college) {
            conditions.push((0, drizzle_orm_1.eq)(schema_1.courses.college, filters.college));
        }
        if (filters?.type) {
            conditions.push((0, drizzle_orm_1.eq)(schema_1.courses.type, filters.type));
        }
        if (filters?.search) {
            conditions.push((0, drizzle_orm_1.or)((0, drizzle_orm_1.ilike)(schema_1.courses.name, `%${filters.search}%`), (0, drizzle_orm_1.ilike)(schema_1.courses.code, `%${filters.search}%`), (0, drizzle_orm_1.ilike)(schema_1.teachers.name, `%${filters.search}%`)));
        }
        if (conditions.length > 0) {
            query = query.where((0, drizzle_orm_1.and)(...conditions));
        }
        const results = await query;
        let sorted = results;
        if (filters?.sortBy === 'grading') {
            sorted = results.sort((a, b) => Number(b.course.avgGrading) - Number(a.course.avgGrading));
        }
        else if (filters?.sortBy === 'reviews') {
            sorted = results.sort((a, b) => (b.course.reviewCount ?? 0) - (a.course.reviewCount ?? 0));
        }
        else {
            sorted = results.sort((a, b) => Number(b.course.avgRating) - Number(a.course.avgRating));
        }
        return sorted.map(({ course, teacher }) => ({ ...course, teacher }));
    }
    async findById(id) {
        const [result] = await db_1.db
            .select({ course: schema_1.courses, teacher: schema_1.teachers })
            .from(schema_1.courses)
            .leftJoin(schema_1.teachers, (0, drizzle_orm_1.eq)(schema_1.courses.teacherId, schema_1.teachers.id))
            .where((0, drizzle_orm_1.eq)(schema_1.courses.id, id));
        if (!result)
            return null;
        return { ...result.course, teacher: result.teacher };
    }
    async create(data) {
        const [course] = await db_1.db.insert(schema_1.courses).values(data).returning();
        return course;
    }
    async update(id, data) {
        const [course] = await db_1.db
            .update(schema_1.courses)
            .set({ ...data, updatedAt: new Date() })
            .where((0, drizzle_orm_1.eq)(schema_1.courses.id, id))
            .returning();
        return course;
    }
    async delete(id) {
        const result = await db_1.db.delete(schema_1.courses).where((0, drizzle_orm_1.eq)(schema_1.courses.id, id)).returning();
        return result.length > 0;
    }
    async updateStats(courseId) {
        const approvedReviews = await db_1.db
            .select()
            .from(schema_1.reviews)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.reviews.courseId, courseId), (0, drizzle_orm_1.eq)(schema_1.reviews.status, 'approved')));
        if (approvedReviews.length === 0)
            return;
        const count = approvedReviews.length;
        const avgRating = approvedReviews.reduce((s, r) => s + r.rating, 0) / count;
        const avgGrading = approvedReviews.reduce((s, r) => s + r.grading, 0) / count;
        const avgWorkload = approvedReviews.reduce((s, r) => s + r.workload, 0) / count;
        const avgRecommend = approvedReviews.reduce((s, r) => s + r.recommend, 0) / count;
        await db_1.db
            .update(schema_1.courses)
            .set({
            reviewCount: count,
            avgRating: avgRating.toFixed(2),
            avgGrading: avgGrading.toFixed(2),
            avgWorkload: avgWorkload.toFixed(2),
            avgRecommend: avgRecommend.toFixed(2),
            updatedAt: new Date(),
        })
            .where((0, drizzle_orm_1.eq)(schema_1.courses.id, courseId));
    }
    async getColleges() {
        const result = await db_1.db.selectDistinct({ college: schema_1.courses.college }).from(schema_1.courses);
        return result.map((r) => r.college);
    }
}
exports.CourseRepository = CourseRepository;
exports.courseRepository = new CourseRepository();
