import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const PersonalRoute = ({ children }) => {
  const { isAuthenticated, isPersonal, isAdmin, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // Personal y Admin pueden acceder
  if (!isPersonal() && !isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export { PersonalRoute };