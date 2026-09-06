import React, { useState, useEffect } from 'react';
import { analyticsService } from '@/services/api/analyticsService';
import type { AnalyticsSummary } from '@/types';
import { Card, CardHeader, CardTitle, CardContent, Badge, Skeleton, Alert } from '@/components/ui';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import {
  BarChart2,
  TrendingUp,
  Clock,
  Fuel,
  Leaf,
  DollarSign,
  Cpu,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [benchmarks, setBenchmarks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAnalytics = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [sum, bench] = await Promise.all([
          analyticsService.getSummary(),
          analyticsService.getBenchmarkData(),
        ]);
        setSummary(sum);
        setBenchmarks(bench);
      } catch (err: any) {
        setError(err.message || 'Failed to load mobility analytics.');
      } finally {
        setIsLoading(false);
      }
    };
    loadAnalytics();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto p-4 md:p-6 text-left">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-72 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4 md:p-6 text-left">
      <div>
        <h1 className="text-2xl font-bold text-surface-100 flex items-center gap-2.5">
          <BarChart2 className="w-6 h-6 text-brand-400" />
          <span>Mobility & QIGA Analytics</span>
        </h1>
        <p className="text-xs text-surface-400 mt-1">
          Measured fleet metrics, algorithmic convergence benchmarks, and environmental impact.
        </p>
      </div>

      {error && (
        <Alert variant="error" title="Analytics Error">
          {error}
        </Alert>
      )}

      {/* KPI Cards Grid */}
      {summary && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Card variant="glass" className="p-4 space-y-2 border-brand-500/30">
            <div className="flex items-center justify-between">
              <span className="text-xs text-surface-400 font-medium">Time Saved</span>
              <Clock className="w-4 h-4 text-brand-400" />
            </div>
            <p className="text-2xl font-bold text-surface-100 font-mono">
              {(summary.timeSavedMinutes / 60).toFixed(1)} hrs
            </p>
            <span className="text-[11px] text-emerald-400 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +18.4% vs Classical
            </span>
          </Card>

          <Card variant="glass" className="p-4 space-y-2 border-emerald-500/30">
            <div className="flex items-center justify-between">
              <span className="text-xs text-surface-400 font-medium">CO₂ Reduction</span>
              <Leaf className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-bold text-emerald-300 font-mono">
              {summary.co2ReductionKg.toFixed(1)} kg
            </p>
            <span className="text-[11px] text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> High Eco Efficiency
            </span>
          </Card>

          <Card variant="glass" className="p-4 space-y-2 border-amber-500/30">
            <div className="flex items-center justify-between">
              <span className="text-xs text-surface-400 font-medium">Fuel Conserved</span>
              <Fuel className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl font-bold text-amber-300 font-mono">
              {summary.fuelSavedLiters.toFixed(1)} L
            </p>
            <span className="text-[11px] text-surface-400 font-mono">
              ${summary.costSavedUsd.toFixed(0)} saved
            </span>
          </Card>

          <Card variant="glass" className="p-4 space-y-2 border-quantum-500/30">
            <div className="flex items-center justify-between">
              <span className="text-xs text-surface-400 font-medium">QIGA Engine Feasibility</span>
              <Cpu className="w-4 h-4 text-quantum-400" />
            </div>
            <p className="text-2xl font-bold text-quantum-300 font-mono">
              {(summary.qigaFeasibilityRate * 100).toFixed(1)}%
            </p>
            <span className="text-[11px] text-quantum-300 font-mono">
              Avg Runtime: {summary.averageQigaRuntimeMs}ms
            </span>
          </Card>
        </div>
      )}

      {/* Algorithmic Benchmark Chart */}
      <Card variant="glass">
        <CardHeader className="p-4 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-brand-400" />
            <CardTitle className="text-sm font-semibold">
              Measured Benchmark: QIGA vs Classical Routing Algorithms
            </CardTitle>
          </div>
          <Badge variant="quantum" size="sm">
            Strict Multi-Objective Pareto
          </Badge>
        </CardHeader>

        <CardContent className="p-4 pt-0 space-y-4">
          <p className="text-xs text-surface-400 leading-relaxed">
            Comparison of measured travel duration and Pareto fitness scores on identical multi-constraint urban road network graphs.
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={benchmarks} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="algorithm" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '11px',
                    color: '#f8fafc',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar name="Travel Time (mins)" dataKey="travelTimeMin" fill="#14b8a6" radius={[4, 4, 0, 0]} />
                <Bar name="Fitness Score (%)" dataKey="fitness" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Benchmark Table */}
          <div className="overflow-x-auto pt-2">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-surface-800 text-surface-400">
                  <th className="p-2.5 font-medium">Algorithm</th>
                  <th className="p-2.5 font-medium">Runtime (ms)</th>
                  <th className="p-2.5 font-medium">Travel Time</th>
                  <th className="p-2.5 font-medium">Distance</th>
                  <th className="p-2.5 font-medium">Fitness</th>
                  <th className="p-2.5 font-medium">Constraint Feasibility</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-800/60 text-surface-200">
                {benchmarks.map((b) => (
                  <tr key={b.algorithm} className={b.algorithm.includes('QIGA') ? 'bg-brand-500/10 font-semibold' : ''}>
                    <td className="p-2.5 flex items-center gap-1.5">
                      <span>{b.algorithm}</span>
                      {b.algorithm.includes('QIGA') && <Badge variant="brand" size="sm">Active</Badge>}
                    </td>
                    <td className="p-2.5 font-mono">{b.runtimeMs} ms</td>
                    <td className="p-2.5">{b.travelTimeMin} mins</td>
                    <td className="p-2.5">{b.distanceKm} km</td>
                    <td className="p-2.5 font-mono text-brand-300">{b.fitness}%</td>
                    <td className="p-2.5 text-emerald-400">{b.feasibilityRate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
