'use client';

import React, { useState } from 'react';
import { Mail, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { SendPasswordProps } from './types';

const SendPassword: React.FC<SendPasswordProps> = ({ 
  userId, 
  onSuccess, 
  onError 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendPassword = async () => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      // Mock API call - will be replaced with real API integration
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate success
      setIsSuccess(true);
      onSuccess?.();
      
      // Reset success state after 3 seconds
      setTimeout(() => {
        setIsSuccess(false);
      }, 3000);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro ao enviar senha. Tente novamente.';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex items-center space-x-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
        <CheckCircle2 className="h-5 w-5 text-green-600" />
        <span className="text-sm text-green-800">Senha enviada com sucesso!</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-3">
        <div className="flex items-center space-x-2 px-4 py-2 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <span className="text-sm text-red-800">{error}</span>
        </div>
        <button
          onClick={handleSendPassword}
          disabled={isLoading}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Enviando...</span>
            </>
          ) : (
            <>
              <Mail className="h-4 w-4" />
              <span>Tentar Novamente</span>
            </>
          )}
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleSendPassword}
      disabled={isLoading}
      className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Enviando...</span>
        </>
      ) : (
        <>
          <Mail className="h-4 w-4" />
          <span>Enviar Nova Senha</span>
        </>
      )}
    </button>
  );
};

export default SendPassword;
