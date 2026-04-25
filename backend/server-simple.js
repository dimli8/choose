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

// Original reviews
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
    content: '这门课可以培养解决问题的思路和方法。老师很幽默，课堂氛围轻松。推荐给所有专业同学！',
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

// Add more reviews for each course
const addMoreReviews = () => {
  const userNames = ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十', '郑十一', '冯十二', '陈十三', '褚十四', '卫十五', '蒋十六', '沈十七', '韩十八', '杨十九', '朱二十', '秦廿一', '尤廿二', '许廿三', '何廿四', '施廿五', '张廿六', '孔廿七', '曹廿八', '严廿九', '华三十', '金三十一', '魏三十二', '陶三十三', '姜三十四', '谢三十五', '邹三十六', '喻三十七', '柏三十八', '水三十九', '窦四十', '章四十一', '云四十二', '苏四十三', '潘四十四', '葛四十五', '奚四十六', '范四十七', '彭四十八', '郎四十九', '鲁五十'];
  
  // Course-specific review contents
  const courseReviews = {
    '1': [ // 高等数学
      '高等数学是一门重要的基础课，老师的讲解很有条理，注重概念的理解和应用。',
      '考试题目有一定难度，但只要平时认真学习，通过还是没问题的。',
      '老师会定期布置作业，批改很认真，对学习有很大帮助。',
      '课程内容涵盖了微积分、线性代数等重要内容，为后续课程打下了坚实基础。',
      '老师的板书很清晰，上课节奏适中，适合不同学习能力的同学。',
      '期中考试和期末考试的题型多样，考察全面，能很好地检验学习效果。',
      '课程配套的习题集质量很高，对巩固知识点很有帮助。',
      '老师会在课后解答学生的问题，态度很耐心，教学效果很好。',
      '高等数学虽然有一定难度，但在老师的指导下，学习起来并不吃力。',
      '课程内容与考研数学有很好的衔接，对准备考研的同学很有帮助。',
      '老师会结合实际应用例子讲解抽象的数学概念，使学习更加生动有趣。',
      '平时成绩占比较合理，只要按时完成作业，积极参与课堂，成绩不会差。',
      '课程设计合理，从基础到进阶，循序渐进，符合学习规律。',
      '通过这门课，我对数学的理解更加深刻，解决问题的能力也得到了提高。',
      '老师的教学方法灵活多样，能够激发学生的学习兴趣。'
    ],
    '2': [ // 大学英语
      '老师会播放英语电影和音乐，增加了学习的趣味性。',
      '考试形式多样，包括听力、阅读、写作和口语，全面考察英语能力。',
      '教材选择合理，内容新颖，符合大学生的学习需求。',
      '老师会组织小组讨论和角色扮演活动，提高了英语口语能力。',
      '课程注重实际应用，所学内容在日常生活和学习中都能用到。',
      '老师的教学方法灵活多样，能够激发学生的学习兴趣。',
      '平时作业包括听力练习、阅读理解和写作训练，有助于巩固所学知识。',
      '期末考试难度适中，只要平时认真学习，都能取得好成绩。',
      '课程内容涵盖了英语语法、词汇、听力、口语等各个方面，全面提升英语水平。',
      '老师会定期进行单元测试，及时了解学生的学习情况。',
      '课堂氛围轻松愉快，学生参与度高，学习效果好。',
      '课程配套的在线学习资源丰富，方便学生课后自主学习。',
      '老师会推荐英语学习方法和资源，对学生的英语学习有很大帮助。',
      '通过这门课，我的英语水平有了很大提高，能够更自信地使用英语。',
      '老师的发音标准，讲解清晰，是一位非常优秀的英语教师。'
    ],
    '3': [ // 体育选修
      '课程安排合理，既有理论学习，又有实践锻炼。',
      '老师会根据学生的身体状况和兴趣爱好，推荐适合的运动项目。',
      '考核方式灵活，注重过程性评价，减轻了学生的考试压力。',
      '课程内容包括篮球、足球、羽毛球、游泳等多种运动项目，选择面广。',
      '通过这门课，不仅锻炼了身体，还学到了很多运动技能。',
      '课堂氛围轻松愉快，同学之间互动频繁，增强了团队合作精神。',
      '老师的教学方法专业，讲解动作要领清晰，示范标准。',
      '课程设置符合大学生的身体特点和运动需求，有助于提高身体素质。',
      '体育选修课是大学生活中不可缺少的一部分，既能锻炼身体，又能放松心情。',
      '老师会组织班级比赛和活动，增加了课程的趣味性和竞争性。',
      '课程考核注重学生的参与度和进步情况，而不仅仅是最终成绩。',
      '通过这门课，认识了很多志同道合的同学，扩大了社交圈。',
      '体育选修课的学习对缓解学习压力、提高学习效率有很大帮助。',
      '这门课让我养成了定期锻炼的好习惯，对我的身体健康很有好处。',
      '老师的教学态度认真负责，对学生的安全非常重视。'
    ],
    '4': [ // 管理学原理
      '老师的讲解深入浅出，将复杂的管理理论用通俗易懂的语言解释清楚。',
      '课程内容涵盖了管理学的基本原理、方法和实践，为后续专业课程打下基础。',
      '案例分析是课程的重要组成部分，通过分析实际企业的管理问题，提高了分析和解决问题的能力。',
      '小组作业和展示环节培养了团队合作能力和沟通表达能力。',
      '老师会邀请企业管理者来课堂讲座，分享实际管理经验，增加了课程的实用性。',
      '考试形式多样，包括闭卷考试、案例分析和课程论文，全面考察学生的学习效果。',
      '课程内容与实际工作密切相关，对未来的职业发展有很大帮助。',
      '老师的教学态度认真负责，对学生的问题耐心解答，教学效果良好。',
      '管理学原理是一门实用性很强的课程，通过学习，对管理的本质和方法有了更深刻的理解。',
      '课程配套的教材和参考资料丰富，有助于学生课后自主学习。',
      '课堂讨论氛围活跃，学生参与度高，学习效果好。',
      '通过这门课，培养了系统思考和决策能力，对个人成长有很大帮助。',
      '老师会组织模拟管理游戏和角色扮演活动，增加了课程的趣味性和互动性。',
      '这门课让我对管理工作有了更全面的认识，为未来的职业规划提供了参考。',
      '课程设计合理，内容丰富，是一门非常有价值的课程。'
    ],
    '5': [ // 篮球
      '老师会根据学生的篮球基础，分层次教学，照顾到不同水平的学生。',
      '课程内容包括篮球基本技术、战术和比赛规则，全面系统。',
      '课堂氛围活跃，同学之间互动频繁，增强了团队合作精神。',
      '通过这门课，不仅提高了篮球技能，还锻炼了身体协调性和反应能力。',
      '老师会组织班级篮球比赛，增加了课程的趣味性和竞争性。',
      '期末考核注重学生的进步情况和参与度，而不仅仅是技能水平。',
      '篮球课是一门很好的体育选修课，既能锻炼身体，又能培养团队精神。',
      '老师的教学方法专业，讲解动作要领清晰，示范标准，教学效果良好。',
      '课程设置合理，从基础到进阶，循序渐进，符合学习规律。',
      '通过这门课，认识了很多喜欢篮球的同学，扩大了社交圈。',
      '篮球课的学习对缓解学习压力、提高学习效率有很大帮助。',
      '老师会教授篮球裁判知识和比赛规则，增加了课程的实用性。',
      '课程配套的训练器材齐全，为学习提供了良好的条件。',
      '这门课让我更加热爱篮球运动，也提高了我的篮球水平。',
      '老师的教学态度认真负责，对学生的安全非常重视。'
    ],
    '6': [ // 羽毛球
      '老师的教学方法专业，讲解动作要领清晰，示范标准，教学效果良好。',
      '课程内容包括羽毛球基本技术、战术和比赛规则，全面系统。',
      '课堂氛围轻松愉快，同学之间互动频繁，增强了友谊。',
      '通过这门课，不仅提高了羽毛球技能，还锻炼了身体协调性和反应能力。',
      '老师会组织班级羽毛球比赛，增加了课程的趣味性和竞争性。',
      '期末考核注重学生的进步情况和参与度，而不仅仅是技能水平。',
      '羽毛球课是一门很好的体育选修课，既能锻炼身体，又能培养反应能力。',
      '课程设置合理，从基础到进阶，循序渐进，符合学习规律。',
      '通过这门课，认识了很多喜欢羽毛球的同学，扩大了社交圈。',
      '羽毛球课的学习对缓解学习压力、提高学习效率有很大帮助。',
      '老师会教授羽毛球裁判知识和比赛规则，增加了课程的实用性。',
      '课程配套的场地和器材齐全，为学习提供了良好的条件。',
      '羽毛球是一项适合终身锻炼的运动，通过这门课，掌握了正确的技术，为以后的锻炼打下了基础。',
      '这门课让我更加热爱羽毛球运动，也提高了我的羽毛球水平。',
      '老师的教学态度认真负责，对学生的安全非常重视。'
    ],
    '7': [ // 健美操
      '老师的教学方法专业，动作示范标准，讲解清晰，教学效果良好。',
      '课程内容包括健美操基本动作、套路和编排，全面系统。',
      '课堂氛围活跃，音乐动感，学生参与度高，学习效果好。',
      '通过这门课，不仅提高了健美操技能，还锻炼了身体协调性和节奏感。',
      '老师会根据学生的身体状况和运动能力，调整动作难度，照顾到不同水平的学生。',
      '期末考核是集体表演一套健美操套路，注重学生的参与度和整体效果。',
      '健美操课是一门很好的体育选修课，既能锻炼身体，又能培养节奏感。',
      '课程设置合理，从基础动作到完整套路，循序渐进，符合学习规律。',
      '通过这门课，认识了很多喜欢健美操的同学，扩大了社交圈。',
      '健美操课的学习对缓解学习压力、提高学习效率有很大帮助。',
      '老师会教授健美操的编排方法，增加了课程的实用性和创造性。',
      '课程配套的音乐和场地条件良好，为学习提供了良好的环境。',
      '健美操是一项适合终身锻炼的运动，通过这门课，掌握了正确的动作要领，为以后的锻炼打下了基础。',
      '这门课让我更加热爱运动，也提高了我的身体协调性。',
      '老师的教学态度认真负责，对学生的安全非常重视。'
    ],
    '8': [ // 定向越野
      '老师的教学方法专业，讲解地图阅读和指北针使用技巧清晰，教学效果良好。',
      '课程内容包括地图阅读、指北针使用、户外导航和生存技能，全面系统。',
      '课堂氛围活跃，学生参与度高，学习效果好。',
      '通过这门课，不仅掌握了定向越野技能，还锻炼了方向感和野外生存能力。',
      '老师会组织实地定向比赛，增加了课程的趣味性和挑战性。',
      '期末考核是实地定向考核，需要在规定时间内找到指定的点标，很有挑战性。',
      '定向越野课是一门很好的体育选修课，既能锻炼身体，又能培养方向感。',
      '课程设置合理，从理论学习到实践操作，循序渐进，符合学习规律。',
      '通过这门课，认识了很多喜欢户外运动的同学，扩大了社交圈。',
      '定向越野课的学习对缓解学习压力、提高学习效率有很大帮助。',
      '老师会教授户外安全知识和急救技能，增加了课程的实用性。',
      '课程配套的地图和指北针等器材齐全，为学习提供了良好的条件。',
      '定向越野是一项适合户外爱好者的运动，通过这门课，掌握了基本技能，为以后的户外活动打下了基础。',
      '这门课让我更加热爱户外运动，也提高了我的方向感和野外生存能力。',
      '老师的教学态度认真负责，对学生的安全非常重视。'
    ],
    '9': [ // 美术鉴赏
      '老师的讲解深入浅出，将复杂的艺术理论用通俗易懂的语言解释清楚。',
      '课程内容包括中外美术史、艺术流派、作品赏析等，全面系统。',
      '课堂氛围轻松愉快，学生参与度高，学习效果好。',
      '通过这门课，不仅了解了很多美术作品，还培养了审美能力和艺术素养。',
      '老师会组织学生参观美术馆和艺术展览，增加了课程的实践性。',
      '期末考核是写一篇美术鉴赏文章，注重学生的分析能力和艺术感悟。',
      '美术鉴赏课是一门很好的通识课，既能丰富知识，又能培养审美能力。',
      '课程设置合理，从基础到进阶，循序渐进，符合学习规律。',
      '通过这门课，认识了很多喜欢艺术的同学，扩大了社交圈。',
      '美术鉴赏课的学习对提高人文素养、丰富精神世界有很大帮助。',
      '老师会推荐相关的书籍和资源，对学生的艺术学习有很大帮助。',
      '课程配套的多媒体教学资源丰富，为学习提供了良好的条件。',
      '美术鉴赏是一项终身受益的能力，通过这门课，培养了对艺术的欣赏能力，为以后的生活增添了乐趣。',
      '这门课让我对艺术有了更深刻的理解，也提高了我的审美能力。',
      '老师的教学态度认真负责，讲解生动有趣，是一位非常优秀的艺术教师。'
    ],
    '10': [ // 书法鉴赏
      '老师的讲解深入浅出，将复杂的书法理论用通俗易懂的语言解释清楚。',
      '课程内容包括中国书法史、书体演变、代表作品赏析等，全面系统。',
      '课堂氛围轻松愉快，学生参与度高，学习效果好。',
      '通过这门课，不仅了解了很多书法作品，还培养了对书法艺术的欣赏能力。',
      '老师会展示不同书体的特点和书写技巧，增加了课程的直观性。',
      '期末考核是写一篇书法鉴赏文章，注重学生的分析能力和文化感悟。',
      '书法鉴赏课是一门很好的通识课，既能丰富知识，又能培养文化素养。',
      '课程设置合理，从基础到进阶，循序渐进，符合学习规律。',
      '通过这门课，认识了很多喜欢书法的同学，扩大了社交圈。',
      '书法鉴赏课的学习对提高人文素养、丰富精神世界有很大帮助。',
      '老师会推荐相关的书籍和资源，对学生的书法学习有很大帮助。',
      '课程配套的多媒体教学资源丰富，为学习提供了良好的条件。',
      '书法是中国传统文化的重要组成部分，通过这门课，加深了对传统文化的理解和认同。',
      '这门课让我对书法艺术有了更深刻的理解，也提高了我的文化素养。',
      '老师的教学态度认真负责，讲解生动有趣，是一位非常优秀的书法教师。'
    ],
    '11': [ // 音乐鉴赏
      '老师的讲解深入浅出，将复杂的音乐理论用通俗易懂的语言解释清楚。',
      '课程内容包括中外音乐史、音乐流派、作品赏析等，全面系统。',
      '课堂氛围轻松愉快，学生参与度高，学习效果好。',
      '通过这门课，不仅了解了很多音乐作品，还培养了音乐欣赏能力和艺术素养。',
      '老师会播放各种类型的音乐作品，增加了课程的听觉体验。',
      '期末考核是写一篇音乐评论，注重学生的分析能力和音乐感悟。',
      '音乐鉴赏课是一门很好的通识课，既能丰富知识，又能培养音乐素养。',
      '课程设置合理，从基础到进阶，循序渐进，符合学习规律。',
      '通过这门课，认识了很多喜欢音乐的同学，扩大了社交圈。',
      '音乐鉴赏课的学习对提高人文素养、丰富精神世界有很大帮助。',
      '老师会推荐相关的音乐作品和资源，对学生的音乐学习有很大帮助。',
      '课程配套的多媒体教学资源丰富，为学习提供了良好的条件。',
      '音乐是人类文化的重要组成部分，通过这门课，培养了对音乐的欣赏能力，为以后的生活增添了乐趣。',
      '这门课让我对音乐有了更深刻的理解，也提高了我的音乐欣赏能力。',
      '老师的教学态度认真负责，讲解生动有趣，是一位非常优秀的音乐教师。'
    ],
    '12': [ // 数据库原理
      '老师的讲解深入浅出，将复杂的数据库理论用通俗易懂的语言解释清楚。',
      '课程内容包括数据库系统原理、SQL语言、数据库设计等，全面系统。',
      '实验课是课程的重要组成部分，通过实际操作，加深了对理论知识的理解。',
      '通过这门课，不仅掌握了数据库的基本原理和操作，还培养了数据管理能力。',
      '老师会布置数据库设计和编程作业，提高了学生的实践能力。',
      '期末考核包括理论考试和实验考核，全面考察学生的学习效果。',
      '数据库原理课是计算机专业的重要基础课，对后续课程的学习有很大帮助。',
      '课程设置合理，从基础到进阶，循序渐进，符合学习规律。',
      '通过这门课，认识了很多对数据库感兴趣的同学，扩大了社交圈。',
      '数据库原理课的学习对提高编程能力和数据管理能力有很大帮助。',
      '老师会推荐相关的书籍和资源，对学生的数据库学习有很大帮助。',
      '课程配套的实验环境和教学资源丰富，为学习提供了良好的条件。',
      '数据库技术是现代信息技术的重要组成部分，通过这门课，掌握了基本技能，为以后的职业发展打下了基础。',
      '这门课让我对数据库技术有了更深刻的理解，也提高了我的编程能力。',
      '老师的教学态度认真负责，讲解清晰，是一位非常优秀的计算机教师。'
    ],
    '13': [ // 数据结构
      '老师的讲解深入浅出，将复杂的数据结构和算法用通俗易懂的语言解释清楚。',
      '课程内容包括线性表、栈、队列、树、图等数据结构，以及相关的算法，全面系统。',
      '课程配套的习题集质量很高，对巩固知识点很有帮助。',
      '通过这门课，不仅掌握了数据结构的基本原理和应用，还培养了算法思维能力。',
      '老师会布置编程作业，要求学生实现各种数据结构和算法，提高了实践能力。',
      '期末考核包括理论考试和编程考核，全面考察学生的学习效果。',
      '数据结构课是计算机专业的核心课程，对后续课程的学习和考研都有很大帮助。',
      '课程设置合理，从基础到进阶，循序渐进，符合学习规律。',
      '通过这门课，认识了很多对算法感兴趣的同学，扩大了社交圈。',
      '数据结构课的学习对提高编程能力和算法思维有很大帮助。',
      '老师会推荐相关的书籍和资源，对学生的数据结构学习有很大帮助。',
      '课程配套的教学资源和编程环境丰富，为学习提供了良好的条件。',
      '数据结构是计算机科学的基础，通过这门课，掌握了基本概念和应用，为以后的学习和工作打下了基础。',
      '这门课让我对算法有了更深刻的理解，也提高了我的编程能力。',
      '老师的教学态度认真负责，讲解清晰，是一位非常优秀的计算机教师。'
    ],
    '14': [ // 计算思维方法
      '老师的讲解深入浅出，将复杂的计算思维方法用通俗易懂的语言解释清楚。',
      '课程内容包括问题分解、模式识别、抽象、算法设计等计算思维的核心概念，全面系统。',
      '课堂氛围轻松愉快，学生参与度高，学习效果好。',
      '通过这门课，不仅了解了计算思维的基本方法，还培养了问题解决能力。',
      '老师会布置开放型作业，要求学生用计算思维方法解决实际问题，提高了实践能力。',
      '期末考核包括课程论文和项目展示，注重学生的创新能力和问题解决能力。',
      '计算思维方法课是一门很好的通识课，既能培养思维能力，又能提高问题解决能力。',
      '课程设置合理，从基础到进阶，循序渐进，符合学习规律。',
      '通过这门课，认识了很多对计算思维感兴趣的同学，扩大了社交圈。',
      '计算思维方法课的学习对提高思维能力和问题解决能力有很大帮助。',
      '老师会推荐相关的书籍和资源，对学生的计算思维学习有很大帮助。',
      '课程配套的教学资源丰富，为学习提供了良好的条件。',
      '计算思维是现代社会必备的思维方式，通过这门课，培养了这种思维能力，对以后的学习和工作都有很大帮助。',
      '这门课让我对问题解决有了更系统的方法，也提高了我的思维能力。',
      '老师的教学态度认真负责，讲解生动有趣，是一位非常优秀的教师。'
    ],
    '15': [ // Python程序设计
      '老师的讲解深入浅出，将复杂的编程概念用通俗易懂的语言解释清楚。',
      '课程内容包括Python基础语法、函数、类、模块、文件操作、爬虫、数据分析等，全面系统。',
      '实验课是课程的重要组成部分，通过实际编程，加深了对理论知识的理解。',
      '通过这门课，不仅掌握了Python编程的基本技能，还培养了编程思维能力。',
      '老师会布置编程作业和项目，要求学生解决实际问题，提高了实践能力。',
      '期末考核包括理论考试和编程考核，全面考察学生的学习效果。',
      'Python程序设计课是一门实用性很强的课程，对后续课程的学习和职业发展都有很大帮助。',
      '课程设置合理，从基础到进阶，循序渐进，符合学习规律。',
      '通过这门课，认识了很多对编程感兴趣的同学，扩大了社交圈。',
      'Python程序设计课的学习对提高编程能力和解决实际问题的能力有很大帮助。',
      '老师会推荐相关的书籍和资源，对学生的Python学习有很大帮助。',
      '课程配套的编程环境和教学资源丰富，为学习提供了良好的条件。',
      'Python是一门广泛应用于各个领域的编程语言，通过这门课，掌握了基本技能，为以后的学习和工作打下了基础。',
      '这门课让我对编程有了更深刻的理解，也提高了我的编程能力。',
      '老师的教学态度认真负责，讲解清晰，是一位非常优秀的计算机教师。'
    ]
  };
  
  // Add more reviews for each course
  for (let courseId = 1; courseId <= 15; courseId++) {
    const courseReviewsList = courseReviews[courseId.toString()];
    const existingReviewsCount = reviews.filter(r => r.courseId === courseId.toString()).length;
    // Calculate how many more reviews to add to reach 8-25 total
    const targetReviewsCount = Math.floor(Math.random() * 18) + 8;
    const additionalReviewsCount = Math.max(0, targetReviewsCount - existingReviewsCount);
    
    console.log(`Course ${courseId}: existing=${existingReviewsCount}, target=${targetReviewsCount}, additional=${additionalReviewsCount}`);
    
    if (additionalReviewsCount > 0) {
      for (let i = 0; i < additionalReviewsCount; i++) {
        const reviewIndex = i % courseReviewsList.length;
        const userNameIndex = (i + courseId + existingReviewsCount) % userNames.length;
        
        // Generate random rating (3-5)
        const rating = Math.floor(Math.random() * 3) + 3;
        const grading = Math.floor(Math.random() * 3) + 3;
        const workload = Math.floor(Math.random() * 4) + 1;
        const recommend = Math.floor(Math.random() * 3) + 3;
        
        // Generate random date within the last year
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 365));
        
        // Create new review
        const newReview = {
          id: (reviews.length + 1).toString(),
          courseId: courseId.toString(),
          userId: ((i + courseId + existingReviewsCount) % users.length + 1).toString(),
          userName: userNames[userNameIndex],
          rating: rating,
          grading: grading,
          workload: workload,
          recommend: recommend,
          content: courseReviewsList[reviewIndex],
          createdAt: date.toISOString()
        };
        
        // Add to reviews array
        reviews.push(newReview);
        console.log(`Added review ${reviews.length} for course ${courseId}`);
      }
    }
  }
  
  console.log(`Total reviews: ${reviews.length}`);
  
  // Test the reviews array
  console.log(`Reviews for course 5: ${reviews.filter(r => r.courseId === '5').length}`);
};

