import { db } from '../db';
import { reviews, users, courses, comments, reviewLikes, reports, Review, InsertReview, insertReviewSchema, insertCommentSchema, insertReportSchema } from '../db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { z } from 'zod';

type CreateReviewInput = z.infer<typeof insertReviewSchema>;
type CreateCommentInput = z.infer<typeof insertCommentSchema>;
type CreateReportInput = z.infer<typeof insertReportSchema>;

export class ReviewRepository {
  async findByCourse(courseId: string, status?: string) {
    const conditions = [eq(reviews.courseId, courseId)];
    if (status) conditions.push(eq(reviews.status, status));

    const results = await db
      .select({ review: reviews, user: users })
      .from(reviews)
      .leftJoin(users, eq(reviews.userId, users.id))
      .where(and(...conditions))
      .orderBy(desc(reviews.createdAt));

    return results.map(({ review, user }) => ({
      ...review,
      userName: review.isAnonymous ? null : user?.name,
    }));
  }

  async findAll(status?: string) {
    const conditions = status ? [eq(reviews.status, status)] : [];

    const results = await db
      .select({ review: reviews, user: users, course: courses })
      .from(reviews)
      .leftJoin(users, eq(reviews.userId, users.id))
      .leftJoin(courses, eq(reviews.courseId, courses.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(reviews.createdAt));

    return results.map(({ review, user, course }) => ({
      ...review,
      userName: review.isAnonymous ? null : user?.name,
      courseName: course?.name,
      courseCode: course?.code,
    }));
  }

  async findById(id: string) {
    const [result] = await db
      .select({ review: reviews, user: users, course: courses })
      .from(reviews)
      .leftJoin(users, eq(reviews.userId, users.id))
      .leftJoin(courses, eq(reviews.courseId, courses.id))
      .where(eq(reviews.id, id));
    if (!result) return null;
    return {
      ...result.review,
      userName: result.review.isAnonymous ? null : result.user?.name,
      courseName: result.course?.name,
      courseCode: result.course?.code,
    };
  }

  async create(data: CreateReviewInput) {
    const [review] = await db.insert(reviews).values(data as InsertReview).returning();
    return review;
  }

  async updateStatus(id: string, status: string) {
    const [review] = await db
      .update(reviews)
      .set({ status, updatedAt: new Date() })
      .where(eq(reviews.id, id))
      .returning();
    return review;
  }

  async delete(id: string) {
    const result = await db.delete(reviews).where(eq(reviews.id, id)).returning();
    return result.length > 0;
  }

  async toggleLike(reviewId: string, userId: string) {
    const existing = await db
      .select()
      .from(reviewLikes)
      .where(and(eq(reviewLikes.reviewId, reviewId), eq(reviewLikes.userId, userId)));

    if (existing.length > 0) {
      await db.delete(reviewLikes).where(and(eq(reviewLikes.reviewId, reviewId), eq(reviewLikes.userId, userId)));
      await db.update(reviews).set({ likeCount: db.$count(reviewLikes, eq(reviewLikes.reviewId, reviewId)) }).where(eq(reviews.id, reviewId));
      // Decrement
      const [rev] = await db.select().from(reviews).where(eq(reviews.id, reviewId));
      await db.update(reviews).set({ likeCount: Math.max(0, (rev?.likeCount ?? 1) - 1) }).where(eq(reviews.id, reviewId));
      return { liked: false };
    } else {
      await db.insert(reviewLikes).values({ reviewId, userId });
      const [rev] = await db.select().from(reviews).where(eq(reviews.id, reviewId));
      await db.update(reviews).set({ likeCount: (rev?.likeCount ?? 0) + 1 }).where(eq(reviews.id, reviewId));
      return { liked: true };
    }
  }

  async getLikedByUser(userId: string) {
    const likes = await db.select().from(reviewLikes).where(eq(reviewLikes.userId, userId));
    return likes.map((l) => l.reviewId);
  }

  async addComment(data: CreateCommentInput) {
    const [comment] = await db.insert(comments).values(data as typeof comments.$inferInsert).returning();
    return comment;
  }

  async getComments(reviewId: string) {
    const results = await db
      .select({ comment: comments, user: users })
      .from(comments)
      .leftJoin(users, eq(comments.userId, users.id))
      .where(eq(comments.reviewId, reviewId))
      .orderBy(desc(comments.createdAt));
    return results.map(({ comment, user }) => ({ ...comment, userName: user?.name }));
  }

  async addReport(data: CreateReportInput) {
    const [report] = await db.insert(reports).values(data as typeof reports.$inferInsert).returning();
    return report;
  }

  async getReports(status?: string) {
    const conditions = status ? [eq(reports.status, status)] : [];
    const results = await db
      .select({ report: reports, user: users, review: reviews })
      .from(reports)
      .leftJoin(users, eq(reports.userId, users.id))
      .leftJoin(reviews, eq(reports.reviewId, reviews.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(reports.createdAt));
    return results.map(({ report, user, review }) => ({
      ...report,
      reporterName: user?.name,
      reviewContent: review?.content,
    }));
  }

  async updateReportStatus(id: string, status: string) {
    const [report] = await db.update(reports).set({ status }).where(eq(reports.id, id)).returning();
    return report;
  }
}

export const reviewRepository = new ReviewRepository();
