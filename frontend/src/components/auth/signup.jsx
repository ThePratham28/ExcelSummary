import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, Activity } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const API_URL = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Show loading toast
    const loadingToast = toast.loading('Creating your account...');
    
    try {
      const response = await axios.post(`${API_URL}/auth/register`, formData,{
        withCredentials:true
      });
      
      // Dismiss loading toast and show success
      toast.dismiss(loadingToast);
      toast.success('Account created successfully! Welcome aboard! 🎉', {
        duration: 3000,
      });
     navigate('/home_page',{replace:true})
      
    } catch (error) {
      // Dismiss loading toast and show error
      toast.dismiss(loadingToast);
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Registration failed. Please try again.';
      
      toast.error(errorMessage);
      
      console.error('Registration failed', error.response?.data);
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

  const onSwitchToLogin = () => {
    navigate('/login');
  };

  // Password validation helper
  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    
    if (password.length < minLength) {
      return `Password must be at least ${minLength} characters long`;
    }
    if (!hasUpperCase) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!hasLowerCase) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!hasNumbers) {
      return 'Password must contain at least one number';
    }
    return null;
  };

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setFormData({
      ...formData,
      password: password
    });
    
    // Real-time password validation
    if (password.length > 0) {
      const validationError = validatePassword(password);
      if (validationError) {
        // Show validation error only if user has typed something
        if (password.length > 3) {
          toast.error(validationError, {
            duration: 2000,
            id: 'password-validation', // This prevents multiple toast from showing
          });
        }
      } else {
        toast.dismiss('password-validation');
        toast.success('Strong password! 💪', {
          duration: 1500,
          id: 'password-success',
        });
      }
    }
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
      <div className="absolute top-32 right-20 w-40 h-40 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg -rotate-12 blur-sm"></div>
      <div className="absolute bottom-20 left-32 w-28 h-28 bg-gradient-to-r from-green-400/10 to-teal-400/10 rounded-lg rotate-12 blur-sm"></div>
      <div className="absolute top-1/3 left-20 w-20 h-20 bg-green-500/20 rounded-full blur-xl"></div>

      <div className="max-w-md w-full relative z-10">
        {/* Form Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 border border-gray-200/50 shadow-2xl shadow-black/20 mb-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Create Account</h2>
            <p className="text-gray-600">Start analyzing your Excel data today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div className="space-y-3">
              <label className="text-gray-700 font-semibold flex items-center gap-3 text-sm">
                <div className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center">
                  <User className="w-4 h-4 text-green-600" />
                </div>
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 hover:border-gray-300"
                placeholder="Choose your username"
                required
              />
            </div>

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
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-4 pr-14 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 hover:border-gray-300"
                  placeholder="Create a strong password"
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-green-500/25 hover:shadow-2xl hover:shadow-green-500/30"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating Account...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3">
                  <Activity className="w-5 h-5" />
                  <span className="text-lg">Create Account</span>
                </div>
              )}
            </button>

            {/* Terms */}
            <p className="text-xs text-gray-500 text-center leading-relaxed">
              By creating an account, you agree to our{' '}
              <a href="#" className="text-green-600 hover:text-green-700 underline font-medium">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-green-600 hover:text-green-700 underline font-medium">Privacy Policy</a>
            </p>
          </form>
        </div>

        {/* Switch to Login */}
        <div className="text-center mb-8">
          <p className="text-gray-300 text-lg">
            Already have an account?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-green-400 hover:text-green-300 font-bold transition-colors hover:underline"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}