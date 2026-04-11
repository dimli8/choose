"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUploadSchema = exports.insertUploadSchema = exports.uploads = exports.insertReportSchema = exports.reports = exports.insertCommentSchema = exports.comments = exports.reviewLikes = exports.insertReviewSchema = exports.reviews = exports.insertCourseSchema = exports.courses = exports.insertTeacherSchema = exports.teachers = exports.signupUserSchema = exports.loginUserSchema = exports.updateUserSchema = exports.insertUserSchema = exports.users = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
const drizzle_zod_1 = require("drizzle-zod");
const zod_1 = require("zod");
// ============================================
// Users Table
// ============================================
exports.users = (0, pg_core_1.pgTable)('Users', {
    id: (0, pg_core_1.text)('id')
        .primaryKey()
        .default((0, drizzle_orm_1.sql) `gen_random_uuid()`)
        .notNull(),
    name: (0, pg_core_1.text)('name').notNull(),
    email: (0, pg_core_1.text)('email').notNull().unique(),
    password: (0, pg_core_1.text)('password').notNull(),
    role: (0, pg_core_1.text)('role').notNull().default('student'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow().notNull(),
});
exports.insertUserSchema = (0, drizzle_zod_1.createInsertSchema)(exports.users, {
    name: zod_1.z.string().min(1, 'Name is required'),
    email: zod_1.z.string().email('Please enter a valid email address'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
    role: zod_1.z.enum(['student', 'teacher', 'admin']).optional(),
});
exports.updateUserSchema = exports.insertUserSchema.partial();
exports.loginUserSchema = exports.insertUserSchema.pick({
    email: true,
    password: true,
});
exports.signupUserSchema = exports.insertUserSchema
    .extend({
    confirmPassword: zod_1.z.string().min(6, 'Confirm password must be at least 6 characters'),
})
    .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});
