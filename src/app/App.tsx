import React, { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { QueryProvider } from './providers/QueryProvider';
import { ErrorBoundary } from '@/components/feedback/ErrorBoundary';
import { Loader2 } from 'lucide-react';

const PageFallback: React.FC = () => (
  <div className="min-h-screen bg-surface-950 flex flex-col items-center justify-center gap-3 text-surface-400">
    <Loader2 className="w-8 h-8 animate-spin text-brand-400" />
    <span className="text-xs font-mono tracking-wider text-surface-300">INITIALIZING QIGA PLATFORM...</span>
  </div>
);

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <Suspense fallback={<PageFallback />}>
          <RouterProvider router={router} />
        </Suspense>
      </QueryProvider>
    </ErrorBoundary>
  );
};
