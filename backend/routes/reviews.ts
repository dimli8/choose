import { Router, Request, Response, NextFunction } from 'express';
import { reviewRepository } from '../repositories/reviews';
import { courseRepository } from '../repositories/courses';
import { insertReviewSchema, insertCommentSchema, insertReportSchema } from '../db/schema';
import { authenticateJWT, AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const router = Router();

// GET /api/reviews - get all approved reviews (recent feed)
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reviewList = await reviewRepository.findAll('approved');
    res.json({ success: true, data: reviewList });
  } catch (error) {
    next(error);
  }
});

// GET /api/reviews/course/:courseId - get reviews for a course
router.get('/course/:courseId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const courseId = req.params.courseId as string;
    const reviewList = await reviewRepository.findByCourse(courseId, 'approved');
    res.json({ success: true, data: reviewList });
  } catch (error) {
    next(error);
  }
});

// GET /api/reviews/admin/all - get all reviews for admin
router.get('/admin/all', authenticateJWT, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as AuthRequest).user;
    if (user?.role !== 'admin') throw new AppError('Forbidden', 403);
    const status = req.query.status as string | undefined;
    const reviewList = await reviewRepository.findAll(status);
    res.json({ success: true, data: reviewList });
  } catch (error) {
    next(error);
  }
});

// POST /api/reviews - create review (authenticated)
router.post('/', authenticateJWT, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as AuthRequest).user!;
    const validated = insertReviewSchema.parse({ ...req.body, userId: user.id });
    const review = await reviewRepository.create(validated);
    res.status(201).json({ success: true, data: review });
  } catch (error) {
    next(error);
  }
});

// PUT /api/reviews/:id/status - update review status (admin)
router.put('/:id/status', authenticateJWT, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as AuthRequest).user;
    if (user?.role !== 'admin') throw new AppError('Forbidden', 403);
    const { status } = req.body as { status: string };
    const review = await reviewRepository.updateStatus(req.params.id as string, status);
    // Update course stats if approved
    if (status === 'approved' && review) {
      await courseRepository.updateStats(review.courseId);
    }
    res.json({ success: true, data: review });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/reviews/:id - delete review (admin)
router.delete('/:id', authenticateJWT, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as AuthRequest).user;
    if (user?.role !== 'admin') throw new AppError('Forbidden', 403);
    await reviewRepository.delete(req.params.id as string);
    res.json({ success: true, data: null });
  } catch (error) {
    next(error);
  }
});

// POST /api/reviews/:id/like - toggle like
router.post('/:id/like', authenticateJWT, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as AuthRequest).user!;
    const result = await reviewRepository.toggleLike(req.params.id as string, user.id);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});

// GET /api/reviews/likes/me - get liked review IDs for current user
router.get('/likes/me', authenticateJWT, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as AuthRequest).user!;
    const likedIds = await reviewRepository.getLikedByUser(user.id);
    res.json({ success: true, data: likedIds });
  } catch (error) {
    next(error);
  }
});

// GET /api/reviews/:id/comments - get comments for a review
router.get('/:id/comments', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const commentList = await reviewRepository.getComments(req.params.id as string);
    res.json({ success: true, data: commentList });
  } catch (error) {
    next(error);
  }
});

// POST /api/reviews/:id/comments - add comment
router.post('/:id/comments', authenticateJWT, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as AuthRequest).user!;
    const validated = insertCommentSchema.parse({
      reviewId: req.params.id,
      userId: user.id,
      content: req.body.content,
    });
    const comment = await reviewRepository.addComment(validated);
    res.status(201).json({ success: true, data: comment });
  } catch (error) {
    next(error);
  }
});

// POST /api/reviews/:id/report - report a review
router.post('/:id/report', authenticateJWT, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as AuthRequest).user!;
    const validated = insertReportSchema.parse({
      reviewId: req.params.id,
      userId: user.id,
      reason: req.body.reason,
    });
    const report = await reviewRepository.addReport(validated);
    res.status(201).json({ success: true, data: report });
  } catch (error) {
    next(error);
  }
});

// GET /api/reviews/reports/all - get all reports (admin)
router.get('/reports/all', authenticateJWT, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as AuthRequest).user;
    if (user?.role !== 'admin') throw new AppError('Forbidden', 403);
    const reportList = await reviewRepository.getReports();
    res.json({ success: true, data: reportList });
  } catch (error) {
    next(error);
  }
});

export default router;
