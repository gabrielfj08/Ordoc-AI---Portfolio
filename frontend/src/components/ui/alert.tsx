import React from 'react';
import { ExclamationTriangleIcon, CheckCircleIcon, InformationCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

interface AlertProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'destructive';
  className?: string;
}

const alertVariants = {
  default: {
    container: 'bg-gray-50 border-gray-200 text-gray-800',
    icon: InformationCircleIcon,
    iconColor: 'text-gray-400'
  },
  success: {
    container: 'bg-green-50 border-green-200 text-green-800',
    icon: CheckCircleIcon,
    iconColor: 'text-green-400'
  },
  warning: {
    container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    icon: ExclamationTriangleIcon,
    iconColor: 'text-yellow-400'
  },
  error: {
    container: 'bg-red-50 border-red-200 text-red-800',
    icon: XCircleIcon,
    iconColor: 'text-red-400'
  },
  info: {
    container: 'bg-blue-50 border-blue-200 text-blue-800',
    icon: InformationCircleIcon,
    iconColor: 'text-blue-400'
  },
  destructive: {
    container: 'bg-red-50 border-red-200 text-red-800',
    icon: XCircleIcon,
    iconColor: 'text-red-400'
  },
};

export function Alert({ children, variant = 'default', className = '' }: AlertProps) {
  const config = alertVariants[variant];
  const Icon = config.icon;
  
  return (
    <div className={`border rounded-md p-4 ${config.container} ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <Icon className={`h-5 w-5 ${config.iconColor}`} />
        </div>
        <div className="ml-3">
          {children}
        </div>
      </div>
    </div>
  );
}

export function AlertTitle({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <h3 className={`text-sm font-medium ${className}`}>
      {children}
    </h3>
  );
}

export function AlertDescription({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`mt-2 text-sm ${className}`}>
      {children}
    </div>
  );
}
