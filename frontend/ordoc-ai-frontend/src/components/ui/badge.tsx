import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'secondary' | 'outline';
  className?: string;
}

const badgeVariants = {
  default: 'bg-gray-100 text-gray-800',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-yellow-100 text-yellow-800',
  error: 'bg-red-100 text-red-800',
  info: 'bg-blue-100 text-blue-800',
  secondary: 'bg-gray-200 text-gray-700',
  outline: 'border border-gray-300 text-gray-700 bg-transparent',
};

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const variantClasses = badgeVariants[variant];
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClasses} ${className}`}>
      {children}
    </span>
  );
}
