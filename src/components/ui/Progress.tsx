import React from 'react';
import { cn } from '@/utils/cn';

export interface ProgressProps {
  value?: number; // 0 to 100, undefined for indeterminate
  max?: number;
  label?: string;
  showPercent?: boolean;
  variant?: 'brand' | 'quantum' | 'warning' | 'danger';
  className?: string;
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  label,
  showPercent = false,
  variant = 'brand',
  className,
}) => {
  const isIndeterminate = value === undefined;
  const percentage = isIndeterminate ? 0 : Math.min(100, Math.max(0, (value / max) * 100));

  const variants = {
    brand: 'bg-gradient-to-r from-brand-600 to-brand-400',
    quantum: 'bg-gradient-to-r from-quantum-600 to-quantum-400',
    warning: 'bg-amber-500',
    danger: 'bg-rose-500',
  };

  return (
    <div className={cn('w-full space-y-1.5', className)}>
      {(label || showPercent) && (
        <div className="flex justify-between text-xs font-medium text-surface-300">
          <span>{label}</span>
          {showPercent && !isIndeterminate && <span>{Math.round(percentage)}%</span>}
        </div>
      )}
      <div className="w-full h-2 bg-surface-800 rounded-full overflow-hidden relative">
        {isIndeterminate ? (
          <div className={cn('h-full w-1/3 rounded-full animate-[progressIndeterminate_1.5s_infinite_ease-in-out]', variants[variant])} />
        ) : (
          <div
            className={cn('h-full rounded-full transition-all duration-300 ease-out', variants[variant])}
            style={{ width: `${percentage}%` }}
          />
        )}
      </div>
    </div>
  );
};
