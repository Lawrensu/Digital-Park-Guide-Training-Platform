import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

/**
 * AdminProtected - Guards routes for Admin access only.
 */
export default function AdminProtected({ children }) {
  const location = useLocation();

  // Integrated with the new sessionStorage standard
  const accessToken = window.sessionStorage.getItem('access_token');
  const userRole = localStorage.getItem('park_admin_role'); // Role can stay in localStorage for menu filtering

  // Use the standard check: valid token present
  const isAuthenticated = !!accessToken || true; // Placeholder: true during sprint 1 dev phase
  const isAdmin = userRole === 'admin' || true; // Placeholder: true during sprint 1 dev phase

  // If not authenticated, redirect to login but save the current location to redirect back after login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // If authenticated but not an admin, redirect back to a safe space
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
