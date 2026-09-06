import React from 'react';
import { cn } from '@/utils/cn';
import { AlertCircle, AlertTriangle, CheckCircle2, Info } from 'lucide-react';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'success' | 'warning' | 'error' | 'quantum';
  title?: string;
  action?: React.ReactNode;
}

export const Alert: React.FC<AlertProps> = ({
  className,
  variant = 'info',
  title,
  action,
  children,
  ...props
}) => {
  const icons = {
    info: <Info className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />,
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />,
    quantum: <Info className="w-5 h-5 text-quantum-400 shrink-0 mt-0.5" />,
  };

  const variants = {
    info: 'bg-sky-950/40 border-sky-800/60 text-sky-200',
    success: 'bg-emerald-950/40 border-emerald-800/60 text-emerald-200',
    warning: 'bg-amber-950/40 border-amber-800/60 text-amber-200',
    error: 'bg-rose-950/40 border-rose-800/60 text-rose-200',
    quantum: 'bg-quantum-950/40 border-quantum-800/60 text-quantum-200',
  };

  return (
    <div
      role="alert"
      className={cn(
        'flex items-start gap-3 p-4 rounded-xl border transition-all text-sm',
        variants[variant],
        className
      )}
      {...props}
    >
      {icons[variant]}
      <div className="flex-1 min-w-0">
        {title && <h4 className="font-semibold mb-1 text-surface-100">{title}</h4>}
        <div className="text-xs opacity-90 leading-relaxed">{children}</div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};
