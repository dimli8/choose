import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { coursesApi, reviewsApi } from '../lib/api';
import type { Course, Review, AppView, CourseFilters } from '../types';
import { toast } from 'sonner';
import OmniflowBadge from '@/components/custom/OmniflowBadge';
import {
  BookOpen, Search, Star, ThumbsUp, MessageCircle, Flag,
  Menu, X, ChevronRight, Filter, SlidersHorizontal,
  LogOut, Shield, TrendingUp, Users, CheckCircle, BarChart3,
  ArrowLeft, Send, AlertTriangle, Loader2
} from 'lucide-react';

// ============================================
// Utility Components
// ============================================
const StarRating = ({ value, max = 5 }: { value: number; max?: number }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: max }).map((_, i) => (
      <div
        key={i}
        className={`w-2 h-2 rounded-full ${
          i < Math.round(value) ? 'bg-[#16a34a]' : 'bg-[#dde3ec]'
        }`}
      />
    ))}
  </div>
);

const WorkloadDots = ({ value, max = 4 }: { value: number; max?: number }) => {
  const color = value <= 1 ? 'bg-[#16a34a]' : value <= 2 ? 'bg-[#d97706]' : 'bg-[#dc2626]';
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <div key={i} className={`w-2 h-2 rounded-full ${i < Math.round(value) ? color : 'bg-[#dde3ec]'}`} />
      ))}
    </div>
  );
};

