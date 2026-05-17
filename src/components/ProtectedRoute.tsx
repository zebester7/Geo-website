import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'editor';
}

/**
 * ProtectedRoute component to guard routes based on authentication and role
 * 
 * Usage:
 * <ProtectedRoute>
 *   <AdminDashboard />
 * </ProtectedRoute>
 * 
 * With role requirement:
 * <ProtectedRoute requiredRole="admin">
 *   <AdminManagement />
 * </ProtectedRoute>
 */
export function ProtectedRoute({ 
  children, 
  requiredRole = 'editor' 
}: ProtectedRouteProps) {
  const { user, loading, role, isEditor, isAdmin } = useAuth();
  const location = useLocation();

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Check role requirements
  if (requiredRole === 'admin' && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (requiredRole === 'editor' && !isEditor) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