// ============================================
// Teachers Table
// ============================================
exports.teachers = (0, pg_core_1.pgTable)('Teachers', {
    id: (0, pg_core_1.text)('id')
        .primaryKey()
        .default((0, drizzle_orm_1.sql) `gen_random_uuid()`)
        .notNull(),
    name: (0, pg_core_1.text)('name').notNull(),
    college: (0, pg_core_1.text)('college').notNull(),
    title: (0, pg_core_1.text)('title'),
    avatarUrl: (0, pg_core_1.text)('avatar_url'),
    bio: (0, pg_core_1.text)('bio'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow().notNull(),
});
exports.insertTeacherSchema = (0, drizzle_zod_1.createInsertSchema)(exports.teachers, {
    name: zod_1.z.string().min(1, 'Teacher name is required'),
    college: zod_1.z.string().min(1, 'College is required'),
    title: zod_1.z.string().optional(),
    avatarUrl: zod_1.z.string().optional(),
    bio: zod_1.z.string().optional(),
});
// ============================================
// Courses Table
// ============================================
exports.courses = (0, pg_core_1.pgTable)('Courses', {
    id: (0, pg_core_1.text)('id')
        .primaryKey()
        .default((0, drizzle_orm_1.sql) `gen_random_uuid()`)
        .notNull(),
    name: (0, pg_core_1.text)('name').notNull(),
    code: (0, pg_core_1.text)('code').notNull().unique(),
    college: (0, pg_core_1.text)('college').notNull(),
    type: (0, pg_core_1.text)('type').notNull(),
    teacherId: (0, pg_core_1.text)('teacher_id').references(() => exports.teachers.id),
    description: (0, pg_core_1.text)('description'),
    imageUrl: (0, pg_core_1.text)('image_url'),
    credits: (0, pg_core_1.integer)('credits').default(2),
    avgRating: (0, pg_core_1.decimal)('avg_rating', { precision: 3, scale: 2 }).default('0'),
    avgGrading: (0, pg_core_1.decimal)('avg_grading', { precision: 3, scale: 2 }).default('0'),
    avgWorkload: (0, pg_core_1.decimal)('avg_workload', { precision: 3, scale: 2 }).default('0'),
    avgRecommend: (0, pg_core_1.decimal)('avg_recommend', { precision: 3, scale: 2 }).default('0'),
    reviewCount: (0, pg_core_1.integer)('review_count').default(0),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow().notNull(),
});
exports.insertCourseSchema = (0, drizzle_zod_1.createInsertSchema)(exports.courses, {
    name: zod_1.z.string().min(1, 'Course name is required'),
    code: zod_1.z.string().min(1, 'Course code is required'),
    college: zod_1.z.string().min(1, 'College is required'),
    type: zod_1.z.enum(['通识课', '专选课', '体育课']),
    teacherId: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
    imageUrl: zod_1.z.string().optional(),
    credits: zod_1.z.coerce.number().int().positive().optional(),
});
// ============================================
// Reviews Table
// ============================================
exports.reviews = (0, pg_core_1.pgTable)('Reviews', {
    id: (0, pg_core_1.text)('id')
        .primaryKey()
        .default((0, drizzle_orm_1.sql) `gen_random_uuid()`)
        .notNull(),
    courseId: (0, pg_core_1.text)('course_id').notNull().references(() => exports.courses.id),
    userId: (0, pg_core_1.text)('user_id').notNull().references(() => exports.users.id),
    isAnonymous: (0, pg_core_1.boolean)('is_anonymous').default(true),
    content: (0, pg_core_1.text)('content').notNull(),
    rating: (0, pg_core_1.integer)('rating').notNull(),
    grading: (0, pg_core_1.integer)('grading').notNull(),
    workload: (0, pg_core_1.integer)('workload').notNull(),
    recommend: (0, pg_core_1.integer)('recommend').notNull(),
    status: (0, pg_core_1.text)('status').notNull().default('pending'),
    likeCount: (0, pg_core_1.integer)('like_count').default(0),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow().notNull(),
});
exports.insertReviewSchema = (0, drizzle_zod_1.createInsertSchema)(exports.reviews, {
    courseId: zod_1.z.string().min(1, 'Course ID is required'),
    userId: zod_1.z.string().min(1, 'User ID is required'),
    content: zod_1.z.string().min(10, 'Review content must be at least 10 characters'),
    rating: zod_1.z.coerce.number().int().min(1).max(5),
    grading: zod_1.z.coerce.number().int().min(1).max(5),
    workload: zod_1.z.coerce.number().int().min(1).max(4),
    recommend: zod_1.z.coerce.number().int().min(1).max(5),
    isAnonymous: zod_1.z.boolean().optional(),
    status: zod_1.z.enum(['pending', 'approved', 'rejected']).optional(),
});
// ============================================
// Review Likes Table
// ============================================
exports.reviewLikes = (0, pg_core_1.pgTable)('ReviewLikes', {
    id: (0, pg_core_1.text)('id')
        .primaryKey()
        .default((0, drizzle_orm_1.sql) `gen_random_uuid()`)
        .notNull(),
    reviewId: (0, pg_core_1.text)('review_id').notNull().references(() => exports.reviews.id),
    userId: (0, pg_core_1.text)('user_id').notNull().references(() => exports.users.id),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
});
// ============================================
// Comments Table
// ============================================
exports.comments = (0, pg_core_1.pgTable)('Comments', {
    id: (0, pg_core_1.text)('id')
        .primaryKey()
        .default((0, drizzle_orm_1.sql) `gen_random_uuid()`)
        .notNull(),
    reviewId: (0, pg_core_1.text)('review_id').notNull().references(() => exports.reviews.id),
    userId: (0, pg_core_1.text)('user_id').notNull().references(() => exports.users.id),
    content: (0, pg_core_1.text)('content').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
});
exports.insertCommentSchema = (0, drizzle_zod_1.createInsertSchema)(exports.comments, {
    reviewId: zod_1.z.string().min(1),
    userId: zod_1.z.string().min(1),
    content: zod_1.z.string().min(1, 'Comment cannot be empty'),
});
// ============================================
// Reports Table
// ============================================
exports.reports = (0, pg_core_1.pgTable)('Reports', {
    id: (0, pg_core_1.text)('id')
        .primaryKey()
        .default((0, drizzle_orm_1.sql) `gen_random_uuid()`)
        .notNull(),
    reviewId: (0, pg_core_1.text)('review_id').notNull().references(() => exports.reviews.id),
    userId: (0, pg_core_1.text)('user_id').notNull().references(() => exports.users.id),
    reason: (0, pg_core_1.text)('reason').notNull(),
    status: (0, pg_core_1.text)('status').notNull().default('pending'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
});
exports.insertReportSchema = (0, drizzle_zod_1.createInsertSchema)(exports.reports, {
    reviewId: zod_1.z.string().min(1),
    userId: zod_1.z.string().min(1),
    reason: zod_1.z.string().min(1, 'Reason is required'),
});
// ============================================
// Uploads Table
// ============================================
exports.uploads = (0, pg_core_1.pgTable)('Uploads', {
    id: (0, pg_core_1.text)('id')
        .primaryKey()
        .default((0, drizzle_orm_1.sql) `gen_random_uuid()`)
        .notNull(),
    fileName: (0, pg_core_1.text)('file_name').notNull(),
    fileSize: (0, pg_core_1.integer)('file_size').notNull(),
    fileType: (0, pg_core_1.text)('file_type').notNull(),
    s3Key: (0, pg_core_1.text)('s3_key').notNull(),
    s3Url: (0, pg_core_1.text)('s3_url').notNull(),
    uploadId: (0, pg_core_1.text)('upload_id'),
    status: (0, pg_core_1.text)('status').notNull().default('pending'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow().notNull(),
});
exports.insertUploadSchema = (0, drizzle_zod_1.createInsertSchema)(exports.uploads, {
    fileName: zod_1.z.string().min(1, 'File name is required'),
    fileSize: zod_1.z.number().int().positive('File size must be positive'),
    fileType: zod_1.z.string().min(1, 'File type is required'),
    s3Key: zod_1.z.string().min(1, 'S3 key is required'),
    s3Url: zod_1.z.string().url('Invalid S3 URL'),
    uploadId: zod_1.z.string().optional(),
    status: zod_1.z.enum(['pending', 'uploading', 'completed', 'failed']).optional(),
});
exports.updateUploadSchema = exports.insertUploadSchema.partial();