const CourseTypeBadge = ({ type }: { type: string }) => {
  const styles: Record<string, string> = {
    '通识课': 'bg-[#f59e0b] text-[#1e3a5f]',
    '专选课': 'bg-[#2d6a9f] text-white',
    '体育课': 'bg-[#16a34a] text-white',
  };
  return (
    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${styles[type] || 'bg-gray-200 text-gray-700'}`}>
      {type}
    </span>
  );
};

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (hours < 1) return '刚刚';
  if (hours < 24) return `${hours}小时前`;
  if (days < 30) return `${days}天前`;
  return d.toLocaleDateString('zh-CN');
};

// ============================================
// Navbar
// ============================================
const Navbar = ({
  currentView,
  onNavigate,
  onLogout,
  userName,
  userRole,
  mobileOpen,
  setMobileOpen,
}: {
  currentView: AppView;
  onNavigate: (v: AppView) => void;
  onLogout: () => void;
  userName: string;
  userRole: string;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
}) => {
  const navLinks: { label: string; view: AppView }[] = [
    { label: '浏览课程', view: 'courses' },
    { label: '热门评价', view: 'reviews' },
    { label: '写评价', view: 'write-review' },
  ];

  return (
    <nav className="bg-white border-b border-[#dde3ec] sticky top-0 z-50 shadow-[0_1px_3px_0_rgb(30_58_95/0.08)]">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 bg-[#1e3a5f] rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="font-serif text-xl font-bold text-[#1e3a5f] tracking-tight">选课点评</span>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.view}
                onClick={() => onNavigate(link.view)}
                className={`text-sm font-medium transition-colors duration-200 ${
                  currentView === link.view
                    ? 'text-[#1e3a5f] font-semibold'
                    : 'text-[#5a7184] hover:text-[#1e3a5f]'
                }`}
              >
                {link.label}
              </button>
            ))}
            {userRole === 'admin' && (
              <button
                onClick={() => onNavigate('admin')}
                className={`text-sm font-medium transition-colors duration-200 flex items-center gap-1 ${
                  currentView === 'admin' ? 'text-[#1e3a5f] font-semibold' : 'text-[#5a7184] hover:text-[#1e3a5f]'
                }`}
              >
                <Shield className="w-4 h-4" />
                管理后台
              </button>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-sm text-[#5a7184]">{userName}</span>
            <button
              onClick={onLogout}
              className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-[#5a7184] border border-[#dde3ec] px-3 py-2 rounded-lg hover:bg-[#f5f7fa] hover:text-[#1e3a5f] transition-all"
            >
              <LogOut className="w-4 h-4" />
              退出
            </button>
            <button
              className="md:hidden p-2 text-[#5a7184] hover:text-[#1e3a5f] transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-[#dde3ec] px-4 py-4 space-y-1">
          {navLinks.map((link) => (
            <button
              key={link.view}
              onClick={() => { onNavigate(link.view); setMobileOpen(false); }}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                currentView === link.view
                  ? 'bg-[#1e3a5f] text-white'
                  : 'text-[#5a7184] hover:bg-[#f5f7fa] hover:text-[#1e3a5f]'
              }`}
            >
              {link.label}
            </button>
          ))}
          {userRole === 'admin' && (
            <button
              onClick={() => { onNavigate('admin'); setMobileOpen(false); }}
              className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-[#5a7184] hover:bg-[#f5f7fa] hover:text-[#1e3a5f] flex items-center gap-2"
            >
              <Shield className="w-4 h-4" />管理后台
            </button>
          )}
          <div className="pt-2 border-t border-[#dde3ec] flex items-center justify-between px-4 py-2">
            <span className="text-sm text-[#5a7184]">{userName}</span>
            <button onClick={onLogout} className="text-sm text-[#dc2626] font-medium flex items-center gap-1">
              <LogOut className="w-4 h-4" />退出
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

// ============================================
// Course Card
// ============================================
const CourseCard = ({ course, onClick }: { course: Course; onClick: () => void }) => (
  <article
    onClick={onClick}
    className="bg-white rounded-2xl border border-[#dde3ec] overflow-hidden shadow-[0_4px_12px_-1px_rgb(30_58_95/0.08)] hover:shadow-[0_10px_24px_-3px_rgb(30_58_95/0.15)] hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
  >
    <div className="relative h-40 overflow-hidden">
      <img
        src={course.imageUrl || 'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=600&q=80'}
        alt={course.name}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#1e3a5f]/80 to-transparent" />
      <div className="absolute top-3 left-3">
        <CourseTypeBadge type={course.type} />
      </div>
      <div className="absolute bottom-3 left-3 right-3">
        <h3 className="font-serif text-white font-bold text-lg leading-tight">{course.name}</h3>
        <p className="text-white/70 text-xs mt-0.5">{course.college} · {course.code}</p>
      </div>
    </div>
    <div className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 text-[#f59e0b] fill-[#f59e0b]" />
          <span className="text-sm font-bold text-[#0f1f35]">{Number(course.avgRating).toFixed(1)}</span>
          <span className="text-xs text-[#5a7184]">({course.reviewCount}条评价)</span>
        </div>
        {course.teacher && (
          <div className="flex items-center gap-1.5">
            {course.teacher.avatarUrl && (
              <img src={course.teacher.avatarUrl} alt={course.teacher.name} className="w-7 h-7 rounded-full object-cover border-2 border-[#dde3ec]" />
            )}
            <span className="text-xs text-[#5a7184]">{course.teacher.name}</span>
          </div>
        )}
      </div>
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-[#f5f7fa] rounded-lg p-2 text-center">
          <div className="text-xs text-[#5a7184] mb-1">给分</div>
          <StarRating value={Number(course.avgGrading)} />
        </div>
        <div className="bg-[#f5f7fa] rounded-lg p-2 text-center">
          <div className="text-xs text-[#5a7184] mb-1">作业量</div>
          <WorkloadDots value={Number(course.avgWorkload)} />
        </div>
        <div className="bg-[#f5f7fa] rounded-lg p-2 text-center">
          <div className="text-xs text-[#5a7184] mb-1">推荐度</div>
          <StarRating value={Number(course.avgRecommend)} />
        </div>
      </div>
      <div className="flex items-center justify-between pt-4 border-t border-[#dde3ec]">
        <span className="text-xs text-[#5a7184]">{course.credits}学分</span>
        <span className="text-sm font-semibold text-[#2d6a9f] hover:text-[#1e3a5f] transition-colors flex items-center gap-1">
          查看评价 <ChevronRight className="w-4 h-4" />
        </span>
      </div>
    </div>
  </article>
);

// ============================================
// Review Card
// ============================================
const ReviewCard = ({
  review,
  likedIds,
  onLike,
  onComment,
  onReport,
  showCourse = false,
}: {
  review: Review;
  likedIds: string[];
  onLike: (id: string) => void;
  onComment: (review: Review) => void;
  onReport: (review: Review) => void;
  showCourse?: boolean;
}) => {
  const isLiked = likedIds.includes(review.id);
  return (
    <div className="bg-white rounded-2xl border border-[#dde3ec] p-6 shadow-[0_4px_12px_-1px_rgb(30_58_95/0.06)] hover:shadow-[0_10px_24px_-3px_rgb(30_58_95/0.1)] transition-all duration-300">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-[#1e3a5f] rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white text-sm font-bold">匿</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm font-semibold text-[#0f1f35]">
                {review.isAnonymous ? '匿名用户' : (review.userName || '用户')}
              </span>
              {showCourse && review.courseName && (
                <span className="text-xs text-[#5a7184] bg-[#f5f7fa] px-2 py-0.5 rounded-full">
                  {review.courseName}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-[#f59e0b] fill-[#f59e0b]" />
              <span className="text-sm font-bold text-[#0f1f35]">{review.rating}.0</span>
            </div>
          </div>

          <div className="flex gap-4 mb-3">
            <div className="text-xs text-[#5a7184]">给分: <span className="text-[#0f1f35] font-medium">{['很差', '较差', '一般', '良好', '极好'][review.grading - 1]}</span></div>
            <div className="text-xs text-[#5a7184]">作业: <span className="text-[#0f1f35] font-medium">{['很少', '适中', '较多', '很多'][review.workload - 1]}</span></div>
            <div className="text-xs text-[#5a7184]">推荐: <span className="text-[#0f1f35] font-medium">{['强烈不推荐', '不推荐', '一般', '推荐', '强烈推荐'][review.recommend - 1]}</span></div>
          </div>

          <p className="text-sm text-[#0f1f35] leading-relaxed">{review.content}</p>

          <div className="flex items-center gap-4 mt-3">
            <button
              onClick={() => onLike(review.id)}
              className={`flex items-center gap-1.5 text-xs transition-colors ${
                isLiked ? 'text-[#1e3a5f] font-semibold' : 'text-[#5a7184] hover:text-[#1e3a5f]'
              }`}
            >
              <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-[#1e3a5f]' : ''}`} />
              有用 ({review.likeCount})
            </button>
            <button
              onClick={() => onComment(review)}
              className="flex items-center gap-1.5 text-xs text-[#5a7184] hover:text-[#1e3a5f] transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              评论
            </button>
            <span className="text-xs text-[#5a7184] ml-auto">{formatDate(review.createdAt)}</span>
            <button
              onClick={() => onReport(review)}
              className="flex items-center gap-1.5 text-xs text-[#5a7184] hover:text-[#dc2626] transition-colors"
            >
              <Flag className="w-4 h-4" />
              举报
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// Home View
// ============================================
const HomeView = ({
  onNavigate,
  onCourseClick,
  featuredCourses,
  recentReviews,
  likedIds,
  onLike,
  onComment,
  onReport,
}: {
  onNavigate: (v: AppView) => void;
  onCourseClick: (id: string) => void;
  featuredCourses: Course[];
  recentReviews: Review[];
  likedIds: string[];
  onLike: (id: string) => void;
  onComment: (r: Review) => void;
  onReport: (r: Review) => void;
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate('courses');
    }
  };

  const hotSearches = ['高等数学', '大学英语', '体育选修', '管理学原理'];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#1e3a5f] py-20 lg:py-28">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#f59e0b] rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#2d6a9f] rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="relative max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 bg-[#f59e0b] rounded-full animate-pulse" />
              <span className="text-white/80 text-xs font-medium tracking-wide uppercase">全校课程真实评价平台</span>
            </div>
            <h1 className="font-serif text-4xl lg:text-6xl font-bold text-white leading-tight mb-6">
              选课前，先看<span className="text-[#f59e0b]">真实评价</span>
            </h1>
            <p className="text-white/70 text-lg lg:text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
              汇聚全校同学的选课经验，了解给分情况、作业量、课堂氛围，帮你做出最明智的选课决策。
            </p>
            <form onSubmit={handleSearch} className="bg-white rounded-2xl p-2 shadow-[0_20px_40px_rgb(0_0_0/0.2)] max-w-2xl mx-auto">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5a7184]" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="搜索课程名称、教师姓名或课程代码…"
                    className="w-full pl-12 pr-4 py-3.5 text-[#0f1f35] text-sm rounded-xl border-0 outline-none placeholder:text-[#5a7184] bg-[#f5f7fa] focus:ring-2 focus:ring-[#2d6a9f]/30"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-[#1e3a5f] text-white px-6 py-3.5 rounded-xl text-sm font-semibold hover:bg-[#2d6a9f] transition-colors duration-200 whitespace-nowrap"
                >
                  搜索课程
                </button>
              </div>
            </form>
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              <span className="text-white/50 text-sm">热门搜索：</span>
              {hotSearches.map((s) => (
                <button
                  key={s}
                  onClick={() => onNavigate('courses')}
                  className="text-white/70 text-sm hover:text-[#f59e0b] transition-colors duration-200 underline underline-offset-2"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-[#dde3ec]">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-x divide-[#dde3ec]">
            {[
              { value: '2,400+', label: '收录课程', icon: BookOpen },
              { value: '18,600+', label: '真实评价', icon: Star },
              { value: '95%', label: '审核通过率', icon: CheckCircle },
              { value: '30%', label: '月活跃用户', icon: Users },
            ].map(({ value, label, icon: Icon }) => (
              <div key={label} className="text-center px-4">
                <div className="text-3xl font-serif font-bold text-[#1e3a5f]">{value}</div>
                <div className="text-sm text-[#5a7184] mt-1 flex items-center justify-center gap-1">
                  <Icon className="w-3.5 h-3.5" />{label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#0f1f35]">热门课程</h2>
            <p className="text-sm text-[#5a7184] mt-1">根据综合评分排序</p>
          </div>
          <button
            onClick={() => onNavigate('courses')}
            className="text-sm font-semibold text-[#2d6a9f] hover:text-[#1e3a5f] transition-colors flex items-center gap-1"
          >
            查看全部 <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {featuredCourses.slice(0, 4).map((course) => (
            <CourseCard key={course.id} course={course} onClick={() => onCourseClick(course.id)} />
          ))}
        </div>
      </section>

      {/* Write Review CTA */}
      <section className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2d6a9f] rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-serif text-2xl font-bold text-white mb-2">分享你的选课经验</h3>
            <p className="text-white/70 text-sm leading-relaxed">你的真实评价，将帮助数千名同学做出更好的选课决策。</p>
          </div>
          <button
            onClick={() => onNavigate('write-review')}
            className="bg-white text-[#1e3a5f] px-6 py-3 rounded-xl text-sm font-bold hover:bg-[#f59e0b] transition-colors duration-200 shadow-lg whitespace-nowrap"
          >
            立即写评价
          </button>
        </div>
      </section>

      {/* Recent Reviews */}
      <section className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-2xl font-bold text-[#0f1f35]">最新评价动态</h2>
          <button
            onClick={() => onNavigate('reviews')}
            className="text-sm font-semibold text-[#2d6a9f] hover:text-[#1e3a5f] transition-colors flex items-center gap-1"
          >
            查看全部 <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-4">
          {recentReviews.slice(0, 3).map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              likedIds={likedIds}
              onLike={onLike}
              onComment={onComment}
              onReport={onReport}
              showCourse
            />
          ))}
          {recentReviews.length === 0 && (
            <div className="text-center py-12 text-[#5a7184]">
              <Star className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>暂无评价，成为第一个分享的同学吧！</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1e3a5f] text-white py-12">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-[#f59e0b] rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-[#1e3a5f]" />
                </div>
                <span className="font-serif text-xl font-bold">选课点评</span>
              </div>
              <p className="text-white/60 text-sm leading-relaxed max-w-sm">
                汇聚全校同学的真实选课经验，帮助每一位学生做出更明智的选课决策。
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wide text-white/50 mb-4">快速导航</h4>
              <ul className="space-y-2">
                {['浏览课程', '热门评价', '写评价'].map((item) => (
                  <li key={item}><button className="text-sm text-white/70 hover:text-white transition-colors">{item}</button></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wide text-white/50 mb-4">帮助支持</h4>
              <ul className="space-y-2">
                {['使用指南', '隐私政策', '举报问题', '联系我们'].map((item) => (
                  <li key={item}><button className="text-sm text-white/70 hover:text-white transition-colors">{item}</button></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/40 text-xs">© 2026 选课点评平台. 保留所有权利.</p>
            <p className="text-white/40 text-xs">为同学服务，由同学共建</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// ============================================
// Filter Panel (standalone, outside CoursesView)
// ============================================
const FilterPanel = ({
  filters,
  setFilters,
  colleges,
  onApply,
  onReset,
}: {
  filters: CourseFilters;
  setFilters: (f: CourseFilters) => void;
  colleges: string[];
  onApply: () => void;
  onReset: () => void;
}) => {
  const courseTypes = ['通识课', '专选课', '体育课'];
  return (
    <div className="bg-white rounded-2xl border border-[#dde3ec] p-6 shadow-[0_4px_12px_-1px_rgb(30_58_95/0.08)]">
      <h2 className="font-serif text-lg font-bold text-[#0f1f35] mb-5">筛选课程</h2>
      <div className="space-y-6">
        <div>
          <label className="block text-xs font-semibold text-[#5a7184] uppercase tracking-wide mb-2">所属学院</label>
          <select
            value={filters.college}
            onChange={(e) => setFilters({ ...filters, college: e.target.value })}
            className="w-full text-sm text-[#0f1f35] bg-[#f5f7fa] border border-[#dde3ec] rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-[#2d6a9f]/30 focus:border-[#2d6a9f]"
          >
            <option value="">全部学院</option>
            {colleges.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#5a7184] uppercase tracking-wide mb-3">课程类型</label>
          <div className="space-y-2">
            {courseTypes.map((t) => (
              <label key={t} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.type === t}
                  onChange={(e) => setFilters({ ...filters, type: e.target.checked ? t : '' })}
                  className="w-4 h-4 rounded border-[#dde3ec] accent-[#1e3a5f]"
                />
                <span className="text-sm text-[#0f1f35] group-hover:text-[#1e3a5f] transition-colors">{t}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#5a7184] uppercase tracking-wide mb-2">排序方式</label>
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
            className="w-full text-sm text-[#0f1f35] bg-[#f5f7fa] border border-[#dde3ec] rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-[#2d6a9f]/30 focus:border-[#2d6a9f]"
          >
            <option value="">综合评分</option>
            <option value="grading">给分最高</option>
            <option value="reviews">评价最多</option>
          </select>
        </div>
        <button
          onClick={onApply}
          className="w-full bg-[#1e3a5f] text-white py-3 rounded-xl text-sm font-semibold hover:bg-[#2d6a9f] transition-colors duration-200"
        >
          应用筛选
        </button>
        <button
          onClick={onReset}
          className="w-full text-[#5a7184] py-2 text-sm hover:text-[#1e3a5f] transition-colors duration-200"
        >
          重置筛选
        </button>
      </div>
    </div>
  );
};

// ============================================
// Courses View
// ============================================
const CoursesView = ({
  courses,
  loading,
  filters,
  setFilters,
  colleges,
  onCourseClick,
}: {
  courses: Course[];
  loading: boolean;
  filters: CourseFilters;
  setFilters: (f: CourseFilters) => void;
  colleges: string[];
  onCourseClick: (id: string) => void;
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(filters.search);

  const handleApply = () => {
    setFilters({ ...filters, search: localSearch });
    setSidebarOpen(false);
  };

  const handleReset = () => {
    setFilters({ college: '', type: '', search: '', sortBy: '' });
    setLocalSearch('');
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search Bar */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5a7184]" />
          <input
            type="search"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleApply()}
            placeholder="搜索课程名称、教师姓名或课程代码…"
            className="w-full pl-12 pr-4 py-3 text-[#0f1f35] text-sm bg-white border border-[#dde3ec] rounded-xl outline-none focus:ring-2 focus:ring-[#2d6a9f]/30 focus:border-[#2d6a9f] placeholder:text-[#5a7184]"
          />
        </div>
        <button
          onClick={handleApply}
          className="bg-[#1e3a5f] text-white px-5 py-3 rounded-xl text-sm font-semibold hover:bg-[#2d6a9f] transition-colors"
        >
          搜索
        </button>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden flex items-center gap-2 border border-[#dde3ec] bg-white text-[#5a7184] px-4 py-3 rounded-xl text-sm hover:bg-[#f5f7fa] transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4" />筛选
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className={`lg:w-72 flex-shrink-0 ${sidebarOpen ? 'block' : 'hidden lg:block'}`}>
          <div className="sticky top-24">
            <FilterPanel
              filters={filters}
              setFilters={setFilters}
              colleges={colleges}
              onApply={handleApply}
              onReset={handleReset}
            />
          </div>
        </aside>

        {/* Course Grid */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[#0f1f35]">热门课程</h2>
              <p className="text-sm text-[#5a7184] mt-1">共找到 {courses.length} 门课程</p>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-[#1e3a5f]" />
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-20 text-[#5a7184]">
              <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-lg font-medium">未找到相关课程</p>
              <p className="text-sm mt-1">请尝试其他搜索关键词</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} onClick={() => onCourseClick(course.id)} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================
// Course Detail View
// ============================================
const CourseDetailView = ({
  course,
  reviews,
  likedIds,
  onBack,
  onLike,
  onComment,
  onReport,
  onWriteReview,
}: {
  course: Course;
  reviews: Review[];
  likedIds: string[];
  onBack: () => void;
  onLike: (id: string) => void;
  onComment: (r: Review) => void;
  onReport: (r: Review) => void;
  onWriteReview: () => void;
}) => (
  <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <button
      onClick={onBack}
      className="flex items-center gap-2 text-sm text-[#5a7184] hover:text-[#1e3a5f] transition-colors mb-6"
    >
      <ArrowLeft className="w-4 h-4" />返回课程列表
    </button>

    {/* Course Header */}
    <div className="bg-white rounded-2xl border border-[#dde3ec] overflow-hidden shadow-[0_4px_12px_-1px_rgb(30_58_95/0.08)] mb-8">
      <div className="relative h-56 md:h-72 overflow-hidden">
        <img
          src={course.imageUrl || 'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=1080&q=80'}
          alt={course.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1e3a5f]/90 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          <CourseTypeBadge type={course.type} />
          <h1 className="font-serif text-3xl font-bold text-white mt-2 mb-1">{course.name}</h1>
          <p className="text-white/70">{course.college} · {course.code} · {course.credits}学分</p>
        </div>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: '综合评分', value: Number(course.avgRating).toFixed(1), suffix: '/5.0' },
            { label: '给分情况', value: Number(course.avgGrading).toFixed(1), suffix: '/5.0' },
            { label: '作业量', value: Number(course.avgWorkload).toFixed(1), suffix: '/4.0' },
            { label: '推荐指数', value: Number(course.avgRecommend).toFixed(1), suffix: '/5.0' },
          ].map(({ label, value, suffix }) => (
            <div key={label} className="bg-[#f5f7fa] rounded-xl p-4 text-center">
              <div className="text-2xl font-serif font-bold text-[#1e3a5f]">{value}<span className="text-sm text-[#5a7184] font-normal">{suffix}</span></div>
              <div className="text-xs text-[#5a7184] mt-1">{label}</div>
            </div>
          ))}
        </div>
        {course.description && (
          <p className="text-sm text-[#5a7184] leading-relaxed mb-4">{course.description}</p>
        )}
        {course.teacher && (
          <div className="flex items-center gap-3 p-4 bg-[#f5f7fa] rounded-xl">
            {course.teacher.avatarUrl && (
              <img src={course.teacher.avatarUrl} alt={course.teacher.name} className="w-12 h-12 rounded-full object-cover border-2 border-[#dde3ec]" />
            )}
            <div>
              <div className="font-semibold text-[#0f1f35]">{course.teacher.name}</div>
              <div className="text-sm text-[#5a7184]">{course.teacher.college} · {course.teacher.title || '教师'}</div>
            </div>
          </div>
        )}
      </div>
    </div>

    {/* Reviews Section */}
    <div className="flex items-center justify-between mb-6">
      <h2 className="font-serif text-2xl font-bold text-[#0f1f35]">学生评价 ({reviews.length})</h2>
      <button
        onClick={onWriteReview}
        className="bg-[#1e3a5f] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#2d6a9f] transition-colors"
      >
        写评价
      </button>
    </div>

    {reviews.length === 0 ? (
      <div className="text-center py-16 bg-white rounded-2xl border border-[#dde3ec]">
        <Star className="w-12 h-12 mx-auto mb-3 text-[#dde3ec]" />
        <p className="text-[#5a7184]">暂无评价，成为第一个分享的同学吧！</p>
        <button
          onClick={onWriteReview}
          className="mt-4 text-sm font-semibold text-[#2d6a9f] hover:text-[#1e3a5f] transition-colors"
        >
          立即写评价 →
        </button>
      </div>
    ) : (
      <div className="space-y-4">
        {reviews.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            likedIds={likedIds}
            onLike={onLike}
            onComment={onComment}
            onReport={onReport}
          />
        ))}
      </div>
    )}
  </div>
);

// ============================================
// Reviews Feed View
// ============================================
const ReviewsFeedView = ({
  reviews,
  likedIds,
  onLike,
  onComment,
  onReport,
}: {
  reviews: Review[];
  likedIds: string[];
  onLike: (id: string) => void;
  onComment: (r: Review) => void;
  onReport: (r: Review) => void;
}) => (
  <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="mb-6">
      <h2 className="font-serif text-2xl font-bold text-[#0f1f35]">热门评价</h2>
      <p className="text-sm text-[#5a7184] mt-1">全校同学的真实选课经验</p>
    </div>
    {reviews.length === 0 ? (
      <div className="text-center py-20 text-[#5a7184]">
        <Star className="w-12 h-12 mx-auto mb-3 opacity-30" />
        <p>暂无评价</p>
      </div>
    ) : (
      <div className="space-y-4">
        {reviews.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            likedIds={likedIds}
            onLike={onLike}
            onComment={onComment}
            onReport={onReport}
            showCourse
          />
        ))}
      </div>
    )}
  </div>
);

// ============================================
// Write Review View
// ============================================
const WriteReviewView = ({
  courses,
  preselectedCourseId,
  onSuccess,
}: {
  courses: Course[];
  preselectedCourseId?: string;
  onSuccess: () => void;
}) => {
  const [courseId, setCourseId] = useState(preselectedCourseId || '');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(0);
  const [grading, setGrading] = useState(0);
  const [workload, setWorkload] = useState(0);
  const [recommend, setRecommend] = useState(0);
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseId || !content || !rating || !grading || !workload || !recommend) {
      toast.error('请填写所有必填项');
      return;
    }
    setLoading(true);
    try {
      const res = await reviewsApi.create({ courseId, content, rating, grading, workload, recommend, isAnonymous });
      if (res.success) {
        toast.success('评价已提交', { description: '审核通过后将公开显示' });
        onSuccess();
      } else {
        toast.error('提交失败', { description: res.message });
      }
    } catch {
      toast.error('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const RatingSelect = ({ label, value, onChange, options }: { label: string; value: number; onChange: (v: number) => void; options: string[] }) => (
    <div>
      <label className="block text-xs font-semibold text-[#5a7184] uppercase tracking-wide mb-2">{label}</label>
      <select
        value={value || ''}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full text-sm text-[#0f1f35] bg-white border border-[#dde3ec] rounded-xl px-3 py-3 outline-none focus:ring-2 focus:ring-[#2d6a9f]/30 focus:border-[#2d6a9f]"
      >
        <option value="">选择</option>
        {options.map((opt, i) => (
          <option key={i} value={i + 1}>{opt}</option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="font-serif text-3xl font-bold text-[#0f1f35] mb-3">发布课程评价</h2>
          <p className="text-[#5a7184] leading-relaxed">你的经验是同学们最宝贵的参考。匿名发布，保护隐私。</p>
        </div>
        <div className="bg-[#f5f7fa] rounded-2xl border border-[#dde3ec] p-8 shadow-[0_4px_12px_-1px_rgb(30_58_95/0.08)]">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-[#5a7184] uppercase tracking-wide mb-2">课程 *</label>
              <select
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                className="w-full text-sm text-[#0f1f35] bg-white border border-[#dde3ec] rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#2d6a9f]/30 focus:border-[#2d6a9f]"
              >
                <option value="">选择课程</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <RatingSelect
                label="给分情况 *"
                value={grading}
                onChange={setGrading}
                options={['⭐ 很差', '⭐⭐ 较差', '⭐⭐⭐ 一般', '⭐⭐⭐⭐ 良好', '⭐⭐⭐⭐⭐ 极好']}
              />
              <RatingSelect
                label="作业量 *"
                value={workload}
                onChange={setWorkload}
                options={['很少', '适中', '较多', '很多']}
              />
              <RatingSelect
                label="推荐指数 *"
                value={recommend}
                onChange={setRecommend}
                options={['强烈不推荐', '不推荐', '一般', '推荐', '强烈推荐']}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5a7184] uppercase tracking-wide mb-2">综合评分 *</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setRating(s)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                      rating === s
                        ? 'bg-[#1e3a5f] text-white border-[#1e3a5f]'
                        : 'bg-white text-[#5a7184] border-[#dde3ec] hover:border-[#2d6a9f]'
                    }`}
                  >
                    {s}分
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5a7184] uppercase tracking-wide mb-2">评价内容 *</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={5}
                placeholder="分享你的真实体验：课堂氛围、教学质量、考试难度、给分情况等，帮助更多同学做出选择…"
                className="w-full text-sm text-[#0f1f35] bg-white border border-[#dde3ec] rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#2d6a9f]/30 focus:border-[#2d6a9f] transition-all resize-none placeholder:text-[#5a7184]"
              />
              <p className="text-xs text-[#5a7184] mt-1">{content.length} 字（至少 10 字）</p>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="w-4 h-4 rounded border-[#dde3ec] accent-[#1e3a5f]"
                />
                <span className="text-sm text-[#5a7184]">匿名发布（推荐）</span>
              </label>
              <button
                type="submit"
                disabled={loading}
                className="bg-[#1e3a5f] text-white px-8 py-3 rounded-xl text-sm font-bold hover:bg-[#2d6a9f] transition-colors duration-200 shadow-[0_4px_12px_rgb(30_58_95/0.3)] disabled:opacity-60 flex items-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                提交评价
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// ============================================
// Admin View
// ============================================
const AdminView = () => {
  const [tab, setTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const loadReviews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await reviewsApi.getAdminAll(tab);
      if (res.success) setReviews(res.data);
    } catch {
      toast.error('加载失败');
    } finally {
      setLoading(false);
    }
  }, [tab]);

  useEffect(() => { loadReviews(); }, [loadReviews]);

  const handleStatus = async (id: string, status: string) => {
    try {
      const res = await reviewsApi.updateStatus(id, status);
      if (res.success) {
        toast.success(status === 'approved' ? '已通过审核' : '已拒绝');
        loadReviews();
      }
    } catch {
      toast.error('操作失败');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await reviewsApi.delete(id);
      if (res.success) {
        toast.success('已删除');
        loadReviews();
      }
    } catch {
      toast.error('删除失败');
    }
  };

  const tabs = [
    { key: 'pending' as const, label: '待审核', color: 'text-[#d97706]' },
    { key: 'approved' as const, label: '已通过', color: 'text-[#16a34a]' },
    { key: 'rejected' as const, label: '已拒绝', color: 'text-[#dc2626]' },
  ];

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-6 h-6 text-[#1e3a5f]" />
          <h2 className="font-serif text-2xl font-bold text-[#0f1f35]">管理后台</h2>
        </div>
        <p className="text-sm text-[#5a7184]">审核用户发布的评价内容，维护平台可信度</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {tabs.map(({ key, label, color }) => (
          <div key={key} className="bg-white rounded-2xl border border-[#dde3ec] p-5 text-center shadow-[0_4px_12px_-1px_rgb(30_58_95/0.06)]">
            <div className={`text-3xl font-serif font-bold ${color}`}>
              {reviews.filter((r) => r.status === key).length}
            </div>
            <div className="text-sm text-[#5a7184] mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[#f5f7fa] rounded-xl p-1 mb-6">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              tab === key ? 'bg-white text-[#1e3a5f] shadow-sm' : 'text-[#5a7184] hover:text-[#1e3a5f]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[#1e3a5f]" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-16 text-[#5a7184]">
          <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>暂无{tabs.find((t) => t.key === tab)?.label}的评价</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-2xl border border-[#dde3ec] p-6 shadow-[0_4px_12px_-1px_rgb(30_58_95/0.06)]">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className="text-sm font-semibold text-[#0f1f35]">
                      {review.isAnonymous ? '匿名用户' : (review.userName || '用户')}
                    </span>
                    {review.courseName && (
                      <span className="text-xs text-[#5a7184] bg-[#f5f7fa] px-2 py-0.5 rounded-full">
                        {review.courseName}
                      </span>
                    )}
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-[#f59e0b] fill-[#f59e0b]" />
                      <span className="text-xs font-bold text-[#0f1f35]">{review.rating}.0</span>
                    </div>
                    <span className="text-xs text-[#5a7184]">{formatDate(review.createdAt)}</span>
                  </div>
                  <p className="text-sm text-[#0f1f35] leading-relaxed">{review.content}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  {tab === 'pending' && (
                    <>
                      <button
                        onClick={() => handleStatus(review.id, 'approved')}
                        className="flex items-center gap-1.5 bg-[#16a34a] text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-green-700 transition-colors"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />通过
                      </button>
                      <button
                        onClick={() => handleStatus(review.id, 'rejected')}
                        className="flex items-center gap-1.5 bg-[#dc2626] text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-red-700 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />拒绝
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleDelete(review.id)}
                    className="flex items-center gap-1.5 border border-[#dde3ec] text-[#5a7184] px-4 py-2 rounded-lg text-xs font-semibold hover:bg-[#f5f7fa] transition-colors"
                  >
                    删除
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ============================================
// Comment Modal
// ============================================
const CommentModal = ({
  review,
  onClose,
}: {
  review: Review;
  onClose: () => void;
}) => {
  const [comments, setComments] = useState<{ id: string; content: string; userName?: string | null; createdAt: string }[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await reviewsApi.getComments(review.id);
        if (res.success) setComments(res.data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [review.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSubmitting(true);
    try {
      const res = await reviewsApi.addComment(review.id, newComment);
      if (res.success) {
        setComments((prev) => [res.data, ...prev]);
        setNewComment('');
        toast.success('评论已发布');
      }
    } catch {
      toast.error('发布失败');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[80vh] flex flex-col shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-[#dde3ec]">
          <h3 className="font-serif text-lg font-bold text-[#0f1f35]">评论</h3>
          <button onClick={onClose} className="text-[#5a7184] hover:text-[#1e3a5f] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {loading ? (
            <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-[#1e3a5f]" /></div>
          ) : comments.length === 0 ? (
            <p className="text-center text-[#5a7184] py-8">暂无评论，成为第一个评论的同学！</p>
          ) : (
            comments.map((c) => (
              <div key={c.id} className="flex gap-3">
                <div className="w-8 h-8 bg-[#f5f7fa] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-[#1e3a5f]">{(c.userName || '匿')[0]}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-[#0f1f35]">{c.userName || '匿名'}</span>
                    <span className="text-xs text-[#5a7184]">{formatDate(c.createdAt)}</span>
                  </div>
                  <p className="text-sm text-[#0f1f35]">{c.content}</p>
                </div>
              </div>
            ))
          )}
        </div>
        <form onSubmit={handleSubmit} className="p-4 border-t border-[#dde3ec] flex gap-3">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="发表评论…"
            className="flex-1 text-sm text-[#0f1f35] bg-[#f5f7fa] border border-[#dde3ec] rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#2d6a9f]/30 focus:border-[#2d6a9f] placeholder:text-[#5a7184]"
          />
          <button
            type="submit"
            disabled={submitting || !newComment.trim()}
            className="bg-[#1e3a5f] text-white px-4 py-2.5 rounded-xl hover:bg-[#2d6a9f] transition-colors disabled:opacity-60 flex items-center gap-1.5"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </form>
      </div>
    </div>
  );
};

// ============================================
// Report Modal
// ============================================
const ReportModal = ({
  review,
  onClose,
}: {
  review: Review;
  onClose: () => void;
}) => {
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const reasons = ['内容不实', '恶意攻击', '广告广告', '涉及隐私', '其他原因'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) { toast.error('请选择举报原因'); return; }
    setSubmitting(true);
    try {
      const res = await reviewsApi.report(review.id, reason);
      if (res.success) {
        toast.success('举报已提交', { description: '感谢你的反馈，我们将尽快处理' });
        onClose();
      }
    } catch {
      toast.error('提交失败');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-[#dde3ec]">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-[#dc2626]" />
            <h3 className="font-serif text-lg font-bold text-[#0f1f35]">举报评价</h3>
          </div>
          <button onClick={onClose} className="text-[#5a7184] hover:text-[#1e3a5f] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-sm text-[#5a7184]">请选择举报原因：</p>
          <div className="space-y-2">
            {reasons.map((r) => (
              <label key={r} className="flex items-center gap-3 cursor-pointer p-3 rounded-xl hover:bg-[#f5f7fa] transition-colors">
                <input
                  type="radio"
                  name="reason"
                  value={r}
                  checked={reason === r}
                  onChange={() => setReason(r)}
                  className="accent-[#1e3a5f]"
                />
                <span className="text-sm text-[#0f1f35]">{r}</span>
              </label>
            ))}
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-[#dde3ec] text-[#5a7184] py-3 rounded-xl text-sm font-semibold hover:bg-[#f5f7fa] transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-[#dc2626] text-white py-3 rounded-xl text-sm font-bold hover:bg-red-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              提交举报
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============================================
// Main Index Component
// ============================================
const Index = () => {
  const { logout } = useAuth();
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Data state
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [courseDetail, setCourseDetail] = useState<Course | null>(null);
  const [courseReviews, setCourseReviews] = useState<Review[]>([]);
  const [allReviews, setAllReviews] = useState<Review[]>([]);
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [colleges, setColleges] = useState<string[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [filters, setFilters] = useState<CourseFilters>({ college: '', type: '', search: '', sortBy: '' });

  // Modal state
  const [commentReview, setCommentReview] = useState<Review | null>(null);
  const [reportReview, setReportReview] = useState<Review | null>(null);

  // User info from token
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('student');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserName(payload.name || payload.email || '');
        setUserRole(payload.role || 'student');
      } catch {
        // ignore
      }
    }
  }, []);

  // Load initial data
  useEffect(() => {
    const loadInitial = async () => {
      try {
        const [coursesRes, reviewsRes, collegesRes] = await Promise.all([
          coursesApi.getAll(),
          reviewsApi.getAll(),
          coursesApi.getColleges(),
        ]);
        if (coursesRes.success) {
          setAllCourses(coursesRes.data);
          setFilteredCourses(coursesRes.data);
        }
        if (reviewsRes.success) setAllReviews(reviewsRes.data);
        if (collegesRes.success) setColleges(collegesRes.data);
      } catch {
        // silent
      }
    };
    loadInitial();

    const loadLikes = async () => {
      try {
        const res = await reviewsApi.getMyLikes();
        if (res.success) setLikedIds(res.data);
      } catch {
        // silent
      }
    };
    loadLikes();
  }, []);

  // Apply filters
  useEffect(() => {
    const applyFilters = async () => {
      setCoursesLoading(true);
      try {
        const res = await coursesApi.getAll({
          college: filters.college || undefined,
          type: filters.type || undefined,
          search: filters.search || undefined,
          sortBy: filters.sortBy || undefined,
        });
        if (res.success) setFilteredCourses(res.data);
      } finally {
        setCoursesLoading(false);
      }
    };
    applyFilters();
  }, [filters]);

  const handleCourseClick = async (id: string) => {
    setSelectedCourseId(id);
    setCurrentView('course-detail');
    try {
      const [courseRes, reviewsRes] = await Promise.all([
        coursesApi.getById(id),
        reviewsApi.getByCourse(id),
      ]);
      if (courseRes.success) setCourseDetail(courseRes.data);
      if (reviewsRes.success) setCourseReviews(reviewsRes.data);
    } catch {
      toast.error('加载课程详情失败');
    }
  };

  const handleLike = async (reviewId: string) => {
    try {
      const res = await reviewsApi.toggleLike(reviewId);
      if (res.success) {
        if (res.data.liked) {
          setLikedIds((prev) => [...prev, reviewId]);
        } else {
          setLikedIds((prev) => prev.filter((id) => id !== reviewId));
        }
        // Update like count in lists
        const updateLike = (r: Review) =>
          r.id === reviewId
            ? { ...r, likeCount: r.likeCount + (res.data.liked ? 1 : -1) }
            : r;
        setAllReviews((prev) => prev.map(updateLike));
        setCourseReviews((prev) => prev.map(updateLike));
      }
    } catch {
      toast.error('操作失败');
    }
  };

  const handleLogout = () => {
    logout();
  };

  const handleNavigate = (view: AppView) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
    if (view !== 'course-detail') {
      setSelectedCourseId(null);
      setCourseDetail(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        userName={userName}
        userRole={userRole}
        mobileOpen={mobileMenuOpen}
        setMobileOpen={setMobileMenuOpen}
      />

      <main>
        {currentView === 'home' && (
          <HomeView
            onNavigate={handleNavigate}
            onCourseClick={handleCourseClick}
            featuredCourses={allCourses}
            recentReviews={allReviews}
            likedIds={likedIds}
            onLike={handleLike}
            onComment={setCommentReview}
            onReport={setReportReview}
          />
        )}

        {currentView === 'courses' && (
          <CoursesView
            courses={filteredCourses}
            loading={coursesLoading}
            filters={filters}
            setFilters={setFilters}
            colleges={colleges}
            onCourseClick={handleCourseClick}
          />
        )}

        {currentView === 'course-detail' && courseDetail && (
          <CourseDetailView
            course={courseDetail}
            reviews={courseReviews}
            likedIds={likedIds}
            onBack={() => handleNavigate('courses')}
            onLike={handleLike}
            onComment={setCommentReview}
            onReport={setReportReview}
            onWriteReview={() => {
              setCurrentView('write-review');
            }}
          />
        )}

        {currentView === 'course-detail' && !courseDetail && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#1e3a5f]" />
          </div>
        )}

        {currentView === 'reviews' && (
          <ReviewsFeedView
            reviews={allReviews}
            likedIds={likedIds}
            onLike={handleLike}
            onComment={setCommentReview}
            onReport={setReportReview}
          />
        )}

        {currentView === 'write-review' && (
          <WriteReviewView
            courses={allCourses}
            preselectedCourseId={selectedCourseId || undefined}
            onSuccess={() => handleNavigate('reviews')}
          />
        )}

        {currentView === 'admin' && userRole === 'admin' && <AdminView />}
      </main>

      {/* Comment Modal */}
      {commentReview && (
        <CommentModal review={commentReview} onClose={() => setCommentReview(null)} />
      )}

      {/* Report Modal */}
      {reportReview && (
        <ReportModal review={reportReview} onClose={() => setReportReview(null)} />
      )}

      <OmniflowBadge />
    </div>
  );
};

export default Index;
