import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Updated import
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { login } = useAuth(); // Use the auth context
  const navigate = useNavigate();

  const handleSubmit = async () => {
    // Validate form data
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!formData.email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    const loadingToast = toast.loading('Signing you in...');

    try {
      const result = await login(formData);
      
      if (result.success) {
        toast.dismiss(loadingToast);
        toast.success('Welcome back! Login successful.');
        setTimeout(() => {
          navigate('/home_page', { replace: true });
        }, 100);
      } else {
        toast.dismiss(loadingToast);
        toast.error(result.error || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Network error. Please try again.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const onSwitchToSignup = () => {
    navigate('/signup');
  };

  const handleForgotPassword = () => {
    toast('Forgot password feature coming soon!', {
      icon: '🔒',
      style: {
        background: '#f3f4f6',
        color: '#374151',
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Excel-inspired Grid Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="grid grid-cols-12 gap-px h-full">
          {Array.from({ length: 144 }).map((_, i) => (
            <div key={i} className="border border-green-400"></div>
          ))}
        </div>
      </div>

      {/* Floating Excel Elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg rotate-12 blur-sm"></div>
      <div className="absolute bottom-32 right-32 w-24 h-24 bg-gradient-to-r from-green-400/10 to-teal-400/10 rounded-lg -rotate-12 blur-sm"></div>
      <div className="absolute top-1/2 right-20 w-16 h-16 bg-green-500/20 rounded-full blur-xl"></div>

      <div className="max-w-md w-full relative z-10">
        {/* Form Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 border border-gray-200/50 shadow-2xl shadow-black/20 mb-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Sign in to continue your analysis</p>
          </div>

          <div className="space-y-6">
            {/* Email Field */}
            <div className="space-y-3">
              <label className="text-gray-700 font-semibold flex items-center gap-3 text-sm">
                <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center">
                  <Mail className="w-4 h-4 text-green-600" />
                </div>
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 hover:border-gray-300"
                placeholder="Enter your email address"
                required
              />
            </div>

            {/* Password Field */}
            <div className="space-y-3">
              <label className="text-gray-700 font-semibold flex items-center gap-3 text-sm">
                <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center">
                  <Lock className="w-4 h-4 text-green-600" />
                </div>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-4 pr-14 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 hover:border-gray-300"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-5 h-5 text-green-600 bg-gray-100 border-gray-300 rounded-lg focus:ring-green-500 focus:ring-2"
                />
                <span className="text-gray-700 font-medium">Remember me</span>
              </label>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-green-600 hover:text-green-700 font-semibold transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-green-500/25 hover:shadow-2xl hover:shadow-green-500/30"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing In...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3">
                  <span className="text-lg">Sign In</span>
                  <BarChart3 className="w-5 h-5" />
                </div>
              )}
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Switch to Signup */}
        <div className="text-center mb-8">
          <p className="text-gray-300">
            New to ExcelAnalyzer?{' '}
            <button
              onClick={onSwitchToSignup}
              className="text-green-400 hover:text-green-300 font-bold transition-colors hover:underline"
            >
              Create Account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}