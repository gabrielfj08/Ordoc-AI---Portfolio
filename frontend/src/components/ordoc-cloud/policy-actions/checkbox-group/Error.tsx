/**
 * PolicyActions CheckboxGroup Error Component
 * Migrated from PrinterCloud PolicyActions/CheckboxGroup/Error.tsx (Arquivo 18/51)
 * 
 * Enhanced version with modern React 19, retry functionality, and improved UX
 */

'use client';

import * as React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface PolicyActionsCheckboxGroupErrorProps {
  onRetry?: () => void;
  error?: string;
  compact?: boolean; // Option for compact display like original
}

const PolicyActionsCheckboxGroupError = ({ 
  onRetry,
  error = 'Erro ao carregar ações',
  compact = false
}: PolicyActionsCheckboxGroupErrorProps) => {
  // Compact mode matches the original PrinterCloud component style
  if (compact) {
    return (
      <div className="flex items-center gap-2 border border-gray-300 rounded-md h-16 px-5 bg-red-50">
        <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
        <span className="text-sm text-gray-600 truncate">
          {error}
        </span>
        {onRetry && (
          <button
            onClick={onRetry}
            className="ml-auto p-1 text-red-600 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 rounded"
            title="Tentar novamente"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  }

  // Enhanced mode with full error display
  return (
    <div className="text-center py-8">
      <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8 text-red-600" />
      </div>
      
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Erro ao Carregar Ações
      </h3>
      
      <p className="text-gray-600 mb-4 max-w-sm mx-auto">
        {error}
      </p>
      
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Tentar Novamente
        </button>
      )}
    </div>
  );
};

export default PolicyActionsCheckboxGroupError;
