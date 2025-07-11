import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_URL = import.meta.env.VITE_BASE_URL;

  // Configure axios defaults
  useEffect(() => {
    axios.defaults.withCredentials = true;
  }, []);

  const checkAuth = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${API_URL}/auth/profile`, {
        withCredentials: true,
      });
      
      setUser(response.data);
    } catch (err) {
      console.error('Auth check failed:', err);
      setUser(null);
      
      // Only set error for non-401 errors (401 just means not authenticated)
      if (err.response?.status !== 401) {
        setError(err.message || 'Authentication check failed');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, [API_URL]);

  const login = async (credentials) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, credentials, {
        withCredentials: true
      });
      await checkAuth();
      return { 
        success: true, 
        user: response.data 
      };
    } catch (err) {
      console.error('Login failed:', err);
      return { 
        success: false, 
        error: err.response?.data?.message || err.message || 'Login failed' 
      };
    }
  };

const logout = async (navigate) => {
  try {
    await axios.post(`${API_URL}/auth/logout`, {}, {
      withCredentials: true
    });
  } catch (err) {
    console.error('Logout request failed:', err);
  } finally {
    setUser(null);
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    if (navigate) {
      navigate('/login'); // ✅ Proper React redirect
    }
  }
};


  const value = {
    user,
    loading,
    error,
    login,
    logout,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}