import { useState, useRef, useEffect } from 'react';
import { FileSpreadsheet, Upload, BarChart3, Download, Settings, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

const ExcelAnalyzerNavbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  
  const { user, loading, logout } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout(navigate); 
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleProfileClick = () => {
    setIsProfileOpen(false);
    navigate('/profile');
  };

  // Get display name (username or email)
  const getDisplayName = () => {
    if (user?.username) {
      return user.username;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'User';
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (user?.username) {
      return user.username.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  return (
    <nav className="relative z-10 bg-gray-900/90 backdrop-blur-sm border-b border-green-400/30 shadow-lg w-full">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div 
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <div className="bg-gradient-to-r from-green-400 to-emerald-500 p-2 rounded-lg shadow-lg">
              <FileSpreadsheet className="h-8 w-8 text-gray-900" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Project Excel Analyzer</h1>
              <p className="text-xs text-green-400">Advanced Spreadsheet Analysis</p>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center space-x-8 relative">
            <div onClick={() => navigate('/upload_file')} className="cursor-pointer">
              <NavItem icon={<Upload className="h-4 w-4" />} text="Upload" />
            </div>
            <div onClick={() => navigate('/analytics')} className="cursor-pointer">
              <NavItem icon={<BarChart3 className="h-4 w-4" />} text="Analytics" />
            </div>
            <NavItem icon={<Download className="h-4 w-4" />} text="Export" />
            <NavItem icon={<Settings className="h-4 w-4" />} text="Settings" />
            <div className="h-6 w-px bg-gray-600"></div>

            {/* Profile with dropdown */}
            <div className="relative" ref={dropdownRef}>
              <div
                onClick={() => setIsProfileOpen((prev) => !prev)}
                className="flex items-center space-x-3 text-gray-300 hover:text-green-400 cursor-pointer transition-colors duration-200 group"
              >
                {/* User Avatar */}
                <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-gray-900 font-bold text-sm">
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    getUserInitials()
                  )}
                </div>
                
                {/* Username/Email */}
                <div className="flex flex-col">
                  <span className="font-medium text-sm">
                    {loading ? 'Loading...' : getDisplayName()}
                  </span>
                  <span className="text-xs text-gray-500">
                    {user?.email && user.username ? user.email : ''}
                  </span>
                </div>
              </div>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-20 py-2 border border-gray-200">
                  {/* User Info Header */}
                  <div className="px-4 py-3 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-gray-900 font-bold">
                        {getUserInitials()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {getDisplayName()}
                        </p>
                        <p className="text-xs text-gray-500">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <button
                    onClick={handleProfileClick}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 flex items-center gap-3"
                  >
                    <User className="w-4 h-4" />
                    My Profile
                  </button>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

const NavItem = ({ icon, text }) => (
  <div className="flex items-center space-x-2 text-gray-300 hover:text-green-400 cursor-pointer transition-colors duration-200 group">
    <span className="group-hover:scale-110 transition-transform duration-200">{icon}</span>
    <span className="font-medium">{text}</span>
  </div>
);

export default ExcelAnalyzerNavbar;