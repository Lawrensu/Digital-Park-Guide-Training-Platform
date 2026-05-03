import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  // 1. If not logged in, kick to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. If logged in but doesn't have the right role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect Admins to dashboard and Guides to home if they stray
    const fallback = user.role === 'ADMIN' ? '/dashboard' : '/guide/home';
    return <Navigate to={fallback} replace />;
  }

  // 3. All clear - render the protected content
  return children;
};