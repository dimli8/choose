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
  },
  {
    id: '5',
    title: '篮球',
    description: '篮球课程教授篮球基本技术、战术和比赛规则，培养学生的团队协作能力和身体素质。',
    teacher: '王教练',
    department: '体育学院',
    type: '体育课',
    rating: 4.6,
    reviewCount: 156
  },
  {
    id: '6',
    title: '羽毛球',
    description: '羽毛球课程教授羽毛球基本技术、战术和比赛规则，提高学生的反应速度和协调能力。',
    teacher: '李教练',
    department: '体育学院',
    type: '体育课',
    rating: 4.4,
    reviewCount: 132
  },
  {
    id: '7',
    title: '健美操',
    description: '健美操课程教授健美操基本动作和套路，培养学生的节奏感和身体协调性。',
    teacher: '张教练',
    department: '体育学院',
    type: '体育课',
    rating: 4.3,
    reviewCount: 98
  },
  {
    id: '8',
    title: '定向越野',
    description: '定向越野课程教授地图阅读和指北针使用，培养学生的户外生存能力和方向感。',
    teacher: '赵教练',
    department: '体育学院',
    type: '体育课',
    rating: 4.5,
    reviewCount: 87
  },
  {
    id: '9',
    title: '美术鉴赏',
    description: '美术鉴赏课程介绍中外美术史著名作品，培养学生的审美能力和艺术素养。',
    teacher: '陈教授',
    department: '艺术学院',
    type: '通识课',
    rating: 4.2,
    reviewCount: 176
  },
  {
    id: '10',
    title: '书法鉴赏',
    description: '书法鉴赏课程介绍中国书法艺术的发展历程和代表作品，提升学生的文化素养。',
    teacher: '王教授',
    department: '艺术学院',
    type: '通识课',
    rating: 4.1,
    reviewCount: 145
  },
  {
    id: '11',
    title: '音乐鉴赏',
    description: '音乐鉴赏课程介绍中外音乐名作，培养学生的音乐欣赏能力和艺术修养。',
    teacher: '刘教授',
    department: '艺术学院',
    type: '通识课',
    rating: 4.3,
    reviewCount: 163
  },
  {
    id: '12',
    title: '数据库原理',
    description: '数据库原理课程教授数据库系统的基本概念、原理和应用技术，培养学生的数据管理能力。',
    teacher: '赵教授',
    department: '计算机学院',
    type: '专选课',
    rating: 4.0,
    reviewCount: 198
  },
  {
    id: '13',
    title: '数据结构',
    description: '数据结构课程教授各种数据结构的原理和实现方法，培养学生的编程能力。',
    teacher: '周教授',
    department: '计算机学院',
    type: '专选课',
    rating: 4.1,
    reviewCount: 212
  },
  {
    id: '14',
    title: '计算思维方法',
    description: '计算思维方法课程培养学生的计算思维能力和问题解决方法。',
    teacher: '吴教授',
    department: '计算机学院',
    type: '专选课',
    rating: 4.2,
    reviewCount: 167
  },
  {
    id: '15',
    title: 'Python程序设计',
    description: 'Python程序设计课程教授Python语言的基础知识和应用开发。',
    teacher: '郑教授',
    department: '计算机学院',
    type: '专选课',
    rating: 4.5,
    reviewCount: 245
  }
];

