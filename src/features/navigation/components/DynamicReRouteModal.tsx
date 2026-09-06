import React from 'react';
import { Modal, Button, Badge } from '@/components/ui';
import { AlertTriangle, Sparkles, ArrowRight } from 'lucide-react';
import type { RouteOption } from '@/types';
import { formatDuration, formatDistance } from '@/utils/formatters';

export interface DynamicReRouteModalProps {
  isOpen: boolean;
  currentRoute: RouteOption;
  newQigaRoute: RouteOption;
  onAccept: () => void;
  onReject: () => void;
}

export const DynamicReRouteModal: React.FC<DynamicReRouteModalProps> = ({
  isOpen,
  currentRoute,
  newQigaRoute,
  onAccept,
  onReject,
}) => {
  const timeSavedSeconds = currentRoute.durationSeconds - newQigaRoute.durationSeconds;
  const timeSavedMins = Math.round(timeSavedSeconds / 60);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onReject}
      title="Traffic Incident Ahead — Faster Route Available"
      maxWidth="md"
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-3 bg-amber-950/40 border border-amber-800/60 rounded-xl text-amber-200 text-xs">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-100">Live Congestion Surge Detected</p>
            <p className="mt-0.5 opacity-90 leading-relaxed">
              QIGA backend detected a road incident on your current trajectory. An authoritative re-optimization calculated a faster bypass.
            </p>
          </div>
        </div>

        {/* Route Comparison Card */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          {/* Current Route */}
          <div className="p-3 bg-surface-950/80 border border-surface-800 rounded-xl space-y-1.5 opacity-80">
            <span className="text-[10px] text-surface-400 font-medium block">Current Route (Delayed)</span>
            <p className="font-semibold text-surface-200">{formatDuration(currentRoute.durationSeconds)}</p>
            <p className="text-[11px] text-surface-400">{formatDistance(currentRoute.distanceMeters)}</p>
          </div>

          {/* New QIGA Route */}
          <div className="p-3 bg-brand-950/30 border border-brand-500/40 rounded-xl space-y-1.5 ring-1 ring-brand-500/20">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-brand-300 font-medium">New QIGA Route</span>
              <Badge variant="brand" size="sm">
                Save {timeSavedMins > 0 ? `${timeSavedMins}m` : '4m'}
              </Badge>
            </div>
            <p className="font-semibold text-brand-200">{formatDuration(newQigaRoute.durationSeconds)}</p>
            <p className="text-[11px] text-brand-300/80">{formatDistance(newQigaRoute.distanceMeters)}</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button variant="ghost" size="sm" onClick={onReject}>
            Keep Current Route
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={onAccept}
            leftIcon={<Sparkles className="w-4 h-4 text-surface-950" />}
          >
            Switch to Optimized Route
          </Button>
        </div>
      </div>
    </Modal>
  );
};
