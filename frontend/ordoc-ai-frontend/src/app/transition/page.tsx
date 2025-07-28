'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/services/auth';

const TransitionPage = () => {
  const { token, user } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = React.useState(true);

  React.useEffect(() => {
    const checkUserStatus = async () => {
      console.log('🔄 Transition: Starting user status check...');
      console.log('🔐 Token exists:', !!token);
      console.log('👤 User data:', user);
      
      if (!token) {
        console.log('❌ No token found, redirecting to login');
        router.push('/login');
        return;
      }

      try {
        // Use validateToken method which exists in authService
        const currentUser = await authService.validateToken(token);
        console.log('✅ User validated:', currentUser);
        
        if (currentUser.must_change_password === false || currentUser.must_change_password === undefined) {
          // User has already changed password or doesn't need to, redirect to dashboard
          console.log('🏠 Redirecting to dashboard');
          router.push('/dashboard');
        } else {
          // User needs to change password
          console.log('🔑 Redirecting to change password');
          router.push('/change-password');
        }
      } catch (error) {
        console.error('❌ Error validating token:', error);
        // If there's an error, redirect to login
        router.push('/login');
      } finally {
        setIsChecking(false);
      }
    };

    // Only run once when component mounts
    if (isChecking) {
      checkUserStatus();
    }
  }, [token, router, isChecking]);

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-blue-600 to-blue-800 flex justify-center items-center fixed">
      <div className="h-fit w-fit justify-center mb-36 fixed -mt-14">
        <div className="flex flex-col items-center justify-center space-y-8">
          {/* Loading Animation */}
          <div className="relative">
            <div className="w-32 h-32 border-4 border-white/20 rounded-full animate-spin">
              <div className="w-8 h-8 bg-white rounded-full absolute top-0 left-1/2 transform -translate-x-1/2"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Loading Text */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2 animate-pulse">
              Estamos iniciando sua sessão.
            </h2>
            <p className="text-white/80 text-lg">
              Por favor, aguarde.
            </p>
          </div>

          {/* Progress Indicators */}
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-white/70 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-3 h-3 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransitionPage;
