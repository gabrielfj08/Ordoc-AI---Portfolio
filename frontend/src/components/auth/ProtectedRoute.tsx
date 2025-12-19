'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useClientOnly } from '@/hooks/useClientOnly';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermissions?: string[];
  fallbackPath?: string;
}

export default function ProtectedRoute({ 
  children, 
  requiredPermissions = [],
  fallbackPath = '/' 
}: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuth();
  const isClient = useClientOnly();

  // Handle redirect to login if not authenticated - MUST be at top level
  useEffect(() => {
    if (!isLoading && !isAuthenticated && isClient) {
      // Set flag to indicate user was redirected from protected route
      sessionStorage.setItem('redirectedFromProtected', 'true');
      router.push(fallbackPath);
    }
  }, [isLoading, isAuthenticated, isClient, router, fallbackPath]);

  // Don't render on server to avoid hydration issues
  if (!isClient) {
    return null;
  }

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Don't render anything while redirecting
  if (!isAuthenticated) {
    return null;
  }

  // Check permissions if required
  if (requiredPermissions.length > 0 && user) {
    const hasRequiredPermissions = requiredPermissions.every(permission =>
      user.permissions?.includes(permission) || false
    );

    if (!hasRequiredPermissions) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-8">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Acesso Negado
            </h2>
            <p className="text-gray-600 mb-6">
              Você não tem permissão para acessar esta página.
            </p>
            <button
              onClick={() => router.back()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Voltar
            </button>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
}
