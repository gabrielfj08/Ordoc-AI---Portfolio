import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  variant?: 'full' | 'horizontal' | 'vertical' | 'icon';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ 
  variant = 'horizontal', 
  size = 'md', 
  className 
}) => {
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-12',
    lg: 'h-16',
    xl: 'h-20'
  };

  const IconLogo = ({ className: iconClassName }: { className?: string }) => (
    <div className={cn(
      "flex items-center justify-center rounded-xl bg-gradient-primary text-white font-bold",
      sizeClasses[size],
      iconClassName
    )}>
      <span className="text-2xl">O</span>
    </div>
  );

  const BrandText = ({ className: textClassName }: { className?: string }) => (
    <div className={cn("flex flex-col", textClassName)}>
      <span className="font-bold text-2xl gradient-text">Ordoc-AI</span>
      {variant === 'full' && (
        <span className="text-sm text-neutral-600 font-medium">
          Ordem Inteligente no Cuidado
        </span>
      )}
    </div>
  );

  if (variant === 'icon') {
    return <IconLogo className={className} />;
  }

  if (variant === 'vertical') {
    return (
      <div className={cn("flex flex-col items-center gap-3", className)}>
        <IconLogo />
        <BrandText className="text-center" />
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <IconLogo />
      <BrandText />
    </div>
  );
};
