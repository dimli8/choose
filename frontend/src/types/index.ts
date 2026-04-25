// ============================================
// Auth Types
// ============================================
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

// ============================================
// Teacher Types
// ============================================
export interface Teacher {
  id: string;
  name: string;
  college: string;
  title?: string | null;
  avatarUrl?: string | null;
  bio?: string | null;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// Course Types
// ============================================
export type CourseType = '通识课' | '专选课' | '体育课';

export interface Course {
  id: string;
  name: string;
  code: string;
  college: string;
  type: CourseType;
  teacherId?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  credits?: number | null;
  avgRating: string | number;
  avgGrading: string | number;
  avgWorkload: string | number;
  avgRecommend: string | number;
  reviewCount: number;
  teacher?: Teacher | null;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// Review Types
// ============================================
export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export interface Review {
  id: string;
  courseId: string;
  userId: string;
  isAnonymous: boolean;
  content: string;
  rating: number;
  grading: number;
  workload: number;
  recommend: number;
  status: ReviewStatus;
  likeCount: number;
  userName?: string | null;
  courseName?: string | null;
  courseCode?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReviewInput {
  courseId: string;
  content: string;
  rating: number;
  grading: number;
  workload: number;
  recommend: number;
  isAnonymous: boolean;
}

// ============================================
// Comment Types
// ============================================
export interface Comment {
  id: string;
  reviewId: string;
  userId: string;
  content: string;
  userName?: string | null;
  createdAt: string;
}

// ============================================
// Report Types
// ============================================
export interface Report {
  id: string;
  reviewId: string;
  userId: string;
  reason: string;
  status: string;
  reporterName?: string | null;
  reviewContent?: string | null;
  createdAt: string;
}

// ============================================
// API Response Types
// ============================================
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// ============================================
// Filter Types
// ============================================
export interface CourseFilters {
  college: string;
  type: string;
  search: string;
  sortBy: string;
}

// ============================================
// View Types
// ============================================
export type AppView = 'home' | 'courses' | 'course-detail' | 'reviews' | 'write-review' | 'admin' | 'profile';