const reviews = [
  {
    id: '1',
    courseId: '1',
    userId: '1',
    userName: 'John Doe',
    rating: 5,
    grading: 5,
    workload: 3,
    recommend: 5,
    content: '老师讲解非常清晰，微积分部分讲得很透彻！考试难度适中，只要认真听课做作业就能取得好成绩。',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    courseId: '1',
    userId: '2',
    userName: 'Jane Smith',
    rating: 4,
    grading: 4,
    workload: 2,
    recommend: 4,
    content: '课程内容丰富，但进度有点快。建议提前预习，课后多做练习题。总体来说收获很大。',
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    courseId: '2',
    userId: '1',
    userName: '张三',
    rating: 4,
    grading: 4,
    workload: 2,
    recommend: 4,
    content: '英语老师发音很标准，课堂氛围轻松活跃。听说读写都有涉及，对提升英语能力很有帮助。',
    createdAt: new Date().toISOString()
  },
  {
    id: '4',
    courseId: '2',
    userId: '2',
    userName: '李四',
    rating: 4,
    grading: 3,
    workload: 3,
    recommend: 4,
    content: '课程内容实用，包括很多日常对话和学术英语。不过课堂互动机会可以再多一些。',
    createdAt: new Date().toISOString()
  },
  {
    id: '5',
    courseId: '3',
    userId: '3',
    userName: '王五',
    rating: 5,
    grading: 5,
    workload: 1,
    recommend: 5,
    content: '体育选修课中最喜欢的课程！老师很nice，项目种类多，可以根据自己兴趣选择。考核不难。',
    createdAt: new Date().toISOString()
  },
  {
    id: '6',
    courseId: '3',
    userId: '4',
    userName: '赵六',
    rating: 4,
    grading: 4,
    workload: 2,
    recommend: 4,
    content: '内容丰富，可以接触到多种运动项目。适合喜欢体育锻炼的同学选修。',
    createdAt: new Date().toISOString()
  },
  {
    id: '7',
    courseId: '4',
    userId: '5',
    userName: '钱七',
    rating: 4,
    grading: 4,
    workload: 3,
    recommend: 4,
    content: '管理学理论讲得很系统，老师会结合实际案例分析。考试主要是简答题和案例分析。',
    createdAt: new Date().toISOString()
  },
  {
    id: '8',
    courseId: '4',
    userId: '6',
    userName: '孙八',
    rating: 4,
    grading: 3,
    workload: 4,
    recommend: 4,
    content: '内容比较理论化，但很实用。小组展示环节很有意思，可以学到很多管理技巧。',
    createdAt: new Date().toISOString()
  },
  {
    id: '9',
    courseId: '5',
    userId: '7',
    userName: '周九',
    rating: 5,
    grading: 5,
    workload: 2,
    recommend: 5,
    content: '篮球课太棒了！老师技术过硬，示范动作非常标准。期末考核是投篮和运球，多练习就能过。',
    createdAt: new Date().toISOString()
  },
  {
    id: '10',
    courseId: '5',
    userId: '8',
    userName: '吴十',
    rating: 4,
    grading: 4,
    workload: 2,
    recommend: 5,
    content: '课程强度适中，既能锻炼身体又能学到技能。不过要注意膝盖保护，有些动作需要跳跃。',
    createdAt: new Date().toISOString()
  },
  {
    id: '11',
    courseId: '6',
    userId: '9',
    userName: '郑十一',
    rating: 5,
    grading: 5,
    workload: 1,
    recommend: 5,
    content: '羽毛球课很好玩！老师会教正确的握拍和发球姿势。期末是发球和接发球考核，比较简单。',
    createdAt: new Date().toISOString()
  },
  {
    id: '12',
    courseId: '6',
    userId: '10',
    userName: '冯十二',
    rating: 4,
    grading: 4,
    workload: 2,
    recommend: 4,
    content: '室内上课不受天气影响，运动量适中。需要自备羽毛球拍，场地和球都是学校提供的。',
    createdAt: new Date().toISOString()
  },
  {
    id: '13',
    courseId: '7',
    userId: '11',
    userName: '陈十三',
    rating: 4,
    grading: 4,
    workload: 2,
    recommend: 4,
    content: '健美操课非常有趣！老师会教很多流行的健身操动作，配的音乐也很动感。适合喜欢跳舞的同学。',
    createdAt: new Date().toISOString()
  },
  {
    id: '14',
    courseId: '7',
    userId: '12',
    userName: '褚十四',
    rating: 4,
    grading: 5,
    workload: 1,
    recommend: 5,
    content: '课程很轻松愉快，可以锻炼身体的协调性和节奏感。老师人很好，评分也比较宽松。',
    createdAt: new Date().toISOString()
  },
  {
    id: '15',
    courseId: '8',
    userId: '13',
    userName: '卫十五',
    rating: 5,
    grading: 5,
    workload: 2,
    recommend: 5,
    content: '定向越野课超级刺激！可以学到使用指北针和读地图的技能。期末是实地定向考核，很有意思。',
    createdAt: new Date().toISOString()
  },
  {
    id: '16',
    courseId: '8',
    userId: '14',
    userName: '蒋十六',
    rating: 4,
    grading: 4,
    workload: 3,
    recommend: 4,
    content: '这门课可以学到很多户外生存知识。不过要注意安全，最好穿运动鞋和长裤。',
    createdAt: new Date().toISOString()
  },
  {
    id: '17',
    courseId: '9',
    userId: '15',
    userName: '沈十七',
    rating: 5,
    grading: 5,
    workload: 1,
    recommend: 5,
    content: '美术鉴赏课太享受了！老师会展示很多中外名画，讲解艺术背后的故事。考试是写一篇鉴赏文章。',
    createdAt: new Date().toISOString()
  },
  {
    id: '18',
    courseId: '9',
    userId: '16',
    userName: '韩十八',
    rating: 4,
    grading: 4,
    workload: 2,
    recommend: 4,
    content: '课程内容丰富，从古代到现代的美术作品都有涵盖。可以培养审美情趣，提升艺术修养。',
    createdAt: new Date().toISOString()
  },
  {
    id: '19',
    courseId: '10',
    userId: '17',
    userName: '杨十九',
    rating: 4,
    grading: 4,
    workload: 2,
    recommend: 4,
    content: '书法鉴赏课很有意思！老师会介绍各种书体的特点和代表作品。不过实践机会偏少。',
    createdAt: new Date().toISOString()
  },
  {
    id: '20',
    courseId: '10',
    userId: '18',
    userName: '朱二十',
    rating: 4,
    grading: 3,
    workload: 2,
    recommend: 5,
    content: '通过这门课对中国传统文化有了更深的了解。老师学识渊博，讲解生动有趣。强烈推荐！',
    createdAt: new Date().toISOString()
  },
  {
    id: '21',
    courseId: '11',
    userId: '19',
    userName: '秦廿一',
    rating: 5,
    grading: 5,
    workload: 1,
    recommend: 5,
    content: '音乐鉴赏课太棒了！老师会播放很多经典音乐作品，带我们分析作曲家的创作意图。非常陶冶情操。',
    createdAt: new Date().toISOString()
  },
  {
    id: '22',
    courseId: '11',
    userId: '20',
    userName: '尤廿二',
    rating: 4,
    grading: 4,
    workload: 2,
    recommend: 4,
    content: '课程涵盖中外各种音乐类型，从古典到现代都有。考试是写一篇音乐评论，不难。',
    createdAt: new Date().toISOString()
  },
  {
    id: '23',
    courseId: '12',
    userId: '21',
    userName: '许廿三',
    rating: 4,
    grading: 4,
    workload: 3,
    recommend: 4,
    content: '数据库原理课很重要！老师讲得很清楚，从基础理论到SQL语句都有涵盖。实验课很有帮助。',
    createdAt: new Date().toISOString()
  },
  {
    id: '24',
    courseId: '12',
    userId: '22',
    userName: '何廿四',
    rating: 4,
    grading: 3,
    workload: 4,
    recommend: 4,
    content: '课程内容比较理论化，但很实用。需要做实验项目，建议提前安装好MySQL或SQL Server。',
    createdAt: new Date().toISOString()
  },
  {
    id: '25',
    courseId: '13',
    userId: '23',
    userName: '施廿五',
    rating: 5,
    grading: 5,
    workload: 3,
    recommend: 5,
    content: '数据结构是计算机专业的基础课！老师讲得很透彻，算法分析部分特别有用。考研必看！',
    createdAt: new Date().toISOString()
  },
  {
    id: '26',
    courseId: '13',
    userId: '24',
    userName: '张廿六',
    rating: 4,
    grading: 4,
    workload: 4,
    recommend: 4,
    content: '课程有一定难度，但老师会循序渐进地讲解。需要多做练习题来巩固知识点。',
    createdAt: new Date().toISOString()
  },
  {
    id: '27',
    courseId: '14',
    userId: '25',
    userName: '孔廿七',
    rating: 4,
    grading: 4,
    workload: 2,
    recommend: 4,
    content: '计算思维方法课很有意思！教会我们如何像计算机一样思考问题。作业比较开放，没有标准答案。',
    createdAt: new Date().toISOString()
  },
  {
    id: '28',
    courseId: '14',
    userId: '26',
    userName: '曹廿八',
    rating: 4,
    grading: 4,
    workload: 2,
    recommend: 5,
    content: '这门课可以培养解决问题的思路和方法。老师很幽默，课堂气氛轻松。推荐给所有专业同学！',
    createdAt: new Date().toISOString()
  },
  {
    id: '29',
    courseId: '15',
    userId: '27',
    userName: '严廿九',
    rating: 5,
    grading: 5,
    workload: 2,
    recommend: 5,
    content: 'Python程序设计课超级实用！老师讲得通俗易懂，从基础到爬虫、数据分析都有涉及。作业有趣！',
    createdAt: new Date().toISOString()
  },
  {
    id: '30',
    courseId: '15',
    userId: '28',
    userName: '华三十',
    rating: 4,
    grading: 4,
    workload: 3,
    recommend: 4,
    content: 'Python入门首选课程！语法简洁易学，应用范围广。老师会提供很多练习项目，动手能力提升很快。',
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
const generateToken = (user) => {
  return `token-${user.id}-${user.role}-${Date.now()}`;
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

// Middleware to verify admin access
const verifyAdmin = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ success: false, message: '未授权' });
  }
  const tokenParts = token.split('-');
  if (tokenParts.length < 3 || tokenParts[1] !== '3' || tokenParts[2] !== 'admin') {
    return res.status(403).json({ success: false, message: '需要管理员权限' });
  }
  next();
};

