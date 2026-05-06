import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import IdleGuard from '../components/IdleGuard/IdleGuard';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const fallback = user.role === 'ADMIN' ? '/dashboard' : '/guide/home';
    return <Navigate to={fallback} replace />;
  }

  return <IdleGuard>{children}</IdleGuard>;
};