import React from 'react';
import { cn } from '@/utils/cn';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
  variant?: 'pill' | 'underline';
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className,
  variant = 'pill',
}) => {
  return (
    <div
      role="tablist"
      className={cn(
        'flex items-center gap-1.5 p-1 bg-surface-900 border border-surface-800 rounded-xl',
        variant === 'underline' && 'bg-transparent border-b border-surface-800 rounded-none p-0 gap-4',
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={cn(
              'flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all select-none',
              variant === 'pill' &&
                (isActive
                  ? 'bg-brand-500 text-surface-950 font-semibold shadow-sm'
                  : 'text-surface-400 hover:text-surface-100 hover:bg-surface-800'),
              variant === 'underline' &&
                (isActive
                  ? 'text-brand-400 border-b-2 border-brand-400 font-semibold pb-2.5 rounded-none'
                  : 'text-surface-400 hover:text-surface-200 pb-2.5 rounded-none')
            )}
          >
            {tab.icon && <span className="w-4 h-4">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={cn(
                  'text-[10px] px-1.5 py-0.5 rounded-full font-semibold',
                  isActive ? 'bg-surface-950/20 text-surface-950' : 'bg-surface-800 text-surface-300'
                )}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
