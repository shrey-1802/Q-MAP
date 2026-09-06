import type {
  RouteOptimizationRequest,
  QIGAOptimizationResponse,
  RouteOption,
  ConvergencePoint,
  RouteHistoryItem,
  AnalyticsSummary,
} from '@/types';

/**
 * Isolated Mock Adapter for offline/testing/demo environments.
 * Simulates authoritative backend response progression without placing mock logic inside UI components.
 */

export const mockPlaces = [
  { id: 'loc_1', address: 'San Francisco International Airport (SFO), CA', latitude: 37.6213, longitude: -122.3790 },
  { id: 'loc_2', address: 'Salesforce Tower, Mission St, San Francisco, CA', latitude: 37.7897, longitude: -122.3972 },
  { id: 'loc_3', address: 'Golden Gate Bridge Vista Point, Sausalito, CA', latitude: 37.8324, longitude: -122.4795 },
  { id: 'loc_4', address: 'Stanford University, Palo Alto, CA', latitude: 37.4275, longitude: -122.1697 },
  { id: 'loc_5', address: 'Apple Park, Cupertino, CA', latitude: 37.3346, longitude: -122.0090 },
  { id: 'loc_6', address: 'Berkeley Marina, University Ave, Berkeley, CA', latitude: 37.8661, longitude: -122.3114 },
  { id: 'loc_7', address: 'Fisherman\'s Wharf, San Francisco, CA', latitude: 37.8080, longitude: -122.4177 },
];

export function createMockConvergenceData(): ConvergencePoint[] {
  const points: ConvergencePoint[] = [];
  let best = 0.42;
  let avg = 0.25;

  for (let i = 1; i <= 25; i++) {
    best += (0.94 - best) * 0.14 + (Math.random() * 0.015 - 0.005);
    avg += (0.86 - avg) * 0.12 + (Math.random() * 0.02 - 0.01);
    points.push({
      iteration: i,
      bestFitness: Math.min(0.965, Number(best.toFixed(4))),
      averageFitness: Math.min(best, Number(avg.toFixed(4))),
      diversityIndex: Number((1.0 - (i / 25) * 0.75).toFixed(3)),
    });
  }
  return points;
}

export function generateMockOptimizationResult(
  requestId: string,
  request: RouteOptimizationRequest
): QIGAOptimizationResponse {
  const originLat = request.origin.latitude || 37.7897;
  const originLng = request.origin.longitude || -122.3972;
  const destLat = request.destination.latitude || 37.6213;
  const destLng = request.destination.longitude || -122.3790;

  // Generate realistic route polylines between origin and destination
  const qigaCoords: [number, number][] = [
    [originLat, originLng],
    [originLat + (destLat - originLat) * 0.25 + 0.005, originLng + (destLng - originLng) * 0.2 - 0.01],
    [originLat + (destLat - originLat) * 0.5 - 0.004, originLng + (destLng - originLng) * 0.55 + 0.008],
    [originLat + (destLat - originLat) * 0.78 + 0.002, originLng + (destLng - originLng) * 0.8 - 0.005],
    [destLat, destLng],
  ];

  const alt1Coords: [number, number][] = [
    [originLat, originLng],
    [originLat + (destLat - originLat) * 0.3 - 0.012, originLng + (destLng - originLng) * 0.28 + 0.015],
    [originLat + (destLat - originLat) * 0.65 - 0.015, originLng + (destLng - originLng) * 0.7 + 0.01],
    [destLat, destLng],
  ];

  const alt2Coords: [number, number][] = [
    [originLat, originLng],
    [originLat + (destLat - originLat) * 0.4 + 0.018, originLng + (destLng - originLng) * 0.35 - 0.02],
    [originLat + (destLat - originLat) * 0.7 + 0.012, originLng + (destLng - originLng) * 0.65 - 0.018],
    [destLat, destLng],
  ];

  const recommendedRoute: RouteOption = {
    id: `route_qiga_${requestId.slice(0, 8)}`,
    rank: 1,
    name: 'Quantum-Optimized Primary Vector',
    algorithm: 'QIGA',
    isFallback: false,
    coordinates: qigaCoords,
    durationSeconds: 1680, // 28 mins
    distanceMeters: 23400, // 23.4 km
    fitnessScore: 0.962,
    fuelLiters: 1.85,
    co2EmissionsKg: 4.25,
    estimatedCostUsd: 6.4,
    congestionIndex: 0.18,
    feasible: true,
    explanation: [
      'Quantum interference eliminated high-risk bottleneck on arterial junctions',
      'Dynamic multi-objective balancing reduced overall fuel consumption by 14.8%',
      'Vehicle turn-radius and height constraints fully satisfied along entire trajectory',
    ],
    segments: [
      {
        instruction: 'Head south toward Main Arterial Expressway',
        distanceMeters: 1200,
        durationSeconds: 120,
        startLocation: qigaCoords[0]!,
        endLocation: qigaCoords[1]!,
      },
      {
        instruction: 'Merge onto Quantum Transit Corridor (Fast Lane)',
        distanceMeters: 14500,
        durationSeconds: 980,
        startLocation: qigaCoords[1]!,
        endLocation: qigaCoords[3]!,
      },
      {
        instruction: 'Take Exit 42B toward destination terminal',
        distanceMeters: 7700,
        durationSeconds: 580,
        startLocation: qigaCoords[3]!,
        endLocation: qigaCoords[4]!,
      },
    ],
  };

  const altRoute1: RouteOption = {
    id: `route_alt1_${requestId.slice(0, 8)}`,
    rank: 2,
    name: 'Classical Genetic Algorithm Path',
    algorithm: 'GENETIC_ALGORITHM',
    isFallback: false,
    coordinates: alt1Coords,
    durationSeconds: 1980, // 33 mins
    distanceMeters: 25100, // 25.1 km
    fitnessScore: 0.884,
    fuelLiters: 2.15,
    co2EmissionsKg: 4.95,
    estimatedCostUsd: 7.45,
    congestionIndex: 0.35,
    feasible: true,
    explanation: [
      'Standard genetic mutation converged to local optimum with moderate congestion',
      'Passes through 2 toll zones',
    ],
    segments: [],
  };

  const altRoute2: RouteOption = {
    id: `route_alt2_${requestId.slice(0, 8)}`,
    rank: 3,
    name: "Classical A* Shortest Distance",
    algorithm: 'FALLBACK_ASTAR',
    isFallback: true,
    coordinates: alt2Coords,
    durationSeconds: 2280, // 38 mins
    distanceMeters: 21900, // 21.9 km
    fitnessScore: 0.812,
    fuelLiters: 2.45,
    co2EmissionsKg: 5.65,
    estimatedCostUsd: 8.5,
    congestionIndex: 0.58,
    feasible: true,
    explanation: [
      'Shortest geographical distance but experiences heavy traffic and signal delays',
      'High idle stop time',
    ],
    segments: [],
  };

  return {
    requestId,
    status: 'COMPLETED',
    progressPercent: 100,
    currentStageMessage: 'Authoritative QIGA optimization completed successfully.',
    algorithm: 'QIGA',
    recommendedRoute,
    alternativeRoutes: [altRoute1, altRoute2],
    convergenceHistory: createMockConvergenceData(),
    runtimeMs: 384,
    iterationsCompleted: 25,
    maxIterations: 25,
    populationSize: 50,
    feasibleSolutionCount: 48,
    createdAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
  };
}

