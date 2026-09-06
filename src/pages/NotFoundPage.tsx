import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui';
import { Compass, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-surface-950 text-center">
      <div className="space-y-4 max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-surface-900 border border-surface-800 flex items-center justify-center text-brand-400 mx-auto shadow-inner">
          <Compass className="w-8 h-8 animate-pulse" />
        </div>
        <h1 className="text-4xl font-extrabold text-surface-100">404</h1>
        <h2 className="text-base font-semibold text-surface-200">Trajectory Coordinates Not Found</h2>
        <p className="text-xs text-surface-400 leading-relaxed">
          The routing path or resource you requested does not exist on this operational grid.
        </p>
        <Link to="/home">
          <Button variant="primary" size="md" leftIcon={<Home className="w-4 h-4 text-surface-950" />}>
            Return to Route Planner
          </Button>
        </Link>
      </div>
    </div>
  );
};
