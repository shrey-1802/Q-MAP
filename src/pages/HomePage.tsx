import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { RoutePlannerForm } from '@/features/route-planning/components/RoutePlannerForm';
import { MapView } from '@/components/map/MapView';
import { OptimizationProgressView } from '@/features/optimization/components/OptimizationProgressView';
import { ConvergenceChart } from '@/features/optimization/components/ConvergenceChart';
import { RouteResultCard } from '@/features/route-results/components/RouteResultCard';
import { RouteComparisonMatrix } from '@/features/route-results/components/RouteComparisonMatrix';
import { NavigationView } from '@/features/navigation/components/NavigationView';
import { useOptimizationJob } from '@/features/optimization/hooks/useOptimizationJob';
import { optimizationService } from '@/services/api/optimizationService';
import type { LocationPoint, RouteOptimizationRequest, RouteOption } from '@/types';
import { Card, Button, Alert, Tabs } from '@/components/ui';
import { Sparkles, Map as MapIcon, Sliders, ArrowLeft, RefreshCw, BarChart2 } from 'lucide-react';

export const HomePage: React.FC = () => {
  const routerLocation = useLocation();

  // Route Waypoints State
  const [origin, setOrigin] = useState<LocationPoint | null>(
    routerLocation.state?.origin || {
      address: 'Salesforce Tower, Mission St, San Francisco, CA',
      latitude: 37.7897,
      longitude: -122.3972,
    }
  );
  const [destination, setDestination] = useState<LocationPoint | null>(
    routerLocation.state?.destination || {
      address: 'San Francisco International Airport (SFO), CA',
      latitude: 37.6213,
      longitude: -122.3790,
    }
  );
  const [stops, setStops] = useState<LocationPoint[]>([]);

  // Optimization & Results State
  const [activeRequestId, setActiveRequestId] = useState<string | null>(null);
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [activeTab, setActiveTab] = useState<'routes' | 'matrix' | 'convergence'>('routes');

  // Hook for live QIGA polling and SSE progress
  const { data: optimizationResult, isLoading: isOptimizing, error: optimizationError, cancelJob } =
    useOptimizationJob(activeRequestId);

  const handleStartOptimization = async (request: RouteOptimizationRequest) => {
    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      const response = await optimizationService.submitOptimization(request);
      setActiveRequestId(response.requestId);
    } catch (err: any) {
      setSubmissionError(err.message || 'Failed to submit route optimization.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Extract all generated routes
  const recommendedRoute = optimizationResult?.recommendedRoute;
  const alternativeRoutes = optimizationResult?.alternativeRoutes || [];
  const allRoutes: RouteOption[] = recommendedRoute
    ? [recommendedRoute, ...alternativeRoutes]
    : [];

  // Default select recommended route when ready
  useEffect(() => {
    if (recommendedRoute && !selectedRouteId) {
      setSelectedRouteId(recommendedRoute.id);
    }
  }, [recommendedRoute, selectedRouteId]);

  const activeSelectedRoute = allRoutes.find((r) => r.id === selectedRouteId) || recommendedRoute;

  // Render Fullscreen Live Navigation View if active
  if (isNavigating && activeSelectedRoute && origin && destination) {
    return (
      <div className="p-2 sm:p-4 max-w-7xl mx-auto w-full">
        <NavigationView
          route={activeSelectedRoute}
          origin={origin}
          destination={destination}
          onExit={() => setIsNavigating(false)}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col lg:flex-row w-full h-[calc(100vh-3.5rem)] overflow-hidden">
      {/* Left Control Panel: Route Planner & Telemetry */}
      <div className="w-full lg:w-[480px] xl:w-[520px] h-full overflow-y-auto p-4 border-r border-surface-800 bg-surface-950 flex flex-col gap-4 text-left">
        {/* If Not Optimized Yet: Show Route Form */}
        {!activeRequestId || (!optimizationResult && isOptimizing) ? (
          <div className="space-y-4">
            <div>
              <h1 className="text-xl font-bold text-surface-100 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-brand-400" />
                <span>Quantum Route Planner</span>
              </h1>
              <p className="text-xs text-surface-400 mt-0.5">
                Configure waypoints, vehicle constraints, and Pareto multi-objective weights.
              </p>
            </div>

            {submissionError && (
              <Alert variant="error" title="Submission Failed">
                {submissionError}
              </Alert>
            )}

            {isOptimizing && (
              <OptimizationProgressView
                response={optimizationResult}
                onCancel={() => {
                  cancelJob();
                  setActiveRequestId(null);
                }}
              />
            )}

            {!isOptimizing && (
              <RoutePlannerForm
                initialOrigin={origin}
                initialDestination={destination}
                onOriginChange={setOrigin}
                onDestinationChange={setDestination}
                onStopsChange={setStops}
                onSubmit={handleStartOptimization}
                isLoading={isSubmitting}
              />
            )}
          </div>
        ) : (
          /* When Optimization is in Progress or Finalized: Show Live Results Panel */
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setActiveRequestId(null);
                  setSelectedRouteId(null);
                }}
                leftIcon={<ArrowLeft className="w-4 h-4" />}
                className="text-xs text-surface-300 -ml-2"
              >
                Modify Parameters
              </Button>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  if (origin && destination) {
                    handleStartOptimization({
                      origin,
                      destination,
                      stops,
                      vehicle: { type: 'FOUR_WHEELER' },
                      objective: 'BALANCED',
                    });
                  }
                }}
                leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
                className="text-xs"
              >
                Re-Optimize
              </Button>
            </div>

            {/* Live Telemetry Progress when running */}
            {isOptimizing && (
              <OptimizationProgressView
                response={optimizationResult}
                onCancel={() => {
                  cancelJob();
                  setActiveRequestId(null);
                }}
              />
            )}

            {/* Final Optimization Results View */}
            {optimizationResult?.status === 'COMPLETED' && (
              <div className="space-y-4 animate-fadeIn">
                <Tabs
                  tabs={[
                    { id: 'routes', label: 'Route Options', badge: allRoutes.length },
                    { id: 'matrix', label: 'Benchmark Matrix' },
                    { id: 'convergence', label: 'QIGA Fitness' },
                  ]}
                  activeTab={activeTab}
                  onChange={(tab) => setActiveTab(tab as any)}
                />

                {activeTab === 'routes' && (
                  <div className="space-y-3">
                    {allRoutes.map((route) => (
                      <RouteResultCard
                        key={route.id}
                        route={route}
                        isSelected={selectedRouteId === route.id || (!selectedRouteId && route.rank === 1)}
                        onSelect={() => setSelectedRouteId(route.id)}
                        onStartNavigation={() => setIsNavigating(true)}
                      />
                    ))}
                  </div>
                )}

                {activeTab === 'matrix' && (
                  <RouteComparisonMatrix
                    routes={allRoutes}
                    selectedRouteId={selectedRouteId || recommendedRoute?.id}
                    onSelectRoute={setSelectedRouteId}
                  />
                )}

                {activeTab === 'convergence' && (
                  <ConvergenceChart data={optimizationResult.convergenceHistory} />
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right GIS Leaflet Map View */}
      <div className="flex-1 h-full min-h-[350px] relative bg-surface-950">
        <MapView
          origin={origin}
          destination={destination}
          stops={stops}
          routes={allRoutes}
          selectedRouteId={selectedRouteId || recommendedRoute?.id}
          className="h-full w-full"
        />
      </div>
    </div>
  );
};