// Create course (admin only)
app.post('/api/courses', verifyAdmin, (req, res) => {
  const { title, description, teacher, department, type } = req.body;
  
  if (!title || !department || !type) {
    return res.status(400).json({ success: false, message: '请填写必填项' });
  }
  
  const newCourse = {
    id: String(courses.length + 1),
    title,
    description: description || '',
    teacher: teacher || '',
    department,
    type,
    rating: 0,
    reviewCount: 0
  };
  
  courses.push(newCourse);
  res.json({ success: true, data: newCourse });
});

// Update course (admin only)
app.put('/api/courses/:id', verifyAdmin, (req, res) => {
  const { title, description, teacher, department, type } = req.body;
  const courseIndex = courses.findIndex(c => c.id === req.params.id);
  
  if (courseIndex === -1) {
    return res.status(404).json({ success: false, message: '课程不存在' });
  }
  
  if (!title || !department || !type) {
    return res.status(400).json({ success: false, message: '请填写必填项' });
  }
  
  courses[courseIndex] = {
    ...courses[courseIndex],
    title,
    description: description || '',
    teacher: teacher || '',
    department,
    type
  };
  
  res.json({ success: true, data: courses[courseIndex] });
});

// Delete course (admin only)
app.delete('/api/courses/:id', verifyAdmin, (req, res) => {
  const courseIndex = courses.findIndex(c => c.id === req.params.id);
  
  if (courseIndex === -1) {
    return res.status(404).json({ success: false, message: '课程不存在' });
  }
  
  courses.splice(courseIndex, 1);
  res.json({ success: true, message: '课程已删除' });
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
  const token = generateToken(user);
  
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