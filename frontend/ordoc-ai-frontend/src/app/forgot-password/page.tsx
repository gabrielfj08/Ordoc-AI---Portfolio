'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { authService } from '@/services/auth';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Email é obrigatório');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email inválido');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await authService.requestPasswordReset(email);
      setIsSubmitted(true);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Erro ao solicitar recuperação de senha');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-8">
          {/* Logo and Header */}
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-lg">
              <span className="text-2xl font-bold text-blue-600">O</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Email Enviado!
            </h2>
            <p className="text-blue-100">
              Verifique sua caixa de entrada
            </p>
          </div>

          {/* Success Message */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Instruções enviadas
            </h3>
            
            <p className="text-gray-600 mb-6">
              Enviamos um email com instruções para redefinir sua senha para{' '}
              <span className="font-medium text-gray-900">{email}</span>
            </p>
            
            <p className="text-sm text-gray-500 mb-6">
              Não recebeu o email? Verifique sua pasta de spam ou tente novamente em alguns minutos.
            </p>

            <Link
              href="/login"
              className="inline-flex items-center justify-center w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-700 hover:to-green-700 transition-all duration-200 transform hover:scale-[1.02]"
            >
              Voltar ao Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Logo and Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-lg">
            <span className="text-2xl font-bold text-blue-600">O</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Recuperar Senha
          </h2>
          <p className="text-blue-100">
            Digite seu email para receber as instruções
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  error ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="seu@email.com"
              />
              {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-700 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Enviando...
                </div>
              ) : (
                'Enviar Instruções'
              )}
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200 inline-flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Voltar ao Login
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-blue-100 text-sm">
          <p>&copy; 2024 Ordoc-AI. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  );
}
