import { Router, Request, Response, NextFunction } from 'express';
import { courseRepository } from '../repositories/courses';
import { insertCourseSchema } from '../db/schema';
import { authenticateJWT, AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const router = Router();

// GET /api/courses - list all courses with optional filters
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { college, type, search, sortBy, gradeFilter } = req.query as Record<string, string>;
    const courseList = await courseRepository.findAll({ college, type, search, sortBy, gradeFilter });
    res.json({ success: true, data: courseList });
  } catch (error) {
    next(error);
  }
});

// GET /api/courses/colleges - get distinct colleges
router.get('/colleges', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const colleges = await courseRepository.getColleges();
    res.json({ success: true, data: colleges });
  } catch (error) {
    next(error);
  }
});

// GET /api/courses/:id - get single course
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const course = await courseRepository.findById(req.params.id as string);
    if (!course) throw new AppError('Course not found', 404);
    res.json({ success: true, data: course });
  } catch (error) {
    next(error);
  }
});

// POST /api/courses - create course (admin only)
router.post('/', authenticateJWT, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as AuthRequest).user;
    if (user?.role !== 'admin') throw new AppError('Forbidden', 403);
    const validated = insertCourseSchema.parse(req.body);
    const course = await courseRepository.create(validated);
    res.status(201).json({ success: true, data: course });
  } catch (error) {
    next(error);
  }
});

// PUT /api/courses/:id - update course (admin only)
router.put('/:id', authenticateJWT, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as AuthRequest).user;
    if (user?.role !== 'admin') throw new AppError('Forbidden', 403);
    const validated = insertCourseSchema.partial().parse(req.body);
    const course = await courseRepository.update(req.params.id as string, validated);
    res.json({ success: true, data: course });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/courses/:id - delete course (admin only)
router.delete('/:id', authenticateJWT, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as AuthRequest).user;
    if (user?.role !== 'admin') throw new AppError('Forbidden', 403);
    await courseRepository.delete(req.params.id as string);
    res.json({ success: true, data: null });
  } catch (error) {
    next(error);
  }
});

export default router;
