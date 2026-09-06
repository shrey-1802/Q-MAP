import React, { useState, useEffect } from 'react';
import type { RouteOption, LocationPoint } from '@/types';
import { MapView } from '@/components/map/MapView';
import { DynamicReRouteModal } from './DynamicReRouteModal';
import { Card, Button, Badge } from '@/components/ui';
import { formatDistance, formatDuration, formatEta } from '@/utils/formatters';
import { ArrowUpRight, Navigation, X, AlertTriangle, ShieldCheck, Volume2, Sparkles } from 'lucide-react';

export interface NavigationViewProps {
  route: RouteOption;
  origin: LocationPoint;
  destination: LocationPoint;
  onExit: () => void;
}

export const NavigationView: React.FC<NavigationViewProps> = ({
  route,
  origin,
  destination,
  onExit,
}) => {
  const [currentRoute, setCurrentRoute] = useState<RouteOption>(route);
  const [progressMeters, setProgressMeters] = useState(0);
  const [showReRouteModal, setShowReRouteModal] = useState(false);
  const [hasIncidentTriggered, setHasIncidentTriggered] = useState(false);

  // Simulated alternate bypass route for incident demo
  const alternativeBypassRoute: RouteOption = {
    ...currentRoute,
    id: 'route_bypass_qiga',
    name: 'Quantum Dynamic Bypass Vector',
    durationSeconds: Math.max(600, currentRoute.durationSeconds - 240),
    distanceMeters: currentRoute.distanceMeters - 1200,
    fitnessScore: 0.978,
  };

  // Simulate vehicle traveling along route
  useEffect(() => {
    const interval = setInterval(() => {
      setProgressMeters((prev) => {
        const next = prev + 150;
        // Trigger simulated traffic incident after 10 seconds if not triggered
        if (next > 800 && !hasIncidentTriggered) {
          setHasIncidentTriggered(true);
          setShowReRouteModal(true);
        }
        return next < currentRoute.distanceMeters ? next : currentRoute.distanceMeters;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentRoute, hasIncidentTriggered]);

  const remainingMeters = Math.max(0, currentRoute.distanceMeters - progressMeters);
  const remainingSeconds = Math.round(
    (remainingMeters / currentRoute.distanceMeters) * currentRoute.durationSeconds
  );

  const handleAcceptReRoute = () => {
    setCurrentRoute(alternativeBypassRoute);
    setShowReRouteModal(false);
  };

  return (
    <div className="relative w-full h-[calc(100vh-5rem)] rounded-2xl overflow-hidden flex flex-col bg-surface-950">
      {/* Top Turn-by-Turn Maneuver Overlay */}
      <div className="absolute top-4 left-4 right-4 z-20 max-w-lg mx-auto">
        <Card variant="glass" className="border-brand-500/40 shadow-2xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand-500 text-surface-950 flex items-center justify-center font-bold shadow-lg shrink-0">
            <ArrowUpRight className="w-7 h-7 stroke-[2.5]" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-brand-400">In 400 meters</span>
              <Badge variant="quantum" size="sm">
                Q-Navigation
              </Badge>
            </div>
            <h3 className="text-sm font-bold text-surface-100 truncate mt-0.5">
              Turn right onto Quantum Express Corridor
            </h3>
            <p className="text-[11px] text-surface-400 truncate">Then continue straight for 14.5 km</p>
          </div>

          <Button variant="ghost" size="icon" onClick={onExit} aria-label="Exit Navigation">
            <X className="w-5 h-5 text-surface-400 hover:text-surface-100" />
          </Button>
        </Card>
      </div>

      {/* Main Fullscreen GIS Map */}
      <div className="flex-1 w-full h-full">
        <MapView
          origin={origin}
          destination={destination}
          routes={[currentRoute]}
          selectedRouteId={currentRoute.id}
          className="h-full w-full"
        />
      </div>

      {/* Bottom Live Telemetry Dashboard */}
      <div className="absolute bottom-4 left-4 right-4 z-20 max-w-xl mx-auto">
        <Card variant="glass" className="border-surface-700 shadow-2xl p-4">
          <div className="flex items-center justify-between pb-3 border-b border-surface-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-brand-300 font-mono">
                  {formatEta(remainingSeconds)}
                </span>
                <span className="text-xs text-surface-400">ETA</span>
              </div>
              <p className="text-xs text-surface-300 mt-0.5">
                {formatDuration(remainingSeconds)} remaining • {formatDistance(remainingMeters)}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowReRouteModal(true)}
                leftIcon={<Sparkles className="w-3.5 h-3.5 text-brand-400" />}
                className="text-xs"
              >
                Simulate Incident
              </Button>
              <Button variant="danger" size="sm" onClick={onExit} className="text-xs">
                End Trip
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2.5 text-xs text-surface-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> QIGA Authoritative Guidance
            </span>
            <span className="font-mono text-quantum-300">Target: {destination.address.slice(0, 24)}...</span>
          </div>
        </Card>
      </div>

      {/* Dynamic Re-Routing Modal */}
      <DynamicReRouteModal
        isOpen={showReRouteModal}
        currentRoute={currentRoute}
        newQigaRoute={alternativeBypassRoute}
        onAccept={handleAcceptReRoute}
        onReject={() => setShowReRouteModal(false)}
      />
    </div>
  );
};
