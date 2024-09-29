import React from 'react.js';
import { Navigate, Outlet } from 'react-router-dom.js';
import { useAuth } from '../contexts/AuthContext.js';

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();

  console.log('ProtectedRoute: Checking auth', { isAuthenticated });

  if (!isAuthenticated) {
    console.log('ProtectedRoute: Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  console.log('ProtectedRoute: Authenticated, rendering outlet');
  return <Outlet />;
};

export default ProtectedRoute;
