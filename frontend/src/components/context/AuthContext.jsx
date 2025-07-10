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
        timeout: 10000 // 10 second timeout
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
      
      if (response.data) {
        setUser(response.data.user || response.data);
        return { success: true, data: response.data };
      }
    } catch (err) {
      console.error('Login failed:', err);
      return { 
        success: false, 
        error: err.response?.data?.message || err.message || 'Login failed' 
      };
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${API_URL}/auth/logout`, {}, {
        withCredentials: true
      });
    } catch (err) {
      console.error('Logout request failed:', err);
    } finally {
      setUser(null);
      // Clear any local storage tokens as fallback
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
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