import React from 'react';
import type { RouteOption } from '@/types';
import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui';
import { formatDistance, formatDuration, formatFitness, formatCurrency, formatEmission } from '@/utils/formatters';
import { BarChart3, CheckCircle2, XCircle } from 'lucide-react';

export interface RouteComparisonMatrixProps {
  routes: RouteOption[];
  selectedRouteId?: string;
  onSelectRoute: (id: string) => void;
  className?: string;
}

export const RouteComparisonMatrix: React.FC<RouteComparisonMatrixProps> = ({
  routes,
  selectedRouteId,
  onSelectRoute,
  className,
}) => {
  if (!routes || routes.length === 0) return null;

  return (
    <Card variant="glass" className={className}>
      <CardHeader className="p-4 py-3 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-brand-400" />
          <CardTitle className="text-xs font-semibold">Authoritative Route Benchmark Matrix</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="p-0 overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-surface-800 bg-surface-950/60 text-surface-400">
              <th className="p-3 pl-4 font-medium">Evaluation Metric</th>
              {routes.map((r) => (
                <th
                  key={r.id}
                  onClick={() => onSelectRoute(r.id)}
                  className={`p-3 cursor-pointer transition-colors ${
                    r.id === selectedRouteId
                      ? 'text-brand-300 font-semibold bg-brand-500/10'
                      : 'hover:text-surface-200'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span>{r.rank === 1 ? '★ Recommended' : `Alt ${r.rank - 1}`}</span>
                    <Badge variant={r.algorithm === 'QIGA' ? 'quantum' : 'neutral'} size="sm">
                      {r.algorithm}
                    </Badge>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-800/60 text-surface-200">
            <tr>
              <td className="p-3 pl-4 text-surface-400 font-medium">Travel Duration</td>
              {routes.map((r) => (
                <td key={r.id} className="p-3 font-semibold">
                  {formatDuration(r.durationSeconds)}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-3 pl-4 text-surface-400 font-medium">Travel Distance</td>
              {routes.map((r) => (
                <td key={r.id} className="p-3">
                  {formatDistance(r.distanceMeters)}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-3 pl-4 text-surface-400 font-medium">Fuel / Energy</td>
              {routes.map((r) => (
                <td key={r.id} className="p-3">
                  {r.fuelLiters ? `${r.fuelLiters.toFixed(2)} L` : '—'}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-3 pl-4 text-surface-400 font-medium">CO₂ Emissions</td>
              {routes.map((r) => (
                <td key={r.id} className="p-3 text-emerald-400 font-medium">
                  {formatEmission(r.co2EmissionsKg)}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-3 pl-4 text-surface-400 font-medium">Estimated Tolls / Cost</td>
              {routes.map((r) => (
                <td key={r.id} className="p-3">
                  {formatCurrency(r.estimatedCostUsd)}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-3 pl-4 text-surface-400 font-medium">Congestion Index</td>
              {routes.map((r) => (
                <td key={r.id} className="p-3">
                  {r.congestionIndex !== undefined ? (
                    <span
                      className={`font-semibold ${
                        r.congestionIndex < 0.25
                          ? 'text-emerald-400'
                          : r.congestionIndex < 0.5
                          ? 'text-amber-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {Math.round(r.congestionIndex * 100)}%
                    </span>
                  ) : (
                    '—'
                  )}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-3 pl-4 text-surface-400 font-medium">Pareto Fitness</td>
              {routes.map((r) => (
                <td key={r.id} className="p-3 font-mono text-brand-300 font-semibold">
                  {formatFitness(r.fitnessScore)}%
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-3 pl-4 text-surface-400 font-medium">Feasibility Status</td>
              {routes.map((r) => (
                <td key={r.id} className="p-3">
                  {r.feasible ? (
                    <span className="inline-flex items-center gap-1 text-emerald-400 text-[11px] font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Satisfied
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-rose-400 text-[11px] font-medium">
                      <XCircle className="w-3.5 h-3.5" /> Violated
                    </span>
                  )}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
};
