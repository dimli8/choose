"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3002;
// Middleware
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// In-memory data store
const courses = [
    {
        id: '1',
        title: 'Introduction to Computer Science',
        description: 'Learn the basics of computer science',
        teacher: 'Dr. Smith',
        department: 'Computer Science',
        rating: 4.5,
        reviewCount: 120
    },
    {
        id: '2',
        title: 'Data Structures and Algorithms',
        description: 'Learn about data structures and algorithms',
        teacher: 'Prof. Johnson',
        department: 'Computer Science',
        rating: 4.8,
        reviewCount: 95
    }
];
const reviews = [
    {
        id: '1',
        courseId: '1',
        userId: '1',
        userName: 'John Doe',
        rating: 5,
        content: 'Great course! Learned a lot.',
        createdAt: new Date().toISOString()
    },
    {
        id: '2',
        courseId: '1',
        userId: '2',
        userName: 'Jane Smith',
        rating: 4,
        content: 'Good course, but could be more interactive.',
        createdAt: new Date().toISOString()
    }
];
// API Routes
app.get('/api/courses', (req, res) => {
    res.json(courses);
});
app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === req.params.id);
    if (course) {
        res.json(course);
    }
    else {
        res.status(404).json({ error: 'Course not found' });
    }
});
app.get('/api/courses/:id/reviews', (req, res) => {
    const courseReviews = reviews.filter(r => r.courseId === req.params.id);
    res.json(courseReviews);
});
app.post('/api/reviews', (req, res) => {
    const newReview = {
        id: (reviews.length + 1).toString(),
        ...req.body,
        createdAt: new Date().toISOString()
    };
    reviews.push(newReview);
    res.status(201).json(newReview);
});
app.get('/api/auth/test', (req, res) => {
    res.json({ message: 'Authentication test endpoint' });
});
// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// Start server
app.listen(PORT, () => {
    console.log(`Server ready on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
    console.log(`Courses endpoint: http://localhost:${PORT}/api/courses`);
});
exports.default = app;
