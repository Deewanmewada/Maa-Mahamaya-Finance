import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useContext(AuthContext);
  // Allow access if user exists and their accountType is in allowedRoles or is admin
  if (!user || (!allowedRoles.includes(user.accountType) && user.accountType !== 'admin')) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default ProtectedRoute;
