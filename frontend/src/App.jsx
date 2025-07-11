import { Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import SignupPage from './components/auth/signup';
import Home from './components/Home';
import LoginPage from './components/auth/login';
import './App.css';
import ExcelLandingPage from './components/landing_page';
import ProtectedRoute from './components/ProtectedRoute';
import ExcelUploadComponent from './components/upload';
import { AuthProvider } from './components/context/AuthContext';
function App() {
  return (
    <>
      {/* Global Toast Configuration */}
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        containerClassName="z-50"
        containerStyle={{
          position: 'fixed',
          top: '20px',
          zIndex: 9999,
        }}
        toastOptions={{
          // Global default options
          duration: 3000,
          style: {
            background: 'white',
            color: '#374151',
            fontSize: '14px',
            fontWeight: '500',
            padding: '12px 16px',
            borderRadius: '12px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 2, 0, 0.04)',
            border: '1px solid #e5e7eb',
            maxWidth: '500px',
            wordBreak: 'break-word',
          },
          // Custom styles for different toast types
          success: {
            duration: 3000,
            style: {
              border: '1px solid #10b981',
              background: '#f0fdf4',
              color: '#065f46',
            },
            iconTheme: {
              primary: '#10b981',
              secondary: '#f0fdf4',
            },
          },
          error: {
            duration: 4000,
            style: {
              border: '1px solid #ef4444',
              background: '#fef2f2',
              color: '#991b1b',
            },
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fef2f2',
            },
          },
          loading: {
            style: {
              border: '1px solid #3b82f6',
              background: '#eff6ff',
              color: '#1e40af',
            },
            iconTheme: {
              primary: '#3b82f6',
              secondary: '#eff6ff',
            },
          },
          // Custom toast for different actions
          custom: {
            duration: 2000,
          },
        }}
      />

      {/* Routes */}
         <AuthProvider>
      <Routes>
     
        <Route path="/" element={<ExcelLandingPage/>} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
           <Route path="/home_page" element={<ProtectedRoute><Home /></ProtectedRoute>} />
           <Route path="/upload_file" element={<ProtectedRoute><ExcelUploadComponent /></ProtectedRoute>} />
  
      </Routes>
            </AuthProvider>
    </>
  );
}

export default App;