import React, { useState } from 'react';
import { LocationSearch } from './LocationSearch';
import { VehicleSelector } from './VehicleSelector';
import { OptimizationSettings } from './OptimizationSettings';
import { Button, Alert } from '@/components/ui';
import type {
  LocationPoint,
  VehicleConstraints,
  OptimizationObjective,
  OptimizationWeights,
  RouteOptimizationRequest,
} from '@/types';
import { Plus, Trash2, ArrowUpDown, Sparkles, MapPin, Flag, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface RoutePlannerFormProps {
  onSubmit: (request: RouteOptimizationRequest) => void;
  isLoading?: boolean;
  className?: string;
  initialOrigin?: LocationPoint | null;
  initialDestination?: LocationPoint | null;
  onOriginChange?: (loc: LocationPoint | null) => void;
  onDestinationChange?: (loc: LocationPoint | null) => void;
  onStopsChange?: (stops: LocationPoint[]) => void;
}

export const RoutePlannerForm: React.FC<RoutePlannerFormProps> = ({
  onSubmit,
  isLoading = false,
  className,
  initialOrigin = null,
  initialDestination = null,
  onOriginChange,
  onDestinationChange,
  onStopsChange,
}) => {
  const [origin, setOrigin] = useState<LocationPoint | null>(initialOrigin);
  const [destination, setDestination] = useState<LocationPoint | null>(initialDestination);
  const [stops, setStops] = useState<LocationPoint[]>([]);
  const [vehicle, setVehicle] = useState<VehicleConstraints>({ type: 'FOUR_WHEELER', isElectric: false });
  const [objective, setObjective] = useState<OptimizationObjective>('BALANCED');
  const [weights, setWeights] = useState<OptimizationWeights>({ time: 0.35, distance: 0.2, congestion: 0.25, fuel: 0.2 });
  const [avoidTolls, setAvoidTolls] = useState(false);
  const [avoidHighways, setAvoidHighways] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleOriginChange = (loc: LocationPoint | null) => {
    setOrigin(loc);
    if (onOriginChange) onOriginChange(loc);
    if (validationError) setValidationError(null);
  };

  const handleDestinationChange = (loc: LocationPoint | null) => {
    setDestination(loc);
    if (onDestinationChange) onDestinationChange(loc);
    if (validationError) setValidationError(null);
  };

  const handleAddStop = () => {
    if (stops.length >= 8) {
      setValidationError('Maximum of 8 intermediate stops allowed per optimization run.');
      return;
    }
    const updated = [...stops, { address: '', latitude: 0, longitude: 0 }];
    setStops(updated);
    if (onStopsChange) onStopsChange(updated);
  };

  const handleUpdateStop = (index: number, loc: LocationPoint | null) => {
    const updated = [...stops];
    if (loc) {
      updated[index] = loc;
    } else {
      updated.splice(index, 1);
    }
    setStops(updated);
    if (onStopsChange) onStopsChange(updated);
  };

  const handleRemoveStop = (index: number) => {
    const updated = stops.filter((_, i) => i !== index);
    setStops(updated);
    if (onStopsChange) onStopsChange(updated);
  };

  const handleMoveStop = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= stops.length) return;
    const updated = [...stops];
    const temp = updated[index]!;
    updated[index] = updated[newIndex]!;
    updated[newIndex] = temp;
    setStops(updated);
    if (onStopsChange) onStopsChange(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!origin || !origin.latitude || !origin.longitude) {
      setValidationError('Please specify a valid start origin location.');
      return;
    }
    if (!destination || !destination.latitude || !destination.longitude) {
      setValidationError('Please specify a valid final destination location.');
      return;
    }

    const validStops = stops.filter((s) => s.latitude && s.longitude);

    setValidationError(null);
    onSubmit({
      origin,
      destination,
      stops: validStops,
      vehicle,
      objective,
      weights,
      avoidTolls,
      avoidHighways,
    });
  };

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-4 text-left', className)}>
      {validationError && (
        <Alert variant="error" title="Invalid Route Parameters">
          {validationError}
        </Alert>
      )}

      {/* Waypoints & Stops Container */}
      <div className="space-y-2 p-3 bg-surface-900/80 border border-surface-800 rounded-2xl">
        <div className="flex items-center justify-between pb-1 border-b border-surface-800/60">
          <span className="text-xs font-semibold text-surface-200">Waypoints & Sequence</span>
          <button
            type="button"
            onClick={handleAddStop}
            className="text-[11px] font-medium text-brand-400 hover:text-brand-300 flex items-center gap-1 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Stop</span>
          </button>
        </div>

        {/* Origin Input */}
        <LocationSearch
          label="Origin (Start)"
          placeholder="Enter departure address or pinpoint..."
          value={origin}
          onChange={handleOriginChange}
          icon={<MapPin className="w-4 h-4 text-brand-400" />}
        />

        {/* Intermediate Stops */}
        {stops.map((stop, index) => (
          <div key={index} className="flex items-center gap-1.5 animate-fadeIn">
            <div className="flex-1">
              <LocationSearch
                placeholder={`Intermediate Stop ${index + 1}...`}
                value={stop.latitude ? stop : null}
                onChange={(loc) => handleUpdateStop(index, loc)}
                icon={<span className="text-[11px] font-bold text-quantum-400">{index + 1}</span>}
              />
            </div>
            <div className="flex items-center gap-0.5 mt-4">
              <button
                type="button"
                onClick={() => handleMoveStop(index, 'up')}
                disabled={index === 0}
                className="p-1 text-surface-400 hover:text-surface-200 disabled:opacity-30"
                title="Move Up"
              >
                <ChevronUp className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleMoveStop(index, 'down')}
                disabled={index === stops.length - 1}
                className="p-1 text-surface-400 hover:text-surface-200 disabled:opacity-30"
                title="Move Down"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleRemoveStop(index)}
                className="p-1 text-rose-400 hover:text-rose-300 transition-colors"
                title="Remove Stop"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {/* Destination Input */}
        <LocationSearch
          label="Destination (End)"
          placeholder="Enter arrival destination..."
          value={destination}
          onChange={handleDestinationChange}
          icon={<Flag className="w-4 h-4 text-rose-400" />}
        />
      </div>

      {/* Vehicle Profile Selector */}
      <VehicleSelector value={vehicle} onChange={setVehicle} />

      {/* Optimization Preset & Objective Weights */}
      <OptimizationSettings
        objective={objective}
        onObjectiveChange={setObjective}
        weights={weights}
        onWeightsChange={setWeights}
        avoidTolls={avoidTolls}
        onAvoidTollsChange={setAvoidTolls}
        avoidHighways={avoidHighways}
        onAvoidHighwaysChange={setAvoidHighways}
      />

      {/* Submit Optimization CTA */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        isLoading={isLoading}
        leftIcon={<Sparkles className="w-4 h-4 text-surface-950" />}
        className="w-full"
      >
        Run Quantum Optimization (QIGA)
      </Button>
    </form>
  );
};
