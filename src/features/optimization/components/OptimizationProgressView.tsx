import React from 'react';
import type { QIGAOptimizationResponse } from '@/types';
import { Card, CardHeader, CardTitle, CardContent, Progress, Badge, Button } from '@/components/ui';
import { Cpu, RotateCcw, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface OptimizationProgressViewProps {
  response: QIGAOptimizationResponse | null;
  onCancel?: () => void;
  className?: string;
}

const STAGES = [
  { key: 'QUEUED', label: 'Queued in QIGA Cluster' },
  { key: 'PREPARING_ROAD_NETWORK', label: 'Road Topology Matrix' },
  { key: 'LOADING_TRAFFIC', label: 'Real-time Congestion' },
  { key: 'EVALUATING_CANDIDATES', label: 'Quantum Qubit Rotation' },
  { key: 'SELECTING_BEST_ROUTE', label: 'Authoritative Pareto Selection' },
  { key: 'COMPLETED', label: 'Optimization Finalized' },
];

export const OptimizationProgressView: React.FC<OptimizationProgressViewProps> = ({
  response,
  onCancel,
  className,
}) => {
  if (!response) return null;

  const currentStatus = response.status;
  const isCompleted = currentStatus === 'COMPLETED';
  const isFailed = currentStatus === 'FAILED';

  const currentStageIndex = STAGES.findIndex((s) => s.key === currentStatus);

  return (
    <Card variant="glass" className={cn('space-y-4 border-brand-500/30', className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-brand-400 animate-pulse" />
          <div>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <span>QIGA Engine Execution</span>
              <Badge variant="quantum" size="sm">
                {response.algorithm || 'QIGA'}
              </Badge>
            </CardTitle>
            <p className="text-[11px] font-mono text-surface-400 mt-0.5">
              Job ID: {response.requestId}
            </p>
          </div>
        </div>

        {onCancel && !isCompleted && !isFailed && (
          <Button variant="ghost" size="sm" onClick={onCancel} className="text-surface-400 hover:text-rose-400 text-xs">
            Cancel
          </Button>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <Progress
          value={response.progressPercent}
          label={response.currentStageMessage || 'Running Quantum Gate Optimization...'}
          showPercent={true}
          variant="quantum"
        />

        {/* Step-by-step Execution Pipeline */}
        <div className="space-y-2 pt-1">
          {STAGES.map((stage, idx) => {
            const isPast = isCompleted || currentStageIndex > idx;
            const isCurrent = currentStageIndex === idx && !isCompleted;

            return (
              <div
                key={stage.key}
                className={cn(
                  'flex items-center gap-2.5 text-xs p-2 rounded-lg transition-colors',
                  isCurrent && 'bg-brand-500/10 border border-brand-500/30 font-medium text-brand-300',
                  isPast && 'text-surface-300 opacity-90',
                  !isPast && !isCurrent && 'text-surface-500 opacity-50'
                )}
              >
                {isPast ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-brand-400 animate-spin shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-surface-600 shrink-0" />
                )}
                <span className="truncate">{stage.label}</span>
              </div>
            );
          })}
        </div>

        {/* Optimization Metrics Telemetry Pills */}
        <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
          <div className="bg-surface-950/60 p-2 rounded-lg border border-surface-800">
            <span className="text-[10px] text-surface-400 block">Iteration</span>
            <span className="font-mono font-semibold text-brand-300">
              {response.iterationsCompleted || 0} / {response.maxIterations || 25}
            </span>
          </div>
          <div className="bg-surface-950/60 p-2 rounded-lg border border-surface-800">
            <span className="text-[10px] text-surface-400 block">Population</span>
            <span className="font-mono font-semibold text-quantum-300">
              {response.populationSize || 50} Qubits
            </span>
          </div>
          <div className="bg-surface-950/60 p-2 rounded-lg border border-surface-800">
            <span className="text-[10px] text-surface-400 block">Feasible Routes</span>
            <span className="font-mono font-semibold text-emerald-300">
              {response.feasibleSolutionCount || 0}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
