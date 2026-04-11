import { db } from '../db';
import { courses, teachers, reviews, Course, InsertCourse, insertCourseSchema } from '../db/schema';
import { eq, ilike, or, and, desc, sql } from 'drizzle-orm';
import { z } from 'zod';

type CreateCourseInput = z.infer<typeof insertCourseSchema>;

export class CourseRepository {
  async findAll(filters?: {
    college?: string;
    type?: string;
    search?: string;
    sortBy?: string;
    gradeFilter?: string;
  }) {
    let query = db
      .select({
        course: courses,
        teacher: teachers,
      })
      .from(courses)
      .leftJoin(teachers, eq(courses.teacherId, teachers.id));

    const conditions = [];

    if (filters?.college) {
      conditions.push(eq(courses.college, filters.college));
    }
    if (filters?.type) {
      conditions.push(eq(courses.type, filters.type));
    }
    if (filters?.search) {
      conditions.push(
        or(
          ilike(courses.name, `%${filters.search}%`),
          ilike(courses.code, `%${filters.search}%`),
          ilike(teachers.name, `%${filters.search}%`)
        )
      );
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as typeof query;
    }

    const results = await query;

    let sorted = results;
    if (filters?.sortBy === 'grading') {
      sorted = results.sort((a, b) => Number(b.course.avgGrading) - Number(a.course.avgGrading));
    } else if (filters?.sortBy === 'reviews') {
      sorted = results.sort((a, b) => (b.course.reviewCount ?? 0) - (a.course.reviewCount ?? 0));
    } else {
      sorted = results.sort((a, b) => Number(b.course.avgRating) - Number(a.course.avgRating));
    }

    return sorted.map(({ course, teacher }) => ({ ...course, teacher }));
  }

  async findById(id: string) {
    const [result] = await db
      .select({ course: courses, teacher: teachers })
      .from(courses)
      .leftJoin(teachers, eq(courses.teacherId, teachers.id))
      .where(eq(courses.id, id));
    if (!result) return null;
    return { ...result.course, teacher: result.teacher };
  }

  async create(data: CreateCourseInput) {
    const [course] = await db.insert(courses).values(data as InsertCourse).returning();
    return course;
  }

  async update(id: string, data: Partial<CreateCourseInput>) {
    const [course] = await db
      .update(courses)
      .set({ ...data as Partial<InsertCourse>, updatedAt: new Date() })
      .where(eq(courses.id, id))
      .returning();
    return course;
  }

  async delete(id: string) {
    const result = await db.delete(courses).where(eq(courses.id, id)).returning();
    return result.length > 0;
  }

  async updateStats(courseId: string) {
    const approvedReviews = await db
      .select()
      .from(reviews)
      .where(and(eq(reviews.courseId, courseId), eq(reviews.status, 'approved')));

    if (approvedReviews.length === 0) return;

    const count = approvedReviews.length;
    const avgRating = approvedReviews.reduce((s, r) => s + r.rating, 0) / count;
    const avgGrading = approvedReviews.reduce((s, r) => s + r.grading, 0) / count;
    const avgWorkload = approvedReviews.reduce((s, r) => s + r.workload, 0) / count;
    const avgRecommend = approvedReviews.reduce((s, r) => s + r.recommend, 0) / count;

    await db
      .update(courses)
      .set({
        reviewCount: count,
        avgRating: avgRating.toFixed(2),
        avgGrading: avgGrading.toFixed(2),
        avgWorkload: avgWorkload.toFixed(2),
        avgRecommend: avgRecommend.toFixed(2),
        updatedAt: new Date(),
      })
      .where(eq(courses.id, courseId));
  }

  async getColleges() {
    const result = await db.selectDistinct({ college: courses.college }).from(courses);
    return result.map((r) => r.college);
  }
}

export const courseRepository = new CourseRepository();
