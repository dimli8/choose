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
    title: '高等数学',
    description: '高等数学是大学数学的基础课程，主要包括微积分、线性代数、概率论等内容。',
    teacher: '张教授',
    department: '数学与统计学院',
    type: '专选课',
    rating: 4.2,
    reviewCount: 256
  },
  {
    id: '2',
    title: '大学英语',
    description: '大学英语课程旨在提高学生的英语听说读写能力，为后续专业学习和国际交流打下基础。',
    teacher: '李老师',
    department: '外国语学院',
    type: '专选课',
    rating: 4.0,
    reviewCount: 189
  },
  {
    id: '3',
    title: '体育选修',
    description: '体育选修课程包括篮球、足球、羽毛球、游泳等多种运动项目，学生可以根据自己的兴趣选择。',
    teacher: '王教练',
    department: '体育学院',
    type: '体育课',
    rating: 4.5,
    reviewCount: 123
  },
  {
    id: '4',
    title: '管理学原理',
    description: '管理学原理课程介绍管理学的基本概念、理论和方法，培养学生的管理思维和能力。',
    teacher: '刘教授',
    department: '管理学院',
    type: '专选课',
    rating: 4.3,
    reviewCount: 98
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
    password: 'password123', // In a real app, this would be hashed
    role: 'user'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123', // In a real app, this would be hashed
    role: 'user'
  },
  {
    id: '3',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123', // In a real app, this would be hashed
    role: 'admin'
  }
];

// Generate a simple token (in a real app, use JWT)
const generateToken = (userId) => {
  return `token-${userId}-${Date.now()}`;
};

