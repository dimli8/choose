import { pgTable, text, timestamp, integer, boolean, decimal } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

// ============================================
// Users Table
// ============================================
export const users = pgTable('Users', {
  id: text('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`)
    .notNull(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  role: text('role').notNull().default('student'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users, {
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['student', 'teacher', 'admin']).optional(),
});

export const updateUserSchema = insertUserSchema.partial();

export const loginUserSchema = insertUserSchema.pick({
  email: true,
  password: true,
});

export const signupUserSchema = insertUserSchema
  .extend({
    confirmPassword: z.string().min(6, 'Confirm password must be at least 6 characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type LoginUserInput = z.infer<typeof loginUserSchema>;
export type SignupUserInput = z.infer<typeof signupUserSchema>;

// ============================================
// Teachers Table
// ============================================
export const teachers = pgTable('Teachers', {
  id: text('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`)
    .notNull(),
  name: text('name').notNull(),
  college: text('college').notNull(),
  title: text('title'),
  avatarUrl: text('avatar_url'),
  bio: text('bio'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const insertTeacherSchema = createInsertSchema(teachers, {
  name: z.string().min(1, 'Teacher name is required'),
  college: z.string().min(1, 'College is required'),
  title: z.string().optional(),
  avatarUrl: z.string().optional(),
  bio: z.string().optional(),
});

export type Teacher = typeof teachers.$inferSelect;
export type InsertTeacher = typeof teachers.$inferInsert;

// ============================================
// Courses Table
// ============================================
export const courses = pgTable('Courses', {
  id: text('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`)
    .notNull(),
  name: text('name').notNull(),
  code: text('code').notNull().unique(),
  college: text('college').notNull(),
  type: text('type').notNull(),
  teacherId: text('teacher_id').references(() => teachers.id),
  description: text('description'),
  imageUrl: text('image_url'),
  credits: integer('credits').default(2),
  avgRating: decimal('avg_rating', { precision: 3, scale: 2 }).default('0'),
  avgGrading: decimal('avg_grading', { precision: 3, scale: 2 }).default('0'),
  avgWorkload: decimal('avg_workload', { precision: 3, scale: 2 }).default('0'),
  avgRecommend: decimal('avg_recommend', { precision: 3, scale: 2 }).default('0'),
  reviewCount: integer('review_count').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const insertCourseSchema = createInsertSchema(courses, {
  name: z.string().min(1, 'Course name is required'),
  code: z.string().min(1, 'Course code is required'),
  college: z.string().min(1, 'College is required'),
  type: z.enum(['通识课', '专选课', '体育课']),
  teacherId: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  credits: z.coerce.number().int().positive().optional(),
});

export type Course = typeof courses.$inferSelect;
export type InsertCourse = typeof courses.$inferInsert;

// ============================================
// Reviews Table
// ============================================
export const reviews = pgTable('Reviews', {
  id: text('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`)
    .notNull(),
  courseId: text('course_id').notNull().references(() => courses.id),
  userId: text('user_id').notNull().references(() => users.id),
  isAnonymous: boolean('is_anonymous').default(true),
  content: text('content').notNull(),
  rating: integer('rating').notNull(),
  grading: integer('grading').notNull(),
  workload: integer('workload').notNull(),
  recommend: integer('recommend').notNull(),
  status: text('status').notNull().default('pending'),
  likeCount: integer('like_count').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const insertReviewSchema = createInsertSchema(reviews, {
  courseId: z.string().min(1, 'Course ID is required'),
  userId: z.string().min(1, 'User ID is required'),
  content: z.string().min(10, 'Review content must be at least 10 characters'),
  rating: z.coerce.number().int().min(1).max(5),
  grading: z.coerce.number().int().min(1).max(5),
  workload: z.coerce.number().int().min(1).max(4),
  recommend: z.coerce.number().int().min(1).max(5),
  isAnonymous: z.boolean().optional(),
  status: z.enum(['pending', 'approved', 'rejected']).optional(),
});

export type Review = typeof reviews.$inferSelect;
export type InsertReview = typeof reviews.$inferInsert;

// ============================================
// Review Likes Table
// ============================================
export const reviewLikes = pgTable('ReviewLikes', {
  id: text('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`)
    .notNull(),
  reviewId: text('review_id').notNull().references(() => reviews.id),
  userId: text('user_id').notNull().references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type ReviewLike = typeof reviewLikes.$inferSelect;

// ============================================
// Comments Table
// ============================================
export const comments = pgTable('Comments', {
  id: text('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`)
    .notNull(),
  reviewId: text('review_id').notNull().references(() => reviews.id),
  userId: text('user_id').notNull().references(() => users.id),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const insertCommentSchema = createInsertSchema(comments, {
  reviewId: z.string().min(1),
  userId: z.string().min(1),
  content: z.string().min(1, 'Comment cannot be empty'),
});

export type Comment = typeof comments.$inferSelect;
export type InsertComment = typeof comments.$inferInsert;

// ============================================
// Reports Table
// ============================================
export const reports = pgTable('Reports', {
  id: text('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`)
    .notNull(),
  reviewId: text('review_id').notNull().references(() => reviews.id),
  userId: text('user_id').notNull().references(() => users.id),
  reason: text('reason').notNull(),
  status: text('status').notNull().default('pending'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const insertReportSchema = createInsertSchema(reports, {
  reviewId: z.string().min(1),
  userId: z.string().min(1),
  reason: z.string().min(1, 'Reason is required'),
});

export type Report = typeof reports.$inferSelect;
export type InsertReport = typeof reports.$inferInsert;

// ============================================
// Uploads Table
// ============================================
export const uploads = pgTable('Uploads', {
  id: text('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`)
    .notNull(),
  fileName: text('file_name').notNull(),
  fileSize: integer('file_size').notNull(),
  fileType: text('file_type').notNull(),
  s3Key: text('s3_key').notNull(),
  s3Url: text('s3_url').notNull(),
  uploadId: text('upload_id'),
  status: text('status').notNull().default('pending'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const insertUploadSchema = createInsertSchema(uploads, {
  fileName: z.string().min(1, 'File name is required'),
  fileSize: z.number().int().positive('File size must be positive'),
  fileType: z.string().min(1, 'File type is required'),
  s3Key: z.string().min(1, 'S3 key is required'),
  s3Url: z.string().url('Invalid S3 URL'),
  uploadId: z.string().optional(),
  status: z.enum(['pending', 'uploading', 'completed', 'failed']).optional(),
});

export const updateUploadSchema = insertUploadSchema.partial();

export type Upload = typeof uploads.$inferSelect;
export type InsertUpload = typeof uploads.$inferInsert;
