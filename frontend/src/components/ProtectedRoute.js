import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, role }) => {
  const { token, user, loading } = useContext(AuthContext);

  // While checking auth (on page refresh)
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  // Not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Role mismatch
  if (role && user?.role !== role) {
    return <Navigate to="/" replace />;
  }

  // Authorized
  return children;
};

export default ProtectedRoute;