'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import LoginForm from '@/components/ordoc-cidadao/LoginForm';
import { ExternalAuthService } from '@/services/ordoc-cidadao';

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = async (values: { cpfCnpj: string; password: string }) => {
    try {
      const response = await ExternalAuthService.login(values);
      
      // Store token and redirect
      localStorage.setItem('ordoc-cidadao-token', response.data.token);
      router.push('/dashboard/ordoc-cidadao');
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full">
        <LoginForm secret="" onSubmit={handleLogin} />
      </div>
    </div>
  );
}