export const mockHistoryItems: RouteHistoryItem[] = [
  {
    id: 'hist_001',
    timestamp: new Date(Date.now() - 3600 * 1000 * 3).toISOString(),
    origin: { address: 'Salesforce Tower, San Francisco, CA', latitude: 37.7897, longitude: -122.3972 },
    destination: { address: 'San Francisco International Airport (SFO)', latitude: 37.6213, longitude: -122.3790 },
    stopCount: 1,
    vehicleType: 'FOUR_WHEELER',
    algorithm: 'QIGA',
    durationSeconds: 1680,
    distanceMeters: 23400,
    co2SavedKg: 1.4,
    status: 'COMPLETED',
  },
  {
    id: 'hist_002',
    timestamp: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
    origin: { address: 'Stanford University, Palo Alto, CA', latitude: 37.4275, longitude: -122.1697 },
    destination: { address: 'Apple Park, Cupertino, CA', latitude: 37.3346, longitude: -122.0090 },
    stopCount: 0,
    vehicleType: 'TWO_WHEELER',
    algorithm: 'QIGA',
    durationSeconds: 1140,
    distanceMeters: 16800,
    co2SavedKg: 0.9,
    status: 'COMPLETED',
  },
  {
    id: 'hist_003',
    timestamp: new Date(Date.now() - 3600 * 1000 * 48).toISOString(),
    origin: { address: 'Berkeley Marina, Berkeley, CA', latitude: 37.8661, longitude: -122.3114 },
    destination: { address: 'Fisherman\'s Wharf, San Francisco, CA', latitude: 37.8080, longitude: -122.4177 },
    stopCount: 2,
    vehicleType: 'HEAVY_LOAD',
    algorithm: 'FALLBACK_ASTAR',
    durationSeconds: 2520,
    distanceMeters: 29400,
    co2SavedKg: 0.3,
    status: 'COMPLETED',
  },
];

export const mockAnalyticsSummary: AnalyticsSummary = {
  totalTrips: 142,
  totalDistanceKm: 3482.6,
  timeSavedMinutes: 1240,
  fuelSavedLiters: 184.2,
  co2ReductionKg: 423.8,
  costSavedUsd: 638.5,
  averageQigaRuntimeMs: 342,
  qigaFeasibilityRate: 0.984,
  qigaConvergenceRate: 0.962,
};
