import { useAuth } from "./context/AuthContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div>Checking authentication...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}