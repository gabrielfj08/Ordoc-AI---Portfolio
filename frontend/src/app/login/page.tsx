'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Turnstile } from '@marsidev/react-turnstile';
import { useAuth } from '../../contexts/AuthContext';
import { useClientOnly } from '../../hooks/useClientOnly';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading } = useAuth();
  const isClient = useClientOnly();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  
  // Use ref to persist error state across re-renders
  const persistentError = useRef('');
  const errorCleared = useRef(false);
  
  // Helper functions to manage persistent error
  const setPersistentError = (errorMessage: string) => {
    persistentError.current = errorMessage;
    errorCleared.current = false;
    setError(errorMessage);
  };
  
  const clearPersistentError = () => {
    if (!errorCleared.current && persistentError.current) {
      persistentError.current = '';
      errorCleared.current = true;
      setError('');
    }
  };
  
  // Restore error after re-renders if it wasn't cleared by user
  useEffect(() => {
    if (persistentError.current && !errorCleared.current && !error) {
      setError(persistentError.current);
    }
  }, [error]);
  
  // Security: Track login attempts
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockTimeRemaining, setBlockTimeRemaining] = useState(0);
  
  const MAX_LOGIN_ATTEMPTS = 3;
  const BLOCK_DURATION_MINUTES = 15;

  // Security: Check for existing blocks on component mount
  useEffect(() => {
    const checkExistingBlock = () => {
      const blockData = localStorage.getItem(`login_block_${email}`);
      if (blockData) {
        const { blockedUntil, attempts } = JSON.parse(blockData);
        const now = Date.now();
        
        if (now < blockedUntil) {
          setIsBlocked(true);
          setLoginAttempts(attempts);
          const remainingTime = Math.ceil((blockedUntil - now) / (1000 * 60));
          setBlockTimeRemaining(remainingTime);
          
          // Start countdown timer
          const timer = setInterval(() => {
            const newRemainingTime = Math.ceil((blockedUntil - Date.now()) / (1000 * 60));
            if (newRemainingTime <= 0) {
              // Block expired, reset everything
              localStorage.removeItem(`login_block_${email}`);
              setIsBlocked(false);
              setLoginAttempts(0);
              setBlockTimeRemaining(0);
              clearInterval(timer);
            } else {
              setBlockTimeRemaining(newRemainingTime);
            }
          }, 60000); // Update every minute
          
          return () => clearInterval(timer);
        } else {
          // Block expired, clean up
          localStorage.removeItem(`login_block_${email}`);
          setLoginAttempts(attempts < MAX_LOGIN_ATTEMPTS ? attempts : 0);
        }
      }
    };
    
    if (email) {
      checkExistingBlock();
    }
  }, [email]);
  
  // Removed problematic useEffect - using direct clearing in inputs instead
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push('/transition');
    }
  }, [isAuthenticated, isLoading, router]);
  
  // Security: Handle failed login attempt
  const handleFailedLogin = (email: string) => {
    const newAttempts = loginAttempts + 1;
    setLoginAttempts(newAttempts);
    
    if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
      // Block user
      const blockedUntil = Date.now() + (BLOCK_DURATION_MINUTES * 60 * 1000);
      const blockData = {
        attempts: newAttempts,
        blockedUntil: blockedUntil
      };
      
      localStorage.setItem(`login_block_${email}`, JSON.stringify(blockData));
      setIsBlocked(true);
      setBlockTimeRemaining(BLOCK_DURATION_MINUTES);
      
      setPersistentError(`Muitas tentativas de login incorretas. Sua conta foi temporariamente bloqueada por ${BLOCK_DURATION_MINUTES} minutos por segurança.`);
    } else {
      const remainingAttempts = MAX_LOGIN_ATTEMPTS - newAttempts;
      setPersistentError(`Usuário e/ou senha não identificados. Você tem mais ${remainingAttempts} tentativa${remainingAttempts > 1 ? 's' : ''} antes do bloqueio temporário.`);
    }
  };
  
  // Security: Reset attempts on successful login
  const handleSuccessfulLogin = (email: string) => {
    localStorage.removeItem(`login_block_${email}`);
    setLoginAttempts(0);
    setIsBlocked(false);
    setBlockTimeRemaining(0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Security: Check if user is blocked
    if (isBlocked) {
      setError(`Sua conta está temporariamente bloqueada. Tente novamente em ${blockTimeRemaining} minuto${blockTimeRemaining > 1 ? 's' : ''}.`);
      return;
    }
    
    if (!email || !password) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    if (!turnstileToken) {
      setError('Verificação de segurança pendente. Aguarde um momento.');
      return;
    }

    // Don't clear error automatically - let it persist until user types
    setIsSubmitting(true);

    try {
      // Include Turnstile token for anti-bot verification
      console.log('🚀 Starting login process...');
      console.log('📧 Email:', email);
      console.log('🔐 User type: internal');
      console.log('🎫 Turnstile token:', turnstileToken ? 'Present' : 'Missing');
      
      const result = await login(email, password, 'internal', turnstileToken || undefined);
      console.log('📋 Login result:', result);
      console.log('✅ Login function completed successfully!');
      
      // Security: Reset attempts on successful login
      handleSuccessfulLogin(email);
      
      // Always redirect to transition page for proper flow control
      // The transition page will handle password change verification
      console.log('🔄 Login successful - redirecting to /transition');
      console.log('🌐 Router object:', router);
      
      // Add a small delay to ensure state is updated
      setTimeout(() => {
        console.log('⏰ Executing router.push after timeout');
        router.push('/transition');
      }, 100);
    } catch (error: unknown) {
      console.error('❌ Login failed:', error);
      
      // Security: Handle failed login attempt
      handleFailedLogin(email);
      
      // Reset Turnstile on error
      setTurnstileToken(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Don't render on server
  if (!isClient) {
    return null;
  }

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
    <div className="fixed inset-0 z-50">
      {/* Modal Backdrop with blur */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => router.back()}
      ></div>
      
      {/* Modal Container */}
      <div className="flex items-center justify-center min-h-full p-4">
        {/* Modal Content */}
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative z-10 transform transition-all duration-300">
          {/* Close Button */}
          <button
            onClick={() => router.back()}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
                <span className="text-white text-xl font-bold">O</span>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Acesse sua conta</h2>
            <p className="text-gray-600 text-sm">Entre no futuro da gestão documental</p>
          </div>



          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  // Clear persistent error when user types
                  if (error) {
                    clearPersistentError();
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Digite seu email"
                autoComplete="username"
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    // Clear persistent error when user types
                    if (error) {
                      clearPersistentError();
                    }
                  }}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Digite sua senha"
                  autoComplete="current-password"
                  data-form-type="login"
                />
              </div>
              {(error || isBlocked) && (
                <div className="mt-2 flex items-center">
                  <svg className="w-4 h-4 text-red-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm text-red-600">
                    {isBlocked 
                      ? `Muitas tentativas incorretas. Aguarde ${blockTimeRemaining} minuto${blockTimeRemaining > 1 ? 's' : ''}.`
                      : 'Senha ou endereço de e-mail incorretos.'
                    }
                  </span>
                </div>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-600">Lembrar de mim</span>
              </label>
              <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800 transition-colors">
                Esqueceu a senha?
              </Link>
            </div>

            {/* Verificação de Segurança - Design Ordoc-AI */}
            <div className="flex justify-center">
              <div className="relative">
                {/* Turnstile oculto para funcionalidade */}
                <div className="absolute opacity-0 pointer-events-none">
                  <Turnstile
                    siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'}
                    onSuccess={(token) => {
                      console.log('Turnstile success:', token);
                      setTurnstileToken(token);
                    }}
                    onError={(error) => {
                      console.error('Turnstile error:', error);
                      setTurnstileToken(null);
                    }}
                    onExpire={() => {
                      console.log('Turnstile expired');
                      setTurnstileToken(null);
                    }}
                    onLoad={() => {
                      console.log('Turnstile loaded');
                    }}
                  />
                </div>
                
                {/* Visual customizado */}
                <div className="bg-white border border-blue-600 rounded-lg px-4 py-2 shadow-sm flex items-center gap-2 text-sm">
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                    turnstileToken 
                      ? 'bg-green-500 border-green-500' 
                      : 'border-gray-300'
                  }`}>
                    {turnstileToken && (
                      <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <span className="text-gray-700">
                    {turnstileToken ? 'Verificação concluída' : 'Verificando segurança...'}
                  </span>
                  <div className="text-xs text-gray-500 ml-auto">Cloudflare</div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || isBlocked}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                isSubmitting 
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : isBlocked
                  ? 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-500 cursor-not-allowed border border-gray-300'
                  : 'bg-black text-white hover:bg-gray-800 active:bg-gray-900 transform hover:scale-[1.02] active:scale-[0.98]'
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Entrando...
                </div>
              ) : isBlocked ? (
                <div className="flex items-center justify-center">
                  <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H10m2-5a2 2 0 100-4 2 2 0 000 4z" />
                  </svg>
                  <span className="text-gray-500">Aguarde {blockTimeRemaining}min</span>
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <span>Entrar</span>
                  <svg className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              )}
            </button>
          </form>

          {/* Create Account Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm">
              Não tem uma conta?{' '}
              <Link href="/register" className="text-blue-600 hover:text-blue-800 font-medium transition-colors">
                Criar conta
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>


    </>
  );
}