// In-memory favorites store (userId -> array of courseIds)
const favorites = {};

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

// Add more reviews
addMoreReviews();

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

// ========== Favorites API ==========

// Get user's favorite courses
app.get('/api/favorites', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ success: false, message: '未授权' });
  }
  const tokenParts = token.split('-');
  const userId = tokenParts[1];
  
  const userFavorites = favorites[userId] || [];
  const favoriteCourses = courses.filter(c => userFavorites.includes(c.id));
  const transformedCourses = favoriteCourses.map(c => ({
    id: c.id,
    name: c.title,
    code: c.code || `COURSE${c.id}`,
    college: c.department,
    type: c.type,
    description: c.description || null,
    imageUrl: c.imageUrl || null,
    credits: c.credits || null,
    avgRating: c.rating || 0,
    avgGrading: 0,
    avgWorkload: 0,
    avgRecommend: 0,
    reviewCount: c.reviewCount || 0,
    teacher: c.teacher,
    createdAt: c.createdAt || new Date().toISOString(),
    updatedAt: c.updatedAt || new Date().toISOString()
  }));
  
  res.json({ success: true, data: transformedCourses });
});

// Add course to favorites
app.post('/api/favorites/:courseId', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ success: false, message: '未授权' });
  }
  const tokenParts = token.split('-');
  const userId = tokenParts[1];
  
  const courseId = req.params.courseId;
  if (!favorites[userId]) {
    favorites[userId] = [];
  }
  if (!favorites[userId].includes(courseId)) {
    favorites[userId].push(courseId);
  }
  
  res.json({ success: true, message: '已添加收藏' });
});

