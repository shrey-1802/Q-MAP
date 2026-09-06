import React from 'react';
import type { RouteOption } from '@/types';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button } from '@/components/ui';
import { formatDistance, formatDuration, formatFitness, formatCurrency, formatEmission } from '@/utils/formatters';
import { Sparkles, Navigation, Clock, Compass, Fuel, Leaf, ShieldCheck, AlertTriangle } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface RouteResultCardProps {
  route: RouteOption;
  isSelected?: boolean;
  onSelect: () => void;
  onStartNavigation?: () => void;
  className?: string;
}

export const RouteResultCard: React.FC<RouteResultCardProps> = ({
  route,
  isSelected = false,
  onSelect,
  onStartNavigation,
  className,
}) => {
  const isRecommended = route.rank === 1;
  const isQiga = route.algorithm === 'QIGA';

  return (
    <Card
      variant={isSelected ? 'glass' : 'interactive'}
      onClick={onSelect}
      className={cn(
        'transition-all duration-200 border-l-4 text-left',
        isSelected
          ? isRecommended
            ? 'border-brand-500 shadow-glow-teal ring-1 ring-brand-500/40 bg-surface-900/95'
            : 'border-quantum-500 shadow-glow-indigo ring-1 ring-quantum-500/40 bg-surface-900/95'
          : 'border-l-surface-700 hover:border-l-surface-500 bg-surface-900/80',
        className
      )}
    >
      <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          {isRecommended && (
            <Badge variant="brand" size="sm">
              <Sparkles className="w-3 h-3" />
              <span>Recommended</span>
            </Badge>
          )}
          <Badge variant={isQiga ? 'quantum' : 'neutral'} size="sm">
            {route.algorithm}
          </Badge>
          {route.isFallback && (
            <Badge variant="warning" size="sm">
              Fallback
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-1 text-xs font-mono text-brand-300">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Fit: {formatFitness(route.fitnessScore)}%</span>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-1 space-y-3">
        <div>
          <h4 className="text-sm font-semibold text-surface-100">{route.name}</h4>
        </div>

        {/* Primary Metrics */}
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          <div className="bg-surface-950/60 p-2 rounded-lg border border-surface-800">
            <span className="text-[10px] text-surface-400 block flex items-center justify-center gap-1">
              <Clock className="w-2.5 h-2.5" /> Time
            </span>
            <span className="font-semibold text-surface-100">{formatDuration(route.durationSeconds)}</span>
          </div>

          <div className="bg-surface-950/60 p-2 rounded-lg border border-surface-800">
            <span className="text-[10px] text-surface-400 block flex items-center justify-center gap-1">
              <Compass className="w-2.5 h-2.5" /> Dist
            </span>
            <span className="font-semibold text-surface-100">{formatDistance(route.distanceMeters)}</span>
          </div>

          <div className="bg-surface-950/60 p-2 rounded-lg border border-surface-800">
            <span className="text-[10px] text-surface-400 block flex items-center justify-center gap-1">
              <Fuel className="w-2.5 h-2.5" /> Fuel
            </span>
            <span className="font-semibold text-surface-100">{route.fuelLiters?.toFixed(1) || '—'} L</span>
          </div>

          <div className="bg-surface-950/60 p-2 rounded-lg border border-surface-800">
            <span className="text-[10px] text-surface-400 block flex items-center justify-center gap-1">
              <Leaf className="w-2.5 h-2.5" /> CO₂
            </span>
            <span className="font-semibold text-emerald-400">{formatEmission(route.co2EmissionsKg)}</span>
          </div>
        </div>

        {/* Explanation Chips */}
        {route.explanation && route.explanation.length > 0 && (
          <div className="space-y-1 pt-1">
            {route.explanation.slice(0, 2).map((exp, i) => (
              <p key={i} className="text-[11px] text-surface-300 flex items-start gap-1.5 leading-relaxed">
                <span className="text-brand-400 mt-0.5">•</span>
                <span>{exp}</span>
              </p>
            ))}
          </div>
        )}

        {/* Actions */}
        {isSelected && onStartNavigation && (
          <div className="pt-2">
            <Button
              variant={isRecommended ? 'primary' : 'quantum'}
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onStartNavigation();
              }}
              leftIcon={<Navigation className="w-3.5 h-3.5" />}
              className="w-full"
            >
              Start Live Navigation
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
