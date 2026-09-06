import React from 'react';
import { cn } from '@/utils/cn';
import { FolderOpen } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-surface-800/80 bg-surface-900/40',
        className
      )}
    >
      <div className="w-12 h-12 rounded-2xl bg-surface-800 flex items-center justify-center text-surface-400 mb-3 border border-surface-700/60 shadow-inner">
        {icon || <FolderOpen className="w-6 h-6 text-surface-400" />}
      </div>
      <h3 className="text-sm font-semibold text-surface-200">{title}</h3>
      <p className="text-xs text-surface-400 max-w-sm mt-1 mb-4 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
