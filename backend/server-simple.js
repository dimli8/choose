require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from frontend dist directory
app.use(express.static(path.join(__dirname, '../frontend/dist')));

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

// In-memory users store
const users = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123' // In a real app, this would be hashed
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123' // In a real app, this would be hashed
  }
];

// Generate a simple token (in a real app, use JWT)
const generateToken = (userId) => {
  return `token-${userId}-${Date.now()}`;
};

// API Routes
app.get('/api/courses', (req, res) => {
  res.json(courses);
});

app.get('/api/courses/:id', (req, res) => {
  const course = courses.find(c => c.id === req.params.id);
  if (course) {
    res.json(course);
  } else {
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

// Auth routes
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Find user by email
  const user = users.find(u => u.email === email);
  
  if (!user || user.password !== password) {
    return res.status(401).json({ success: false, message: '邮箱或密码错误' });
  }
  
  // Generate token
  const token = generateToken(user.id);
  
  res.json({
    success: true,
    data: {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    }
  });
});

app.get('/api/auth/me', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ success: false, message: '未提供认证令牌' });
  }
  
  // Extract user id from token (simplified for demo)
  const userId = token.split('-')[1];
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    return res.status(401).json({ success: false, message: '无效的认证令牌' });
  }
  
  res.json({
    success: true,
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Catch-all route for frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server ready on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Courses endpoint: http://localhost:${PORT}/api/courses`);
  console.log(`Frontend: http://localhost:${PORT}`);
});

module.exports = app;