// Remove course from favorites
app.delete('/api/favorites/:courseId', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ success: false, message: '未授权' });
  }
  const tokenParts = token.split('-');
  const userId = tokenParts[1];
  
  const courseId = req.params.courseId;
  if (favorites[userId]) {
    favorites[userId] = favorites[userId].filter(id => id !== courseId);
  }
  
  res.json({ success: true, message: '已取消收藏' });
});

// Check if course is favorited
app.get('/api/favorites/:courseId/check', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ success: false, message: '未授权' });
  }
  const tokenParts = token.split('-');
  const userId = tokenParts[1];
  
  const courseId = req.params.courseId;
  const isFavorited = favorites[userId]?.includes(courseId) || false;
  
  res.json({ success: true, data: isFavorited });
});

// ========== User Profile API ==========

// Get user profile
app.get('/api/users/profile', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ success: false, message: '未授权' });
  }
  const tokenParts = token.split('-');
  const userId = tokenParts[1];
  
  const user = users.find(u => u.id === userId);
  if (!user) {
    return res.status(404).json({ success: false, message: '用户不存在' });
  }
  
  // Get user's reviews
  const userReviews = reviews.filter(r => r.userId === userId);
  
  res.json({
    success: true,
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      reviews: userReviews
    }
  });
});

// Update user profile
app.put('/api/users/profile', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ success: false, message: '未授权' });
  }
  const tokenParts = token.split('-');
  const userId = tokenParts[1];
  
  const { name, password } = req.body;
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    return res.status(404).json({ success: false, message: '用户不存在' });
  }
  
  if (name) {
    users[userIndex].name = name;
  }
  if (password) {
    users[userIndex].password = password;
  }
  
  res.json({
    success: true,
    data: {
      id: users[userIndex].id,
      name: users[userIndex].name,
      email: users[userIndex].email,
      role: users[userIndex].role
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server ready on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Courses endpoint: http://localhost:${PORT}/api/courses`);
  console.log(`Frontend: http://localhost:${PORT}`);
});

module.exports = app;