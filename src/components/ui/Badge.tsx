import React from 'react';
import { cn } from '@/utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'brand' | 'quantum' | 'success' | 'warning' | 'danger' | 'neutral' | 'outline';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'neutral',
  size = 'md',
  children,
  ...props
}) => {
  const variants = {
    brand: 'bg-brand-500/15 text-brand-300 border border-brand-500/30',
    quantum: 'bg-quantum-500/15 text-quantum-300 border border-quantum-500/30 font-mono',
    success: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30',
    warning: 'bg-amber-500/15 text-amber-300 border border-amber-500/30',
    danger: 'bg-rose-500/15 text-rose-300 border border-rose-500/30',
    neutral: 'bg-surface-800 text-surface-300 border border-surface-700',
    outline: 'bg-transparent text-surface-300 border border-surface-600',
  };

  const sizes = {
    sm: 'text-[10px] font-semibold px-2 py-0.5 rounded-full',
    md: 'text-xs font-semibold px-2.5 py-1 rounded-full',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 leading-none transition-colors select-none',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
