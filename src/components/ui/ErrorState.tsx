import React from 'react';
import { cn } from '@/utils/cn';
import { AlertOctagon, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  errorDetail?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = "We couldn't complete this action right now. Please try again.",
  errorDetail,
  onRetry,
  className,
}) => {
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-rose-900/40 bg-rose-950/20 text-rose-200',
        className
      )}
    >
      <div className="w-12 h-12 rounded-2xl bg-rose-900/40 border border-rose-700/50 flex items-center justify-center text-rose-400 mb-3 shadow-inner">
        <AlertOctagon className="w-6 h-6" />
      </div>
      <h3 className="text-sm font-semibold text-rose-100">{title}</h3>
      <p className="text-xs text-rose-300/80 max-w-sm mt-1 mb-4 leading-relaxed">{message}</p>
      {errorDetail && (
        <code className="text-[11px] font-mono bg-surface-950/80 text-rose-400 px-3 py-1.5 rounded-lg mb-4 border border-rose-900/50 max-w-md break-all">
          {errorDetail}
        </code>
      )}
      {onRetry && (
        <Button variant="danger" size="sm" onClick={onRetry} leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
          Try Again
        </Button>
      )}
    </div>
  );
};
