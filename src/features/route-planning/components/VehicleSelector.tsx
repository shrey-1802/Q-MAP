import React from 'react';
import type { VehicleConstraints, VehicleType } from '@/types';
import { Car, Bike, Truck, Footprints, Zap } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface VehicleSelectorProps {
  value: VehicleConstraints;
  onChange: (value: VehicleConstraints) => void;
  className?: string;
}

const VEHICLE_OPTIONS: { type: VehicleType; label: string; icon: React.ReactNode; desc: string }[] = [
  { type: 'FOUR_WHEELER', label: 'Car / Van', icon: <Car className="w-5 h-5" />, desc: 'Standard road traffic' },
  { type: 'TWO_WHEELER', label: '2-Wheeler', icon: <Bike className="w-5 h-5" />, desc: 'Agile & lane-filtering' },
  { type: 'HEAVY_LOAD', label: 'Truck / Logistics', icon: <Truck className="w-5 h-5" />, desc: 'Height & weight constrained' },
  { type: 'WALKING', label: 'Pedestrian', icon: <Footprints className="w-5 h-5" />, desc: 'Walkways & direct paths' },
];

export const VehicleSelector: React.FC<VehicleSelectorProps> = ({ value, onChange, className }) => {
  const isHeavy = value.type === 'HEAVY_LOAD';

  const handleTypeSelect = (type: VehicleType) => {
    onChange({
      ...value,
      type,
    });
  };

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-surface-200">Vehicle Profile</label>
        <button
          type="button"
          onClick={() => onChange({ ...value, isElectric: !value.isElectric })}
          className={cn(
            'flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border transition-colors',
            value.isElectric
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              : 'bg-surface-800 text-surface-400 border-surface-700 hover:text-surface-300'
          )}
        >
          <Zap className="w-3 h-3" />
          <span>Electric Vehicle (EV)</span>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {VEHICLE_OPTIONS.map((opt) => {
          const isSelected = value.type === opt.type;
          return (
            <button
              key={opt.type}
              type="button"
              onClick={() => handleTypeSelect(opt.type)}
              className={cn(
                'flex flex-col items-start p-2.5 rounded-xl border text-left transition-all',
                isSelected
                  ? 'bg-brand-500/10 border-brand-500/50 text-brand-300 shadow-sm'
                  : 'bg-surface-900 border-surface-800 text-surface-300 hover:border-surface-700 hover:bg-surface-850'
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className={isSelected ? 'text-brand-400' : 'text-surface-400'}>{opt.icon}</span>
                <span className="text-xs font-semibold text-surface-100">{opt.label}</span>
              </div>
              <span className="text-[10px] text-surface-400 leading-tight">{opt.desc}</span>
            </button>
          );
        })}
      </div>

      {isHeavy && (
        <div className="p-3 bg-surface-900 border border-surface-800 rounded-xl space-y-2.5 animate-fadeIn">
          <p className="text-[11px] font-medium text-amber-400">Logistics & Height Constraints (Strict Mode)</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <label className="text-[10px] text-surface-400 block mb-1">Max Height (m)</label>
              <input
                type="number"
                step="0.1"
                min="1.0"
                max="5.0"
                placeholder="e.g. 4.2"
                value={value.maxHeightMeters || ''}
                onChange={(e) => onChange({ ...value, maxHeightMeters: parseFloat(e.target.value) || undefined })}
                className="w-full bg-surface-950 border border-surface-700 rounded px-2 py-1 text-surface-200 text-xs"
              />
            </div>
            <div>
              <label className="text-[10px] text-surface-400 block mb-1">Max Weight (tons)</label>
              <input
                type="number"
                step="0.5"
                min="1"
                max="40"
                placeholder="e.g. 18.0"
                value={value.maxWeightKg ? value.maxWeightKg / 1000 : ''}
                onChange={(e) =>
                  onChange({ ...value, maxWeightKg: (parseFloat(e.target.value) || 0) * 1000 || undefined })
                }
                className="w-full bg-surface-950 border border-surface-700 rounded px-2 py-1 text-surface-200 text-xs"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
