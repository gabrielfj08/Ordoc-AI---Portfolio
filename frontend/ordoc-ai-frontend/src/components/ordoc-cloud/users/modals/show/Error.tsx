'use client';

import React from 'react';
import { X, AlertTriangle, RefreshCw } from 'lucide-react';

interface ShowUserModalErrorProps {
  onClose: () => void;
  onRetry?: () => void;
  error?: string;
}

const ShowUserModalError: React.FC<ShowUserModalErrorProps> = ({ 
  onClose, 
  onRetry,
  error = 'Não foi possível carregar as informações do usuário.'
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-red-50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Erro ao Carregar Usuário</h2>
              <p className="text-sm text-gray-600">Ocorreu um problema ao buscar os dados</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center space-y-4">
            {/* Error Icon */}
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>

            {/* Error Message */}
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-gray-900">Oops! Algo deu errado</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {error}
                <br />
                Tente novamente mais tarde ou entre em contato com o suporte se o problema persistir.
              </p>
            </div>

            {/* Error Details (if available) */}
            {error !== 'Não foi possível carregar as informações do usuário.' && (
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-500 font-mono break-all">
                  {error}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex space-x-3">
            {onRetry && (
              <button
                onClick={onRetry}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Tentar Novamente</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowUserModalError;
