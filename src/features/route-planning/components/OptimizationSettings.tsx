import React, { useState } from 'react';
import type { OptimizationObjective, OptimizationWeights } from '@/types';
import { Sliders, Sparkles, Clock, Compass, Fuel, Leaf, ShieldAlert } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface OptimizationSettingsProps {
  objective: OptimizationObjective;
  onObjectiveChange: (obj: OptimizationObjective) => void;
  weights?: OptimizationWeights;
  onWeightsChange?: (weights: OptimizationWeights) => void;
  avoidTolls: boolean;
  onAvoidTollsChange: (val: boolean) => void;
  avoidHighways: boolean;
  onAvoidHighwaysChange: (val: boolean) => void;
  className?: string;
}

const OBJECTIVES: { id: OptimizationObjective; label: string; icon: React.ReactNode; desc: string }[] = [
  { id: 'BALANCED', label: 'Balanced Q-Opt', icon: <Sparkles className="w-4 h-4 text-brand-400" />, desc: 'Optimal Pareto front' },
  { id: 'FASTEST', label: 'Fastest ETA', icon: <Clock className="w-4 h-4 text-sky-400" />, desc: 'Minimum travel duration' },
  { id: 'SHORTEST', label: 'Shortest Path', icon: <Compass className="w-4 h-4 text-indigo-400" />, desc: 'Minimum mileage' },
  { id: 'FUEL_EFFICIENT', label: 'Fuel / Energy', icon: <Fuel className="w-4 h-4 text-amber-400" />, desc: 'Lowest consumption' },
  { id: 'ECO', label: 'Eco / Low CO₂', icon: <Leaf className="w-4 h-4 text-emerald-400" />, desc: 'Green emissions profile' },
  { id: 'LOW_CONGESTION', label: 'Avoid Jams', icon: <ShieldAlert className="w-4 h-4 text-rose-400" />, desc: 'Smooth flow routing' },
];

export const OptimizationSettings: React.FC<OptimizationSettingsProps> = ({
  objective,
  onObjectiveChange,
  weights = { time: 0.35, distance: 0.2, congestion: 0.25, fuel: 0.2 },
  onWeightsChange,
  avoidTolls,
  onAvoidTollsChange,
  avoidHighways,
  onAvoidHighwaysChange,
  className,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleWeightSlider = (key: keyof OptimizationWeights, val: number) => {
    if (onWeightsChange) {
      onWeightsChange({
        ...weights,
        [key]: val / 100,
      });
    }
  };

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-surface-200">QIGA Optimization Objective</label>
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-[11px] text-brand-400 hover:text-brand-300 flex items-center gap-1 transition-colors"
        >
          <Sliders className="w-3 h-3" />
          <span>{showAdvanced ? 'Hide Weights' : 'Custom Weights'}</span>
        </button>
      </div>

      <div className="grid grid-cols-3 gap-1.5">
        {OBJECTIVES.map((obj) => {
          const isSelected = objective === obj.id;
          return (
            <button
              key={obj.id}
              type="button"
              onClick={() => onObjectiveChange(obj.id)}
              className={cn(
                'flex flex-col items-center p-2 rounded-xl border text-center transition-all',
                isSelected
                  ? 'bg-brand-500/10 border-brand-500/50 text-brand-300 shadow-sm'
                  : 'bg-surface-900 border-surface-800 text-surface-400 hover:border-surface-700 hover:text-surface-200'
              )}
            >
              <div className="mb-1">{obj.icon}</div>
              <span className="text-[11px] font-semibold text-surface-100">{obj.label}</span>
              <span className="text-[9px] text-surface-400 mt-0.5">{obj.desc}</span>
            </button>
          );
        })}
      </div>

      {showAdvanced && (
        <div className="p-3 bg-surface-900 border border-surface-800 rounded-xl space-y-2.5 animate-fadeIn">
          <p className="text-[11px] font-medium text-surface-200">Multi-Objective Fitness Weights (Normalized)</p>

          <div className="space-y-2 text-xs">
            <div>
              <div className="flex justify-between text-[11px] text-surface-400 mb-1">
                <span>Time Priority</span>
                <span className="font-mono text-brand-400">{Math.round((weights.time || 0.35) * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={Math.round((weights.time || 0.35) * 100)}
                onChange={(e) => handleWeightSlider('time', parseInt(e.target.value))}
                className="w-full accent-brand-500 h-1.5 bg-surface-950 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-surface-400 mb-1">
                <span>Congestion Avoidance</span>
                <span className="font-mono text-brand-400">{Math.round((weights.congestion || 0.25) * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={Math.round((weights.congestion || 0.25) * 100)}
                onChange={(e) => handleWeightSlider('congestion', parseInt(e.target.value))}
                className="w-full accent-brand-500 h-1.5 bg-surface-950 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-surface-400 mb-1">
                <span>Fuel / Energy Conservation</span>
                <span className="font-mono text-brand-400">{Math.round((weights.fuel || 0.2) * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={Math.round((weights.fuel || 0.2) * 100)}
                onChange={(e) => handleWeightSlider('fuel', parseInt(e.target.value))}
                className="w-full accent-brand-500 h-1.5 bg-surface-950 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* Constraints toggles */}
      <div className="flex items-center gap-4 pt-1 text-xs">
        <label className="flex items-center gap-2 cursor-pointer text-surface-300 hover:text-surface-100">
          <input
            type="checkbox"
            checked={avoidTolls}
            onChange={(e) => onAvoidTollsChange(e.target.checked)}
            className="rounded bg-surface-900 border-surface-700 text-brand-500 focus:ring-brand-500"
          />
          <span>Avoid Tolls</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer text-surface-300 hover:text-surface-100">
          <input
            type="checkbox"
            checked={avoidHighways}
            onChange={(e) => onAvoidHighwaysChange(e.target.checked)}
            className="rounded bg-surface-900 border-surface-700 text-brand-500 focus:ring-brand-500"
          />
          <span>Avoid Highways</span>
        </label>
      </div>
    </div>
  );
};
