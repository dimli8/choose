import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import { API_BASE_URL } from '../../config/constants';
import { BookOpen, Eye, EyeOff, Loader2 } from 'lucide-react';

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated === true) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('请填写邮筱和密码');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (data.success && data.data?.token) {
        login(data.data.token);
        toast.success('登录成功', { description: `欢迎回来，${data.data.user?.name || ''}！` });
        navigate('/', { replace: true });
      } else {
        setError(data.message || '邮筱或密码错误');
      }
    } catch {
      setError('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7fa] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#1e3a5f] rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="font-serif text-2xl font-bold text-[#1e3a5f]">选课点评</span>
          </div>
          <h1 className="text-2xl font-bold text-[#0f1f35] mb-1">登录账号</h1>
          <p className="text-[#5a7184] text-sm">登录后可发布评价、点赞和评论</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-[#dde3ec] shadow-[0_4px_12px_-1px_rgb(30_58_95/0.12)] p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#5a7184] uppercase tracking-wide mb-2">
                邮箱地址
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="请输入邮箱地址"
                className="w-full text-sm text-[#0f1f35] bg-[#f5f7fa] border border-[#dde3ec] rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#2d6a9f]/30 focus:border-[#2d6a9f] transition-all placeholder:text-[#5a7184]"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5a7184] uppercase tracking-wide mb-2">
                密码
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="请输入密码"
                  className="w-full text-sm text-[#0f1f35] bg-[#f5f7fa] border border-[#dde3ec] rounded-xl px-4 py-3 pr-12 outline-none focus:ring-2 focus:ring-[#2d6a9f]/30 focus:border-[#2d6a9f] transition-all placeholder:text-[#5a7184]"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5a7184] hover:text-[#1e3a5f] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1e3a5f] text-white py-3 rounded-xl text-sm font-bold hover:bg-[#2d6a9f] transition-colors duration-200 shadow-[0_4px_12px_rgb(30_58_95/0.3)] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-h-[44px]"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? '登录中...' : '登录'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-[#5a7184]">
              还没有账号？{' '}
              <Link to="/signup" className="text-[#2d6a9f] font-semibold hover:text-[#1e3a5f] transition-colors">
                立即注册
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-[#5a7184] mt-6">
          登录即表示同意我们的隐私政策和使用条款
        </p>
      </div>
    </div>
  );
};

export default Login;
