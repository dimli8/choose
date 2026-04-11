"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reviews_1 = require("../repositories/reviews");
const courses_1 = require("../repositories/courses");
const schema_1 = require("../db/schema");
const auth_1 = require("../middleware/auth");
const errorHandler_1 = require("../middleware/errorHandler");
const router = (0, express_1.Router)();
// GET /api/reviews - get all approved reviews (recent feed)
router.get('/', async (req, res, next) => {
    try {
        const reviewList = await reviews_1.reviewRepository.findAll('approved');
        res.json({ success: true, data: reviewList });
    }
    catch (error) {
        next(error);
    }
});
// GET /api/reviews/course/:courseId - get reviews for a course
router.get('/course/:courseId', async (req, res, next) => {
    try {
        const courseId = req.params.courseId;
        const reviewList = await reviews_1.reviewRepository.findByCourse(courseId, 'approved');
        res.json({ success: true, data: reviewList });
    }
    catch (error) {
        next(error);
    }
});
// GET /api/reviews/admin/all - get all reviews for admin
router.get('/admin/all', auth_1.authenticateJWT, async (req, res, next) => {
    try {
        const user = req.user;
        if (user?.role !== 'admin')
            throw new errorHandler_1.AppError('Forbidden', 403);
        const status = req.query.status;
        const reviewList = await reviews_1.reviewRepository.findAll(status);
        res.json({ success: true, data: reviewList });
    }
    catch (error) {
        next(error);
    }
});
// POST /api/reviews - create review (authenticated)
router.post('/', auth_1.authenticateJWT, async (req, res, next) => {
    try {
        const user = req.user;
        const validated = schema_1.insertReviewSchema.parse({ ...req.body, userId: user.id });
        const review = await reviews_1.reviewRepository.create(validated);
        res.status(201).json({ success: true, data: review });
    }
    catch (error) {
        next(error);
    }
});
// PUT /api/reviews/:id/status - update review status (admin)
router.put('/:id/status', auth_1.authenticateJWT, async (req, res, next) => {
    try {
        const user = req.user;
        if (user?.role !== 'admin')
            throw new errorHandler_1.AppError('Forbidden', 403);
        const { status } = req.body;
        const review = await reviews_1.reviewRepository.updateStatus(req.params.id, status);
        // Update course stats if approved
        if (status === 'approved' && review) {
            await courses_1.courseRepository.updateStats(review.courseId);
        }
        res.json({ success: true, data: review });
    }
    catch (error) {
        next(error);
    }
});
// DELETE /api/reviews/:id - delete review (admin)
router.delete('/:id', auth_1.authenticateJWT, async (req, res, next) => {
    try {
        const user = req.user;
        if (user?.role !== 'admin')
            throw new errorHandler_1.AppError('Forbidden', 403);
        await reviews_1.reviewRepository.delete(req.params.id);
        res.json({ success: true, data: null });
    }
    catch (error) {
        next(error);
    }
});
// POST /api/reviews/:id/like - toggle like
router.post('/:id/like', auth_1.authenticateJWT, async (req, res, next) => {
    try {
        const user = req.user;
        const result = await reviews_1.reviewRepository.toggleLike(req.params.id, user.id);
        res.json({ success: true, data: result });
    }
    catch (error) {
        next(error);
    }
});
// GET /api/reviews/likes/me - get liked review IDs for current user
router.get('/likes/me', auth_1.authenticateJWT, async (req, res, next) => {
    try {
        const user = req.user;
        const likedIds = await reviews_1.reviewRepository.getLikedByUser(user.id);
        res.json({ success: true, data: likedIds });
    }
    catch (error) {
        next(error);
    }
});
// GET /api/reviews/:id/comments - get comments for a review
router.get('/:id/comments', async (req, res, next) => {
    try {
        const commentList = await reviews_1.reviewRepository.getComments(req.params.id);
        res.json({ success: true, data: commentList });
    }
    catch (error) {
        next(error);
    }
});
// POST /api/reviews/:id/comments - add comment
router.post('/:id/comments', auth_1.authenticateJWT, async (req, res, next) => {
    try {
        const user = req.user;
        const validated = schema_1.insertCommentSchema.parse({
            reviewId: req.params.id,
            userId: user.id,
            content: req.body.content,
        });
        const comment = await reviews_1.reviewRepository.addComment(validated);
        res.status(201).json({ success: true, data: comment });
    }
    catch (error) {
        next(error);
    }
});
// POST /api/reviews/:id/report - report a review
router.post('/:id/report', auth_1.authenticateJWT, async (req, res, next) => {
    try {
        const user = req.user;
        const validated = schema_1.insertReportSchema.parse({
            reviewId: req.params.id,
            userId: user.id,
            reason: req.body.reason,
        });
        const report = await reviews_1.reviewRepository.addReport(validated);
        res.status(201).json({ success: true, data: report });
    }
    catch (error) {
        next(error);
    }
});
// GET /api/reviews/reports/all - get all reports (admin)
router.get('/reports/all', auth_1.authenticateJWT, async (req, res, next) => {
    try {
        const user = req.user;
        if (user?.role !== 'admin')
            throw new errorHandler_1.AppError('Forbidden', 403);
        const reportList = await reviews_1.reviewRepository.getReports();
        res.json({ success: true, data: reportList });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
