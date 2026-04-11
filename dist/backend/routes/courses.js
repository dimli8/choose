"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const courses_1 = require("../repositories/courses");
const schema_1 = require("../db/schema");
const auth_1 = require("../middleware/auth");
const errorHandler_1 = require("../middleware/errorHandler");
const router = (0, express_1.Router)();
// GET /api/courses - list all courses with optional filters
router.get('/', async (req, res, next) => {
    try {
        const { college, type, search, sortBy, gradeFilter } = req.query;
        const courseList = await courses_1.courseRepository.findAll({ college, type, search, sortBy, gradeFilter });
        res.json({ success: true, data: courseList });
    }
    catch (error) {
        next(error);
    }
});
// GET /api/courses/colleges - get distinct colleges
router.get('/colleges', async (_req, res, next) => {
    try {
        const colleges = await courses_1.courseRepository.getColleges();
        res.json({ success: true, data: colleges });
    }
    catch (error) {
        next(error);
    }
});
// GET /api/courses/:id - get single course
router.get('/:id', async (req, res, next) => {
    try {
        const course = await courses_1.courseRepository.findById(req.params.id);
        if (!course)
            throw new errorHandler_1.AppError('Course not found', 404);
        res.json({ success: true, data: course });
    }
    catch (error) {
        next(error);
    }
});
// POST /api/courses - create course (admin only)
router.post('/', auth_1.authenticateJWT, async (req, res, next) => {
    try {
        const user = req.user;
        if (user?.role !== 'admin')
            throw new errorHandler_1.AppError('Forbidden', 403);
        const validated = schema_1.insertCourseSchema.parse(req.body);
        const course = await courses_1.courseRepository.create(validated);
        res.status(201).json({ success: true, data: course });
    }
    catch (error) {
        next(error);
    }
});
// PUT /api/courses/:id - update course (admin only)
router.put('/:id', auth_1.authenticateJWT, async (req, res, next) => {
    try {
        const user = req.user;
        if (user?.role !== 'admin')
            throw new errorHandler_1.AppError('Forbidden', 403);
        const validated = schema_1.insertCourseSchema.partial().parse(req.body);
        const course = await courses_1.courseRepository.update(req.params.id, validated);
        res.json({ success: true, data: course });
    }
    catch (error) {
        next(error);
    }
});
// DELETE /api/courses/:id - delete course (admin only)
router.delete('/:id', auth_1.authenticateJWT, async (req, res, next) => {
    try {
        const user = req.user;
        if (user?.role !== 'admin')
            throw new errorHandler_1.AppError('Forbidden', 403);
        await courses_1.courseRepository.delete(req.params.id);
        res.json({ success: true, data: null });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