// API Routes
app.get('/api/courses', (req, res) => {
  const { college, type, search, sortBy } = req.query;
  
  // Filter courses based on parameters
  let filteredCourses = [...courses];
  
  // Filter by college
  if (college) {
    filteredCourses = filteredCourses.filter(c => c.department === college);
  }
  
  // Filter by type
  if (type) {
    filteredCourses = filteredCourses.filter(c => c.type === type || (c.type === undefined && type === '通识课'));
  }
  
  // Filter by search
  if (search) {
    const searchLower = search.toLowerCase();
    filteredCourses = filteredCourses.filter(c => 
      c.title.toLowerCase().includes(searchLower) ||
      c.teacher.toLowerCase().includes(searchLower) ||
      (c.code && c.code.toLowerCase().includes(searchLower))
    );
  }
  
  // Sort courses
  if (sortBy) {
    switch (sortBy) {
      case 'grading':
        filteredCourses.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'reviews':
        filteredCourses.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
        break;
      default:
        // Default sort by rating
        filteredCourses.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
  } else {
    // Default sort by rating
    filteredCourses.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }
  
  // Transform courses to match frontend expected format
  const transformedCourses = filteredCourses.map(c => ({
    id: c.id,
    name: c.title,
    code: c.code || `COURSE${c.id}`,
    college: c.department,
    type: c.type || '通识课',
    teacherId: c.teacherId || null,
    description: c.description || '',
    imageUrl: c.imageUrl || null,
    credits: c.credits || 3,
    avgRating: c.rating || 0,
    avgGrading: c.avgGrading || 0,
    avgWorkload: c.avgWorkload || 0,
    avgRecommend: c.avgRecommend || 0,
    reviewCount: c.reviewCount || 0,
    teacher: c.teacher || null,
    createdAt: c.createdAt || new Date().toISOString(),
    updatedAt: c.updatedAt || new Date().toISOString(),
  }));
  
  res.json({ success: true, data: transformedCourses });
});

app.get('/api/courses/colleges', (req, res) => {
  // Extract unique colleges from courses
  const colleges = [...new Set(courses.map(c => c.department))];
  res.json({ success: true, data: colleges });
});

app.get('/api/courses/:id', (req, res) => {
  const course = courses.find(c => c.id === req.params.id);
  if (course) {
    const transformedCourse = {
      id: course.id,
      name: course.title,
      code: course.code || `COURSE${course.id}`,
      college: course.department,
      type: course.type || '通识课',
      teacherId: course.teacherId || null,
      description: course.description || '',
      imageUrl: course.imageUrl || null,
      credits: course.credits || 3,
      avgRating: course.rating || 0,
      avgGrading: course.avgGrading || 0,
      avgWorkload: course.avgWorkload || 0,
      avgRecommend: course.avgRecommend || 0,
      reviewCount: course.reviewCount || 0,
      teacher: course.teacher || null,
      createdAt: course.createdAt || new Date().toISOString(),
      updatedAt: course.updatedAt || new Date().toISOString(),
    };
    res.json({ success: true, data: transformedCourse });
  } else {
    res.status(404).json({ success: false, message: 'Course not found' });
  }
});

app.get('/api/courses/:id/reviews', (req, res) => {
  const courseReviews = reviews.filter(r => r.courseId === req.params.id);
  const transformedReviews = courseReviews.map(r => ({
    id: r.id,
    courseId: r.courseId,
    userId: r.userId,
    isAnonymous: r.isAnonymous || false,
    content: r.content,
    rating: r.rating,
    grading: r.grading || 3,
    workload: r.workload || 2,
    recommend: r.recommend || 3,
    status: r.status || 'approved',
    likeCount: r.likeCount || 0,
    userName: r.userName || '匿名用户',
    courseName: r.courseName || '',
    courseCode: r.courseCode || '',
    createdAt: r.createdAt,
    updatedAt: r.updatedAt || r.createdAt,
  }));
  res.json({ success: true, data: transformedReviews });
});

app.get('/api/reviews/course/:id', (req, res) => {
  const courseReviews = reviews.filter(r => r.courseId === req.params.id);
  const transformedReviews = courseReviews.map(r => ({
    id: r.id,
    courseId: r.courseId,
    userId: r.userId,
    isAnonymous: r.isAnonymous || false,
    content: r.content,
    rating: r.rating,
    grading: r.grading || 3,
    workload: r.workload || 2,
    recommend: r.recommend || 3,
    status: r.status || 'approved',
    likeCount: r.likeCount || 0,
    userName: r.userName || '匿名用户',
    courseName: r.courseName || '',
    courseCode: r.courseCode || '',
    createdAt: r.createdAt,
    updatedAt: r.updatedAt || r.createdAt,
  }));
  res.json({ success: true, data: transformedReviews });
});

app.get('/api/reviews', (req, res) => {
  const transformedReviews = reviews.map(r => ({
    id: r.id,
    courseId: r.courseId,
    userId: r.userId,
    isAnonymous: r.isAnonymous || false,
    content: r.content,
    rating: r.rating,
    grading: r.grading || 3,
    workload: r.workload || 2,
    recommend: r.recommend || 3,
    status: r.status || 'approved',
    likeCount: r.likeCount || 0,
    userName: r.userName || '匿名用户',
    courseName: r.courseName || '',
    courseCode: r.courseCode || '',
    createdAt: r.createdAt,
    updatedAt: r.updatedAt || r.createdAt,
  }));
  res.json({ success: true, data: transformedReviews });
});

app.get('/api/reviews/likes/me', (req, res) => {
  // Return empty array for now
  res.json({ success: true, data: [] });
});

app.post('/api/reviews', (req, res) => {
  const newReview = {
    id: (reviews.length + 1).toString(),
    courseId: req.body.courseId,
    userId: '1', // Assume user ID 1 for now
    isAnonymous: req.body.isAnonymous || false,
    content: req.body.content,
    rating: req.body.rating,
    grading: req.body.grading || 3,
    workload: req.body.workload || 2,
    recommend: req.body.recommend || 3,
    status: 'approved',
    likeCount: 0,
    createdAt: new Date().toISOString(),
  };
  reviews.push(newReview);
  res.json({ success: true, data: newReview });
});

app.post('/api/reviews/:id/like', (req, res) => {
  // Find the review
  const review = reviews.find(r => r.id === req.params.id);
  if (review) {
    // Increment like count
    review.likeCount += 1;
    res.json({ success: true, data: { liked: true } });
  } else {
    res.status(404).json({ success: false, message: 'Review not found' });
  }
});

app.get('/api/reviews/:id/comments', (req, res) => {
  // Return empty array for now
  res.json({ success: true, data: [] });
});

app.post('/api/reviews/:id/comments', (req, res) => {
  const newComment = {
    id: '1',
    content: req.body.content,
    userName: '匿名用户',
    createdAt: new Date().toISOString(),
  };
  res.json({ success: true, data: newComment });
});

app.post('/api/reviews/:id/report', (req, res) => {
  const newReport = {
    id: '1',
    reviewId: req.params.id,
    reason: req.body.reason,
    createdAt: new Date().toISOString(),
  };
  res.json({ success: true, data: newReport });
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
        email: user.email,
        role: user.role
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
        email: user.email,
        role: user.role
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