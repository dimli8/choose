import { API_BASE_URL } from '../config/constants';
import type { ApiResponse, Course, Review, Comment, Report, CreateReviewInput } from '../types';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const jsonHeaders = () => ({
  'Content-Type': 'application/json',
  ...getAuthHeaders(),
});

// ============================================
// Courses API
// ============================================
export const coursesApi = {
  getAll: async (params?: {
    college?: string;
    type?: string;
    search?: string;
    sortBy?: string;
  }): Promise<ApiResponse<Course[]>> => {
    const query = new URLSearchParams();
    if (params?.college) query.set('college', params.college);
    if (params?.type) query.set('type', params.type);
    if (params?.search) query.set('search', params.search);
    if (params?.sortBy) query.set('sortBy', params.sortBy);
    const qs = query.toString();
    const res = await fetch(`${API_BASE_URL}/api/courses${qs ? `?${qs}` : ''}`);
    return res.json() as Promise<ApiResponse<Course[]>>;
  },

  getById: async (id: string): Promise<ApiResponse<Course>> => {
    const res = await fetch(`${API_BASE_URL}/api/courses/${id}`);
    return res.json() as Promise<ApiResponse<Course>>;
  },

  getColleges: async (): Promise<ApiResponse<string[]>> => {
    const res = await fetch(`${API_BASE_URL}/api/courses/colleges`);
    return res.json() as Promise<ApiResponse<string[]>>;
  },

  create: async (data: Partial<Course>): Promise<ApiResponse<Course>> => {
    const res = await fetch(`${API_BASE_URL}/api/courses`, {
      method: 'POST',
      headers: jsonHeaders(),
      body: JSON.stringify(data),
    });
    return res.json() as Promise<ApiResponse<Course>>;
  },

  update: async (id: string, data: Partial<Course>): Promise<ApiResponse<Course>> => {
    const res = await fetch(`${API_BASE_URL}/api/courses/${id}`, {
      method: 'PUT',
      headers: jsonHeaders(),
      body: JSON.stringify(data),
    });
    return res.json() as Promise<ApiResponse<Course>>;
  },

  delete: async (id: string): Promise<ApiResponse<null>> => {
    const res = await fetch(`${API_BASE_URL}/api/courses/${id}`, {
      method: 'DELETE',
      headers: jsonHeaders(),
    });
    return res.json() as Promise<ApiResponse<null>>;
  },
};

// ============================================
// Reviews API
// ============================================
export const reviewsApi = {
  getAll: async (): Promise<ApiResponse<Review[]>> => {
    const res = await fetch(`${API_BASE_URL}/api/reviews`);
    return res.json() as Promise<ApiResponse<Review[]>>;
  },

  getByCourse: async (courseId: string): Promise<ApiResponse<Review[]>> => {
    const res = await fetch(`${API_BASE_URL}/api/reviews/course/${courseId}`);
    return res.json() as Promise<ApiResponse<Review[]>>;
  },

  getAdminAll: async (status?: string): Promise<ApiResponse<Review[]>> => {
    const qs = status ? `?status=${status}` : '';
    const res = await fetch(`${API_BASE_URL}/api/reviews/admin/all${qs}`, {
      headers: getAuthHeaders(),
    });
    return res.json() as Promise<ApiResponse<Review[]>>;
  },

  create: async (data: CreateReviewInput): Promise<ApiResponse<Review>> => {
    const res = await fetch(`${API_BASE_URL}/api/reviews`, {
      method: 'POST',
      headers: jsonHeaders(),
      body: JSON.stringify(data),
    });
    return res.json() as Promise<ApiResponse<Review>>;
  },

  updateStatus: async (id: string, status: string): Promise<ApiResponse<Review>> => {
    const res = await fetch(`${API_BASE_URL}/api/reviews/${id}/status`, {
      method: 'PUT',
      headers: jsonHeaders(),
      body: JSON.stringify({ status }),
    });
    return res.json() as Promise<ApiResponse<Review>>;
  },

  delete: async (id: string): Promise<ApiResponse<null>> => {
    const res = await fetch(`${API_BASE_URL}/api/reviews/${id}`, {
      method: 'DELETE',
      headers: jsonHeaders(),
    });
    return res.json() as Promise<ApiResponse<null>>;
  },

  toggleLike: async (id: string): Promise<ApiResponse<{ liked: boolean }>> => {
    const res = await fetch(`${API_BASE_URL}/api/reviews/${id}/like`, {
      method: 'POST',
      headers: jsonHeaders(),
    });
    return res.json() as Promise<ApiResponse<{ liked: boolean }>>;
  },

  getMyLikes: async (): Promise<ApiResponse<string[]>> => {
    const res = await fetch(`${API_BASE_URL}/api/reviews/likes/me`, {
      headers: getAuthHeaders(),
    });
    return res.json() as Promise<ApiResponse<string[]>>;
  },

  getComments: async (reviewId: string): Promise<ApiResponse<Comment[]>> => {
    const res = await fetch(`${API_BASE_URL}/api/reviews/${reviewId}/comments`);
    return res.json() as Promise<ApiResponse<Comment[]>>;
  },

  addComment: async (reviewId: string, content: string): Promise<ApiResponse<Comment>> => {
    const res = await fetch(`${API_BASE_URL}/api/reviews/${reviewId}/comments`, {
      method: 'POST',
      headers: jsonHeaders(),
      body: JSON.stringify({ content }),
    });
    return res.json() as Promise<ApiResponse<Comment>>;
  },

  report: async (reviewId: string, reason: string): Promise<ApiResponse<Report>> => {
    const res = await fetch(`${API_BASE_URL}/api/reviews/${reviewId}/report`, {
      method: 'POST',
      headers: jsonHeaders(),
      body: JSON.stringify({ reason }),
    });
    return res.json() as Promise<ApiResponse<Report>>;
  },

  getReports: async (): Promise<ApiResponse<Report[]>> => {
    const res = await fetch(`${API_BASE_URL}/api/reviews/reports/all`, {
      headers: getAuthHeaders(),
    });
    return res.json() as Promise<ApiResponse<Report[]>>;
  },
};
