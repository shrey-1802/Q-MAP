/**
 * QIGA Domain Models & Type Definitions
 */

export type VehicleType = 'TWO_WHEELER' | 'FOUR_WHEELER' | 'HEAVY_LOAD' | 'WALKING';

export type OptimizationObjective =
  | 'BALANCED'
  | 'FASTEST'
  | 'SHORTEST'
  | 'FUEL_EFFICIENT'
  | 'LOW_CONGESTION'
  | 'ECO';

export interface LocationPoint {
  id?: string;
  latitude: number;
  longitude: number;
  address: string;
  placeId?: string;
  label?: string;
}

export interface OptimizationWeights {
  time?: number;
  distance?: number;
  congestion?: number;
  fuel?: number;
  risk?: number;
  emissions?: number;
}

export interface VehicleConstraints {
  type: VehicleType;
  maxWeightKg?: number;
  maxHeightMeters?: number;
  maxWidthMeters?: number;
  isElectric?: boolean;
}

export interface RouteOptimizationRequest {
  origin: LocationPoint;
  destination: LocationPoint;
  stops: LocationPoint[];
  vehicle: VehicleConstraints;
  objective: OptimizationObjective;
  weights?: OptimizationWeights;
  avoidTolls?: boolean;
  avoidHighways?: boolean;
}

export type OptimizationAlgorithm = 'QIGA' | 'FALLBACK_ASTAR' | 'FALLBACK_DIJKSTRA' | 'GENETIC_ALGORITHM';

export type JobStatus =
  | 'QUEUED'
  | 'PREPARING_ROAD_NETWORK'
  | 'LOADING_TRAFFIC'
  | 'APPLYING_CONSTRAINTS'
  | 'INITIALIZING_QIGA'
  | 'EVALUATING_CANDIDATES'
  | 'UPDATING_POPULATION'
  | 'CHECKING_CONVERGENCE'
  | 'SELECTING_BEST_ROUTE'
  | 'COMPLETED'
  | 'FAILED';

export interface ConvergencePoint {
  iteration: number;
  bestFitness: number;
  averageFitness?: number;
  diversityIndex?: number;
}

export interface RouteSegment {
  instruction: string;
  distanceMeters: number;
  durationSeconds: number;
  startLocation: [number, number];
  endLocation: [number, number];
  polyline?: [number, number][];
}

export interface RouteOption {
  id: string;
  rank: number; // 1 = Recommended, 2+ = Alternatives
  name: string;
  algorithm: OptimizationAlgorithm;
  isFallback: boolean;
  coordinates: [number, number][]; // [lat, lng] array
  durationSeconds: number;
  distanceMeters: number;
  fitnessScore: number;
  fuelLiters?: number;
  co2EmissionsKg?: number;
  estimatedCostUsd?: number;
  congestionIndex?: number; // 0.0 - 1.0
  feasible: boolean;
  explanation: string[];
  segments: RouteSegment[];
}

export interface QIGAOptimizationResponse {
  requestId: string;
  status: JobStatus;
  progressPercent: number; // 0 - 100
  currentStageMessage: string;
  algorithm: OptimizationAlgorithm;
  recommendedRoute?: RouteOption;
  alternativeRoutes?: RouteOption[];
  convergenceHistory?: ConvergencePoint[];
  runtimeMs?: number;
  iterationsCompleted?: number;
  maxIterations?: number;
  populationSize?: number;
  feasibleSolutionCount?: number;
  errorMessage?: string;
  createdAt: string;
  completedAt?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'USER' | 'FLEET_MANAGER' | 'ADMIN';
  defaultVehicle: VehicleType;
  preferredObjective: OptimizationObjective;
  units: 'METRIC' | 'IMPERIAL';
  language: 'en' | 'hi' | 'gu';
}

export interface AuthSession {
  user: UserProfile | null;
  isAuthenticated: boolean;
  token?: string;
  expiresAt?: string;
}

export interface RouteHistoryItem {
  id: string;
  timestamp: string;
  origin: LocationPoint;
  destination: LocationPoint;
  stopCount: number;
  vehicleType: VehicleType;
  algorithm: OptimizationAlgorithm;
  durationSeconds: number;
  distanceMeters: number;
  co2SavedKg?: number;
  status: 'COMPLETED' | 'CANCELLED' | 'IN_PROGRESS';
}

export interface AnalyticsSummary {
  totalTrips: number;
  totalDistanceKm: number;
  timeSavedMinutes: number;
  fuelSavedLiters: number;
  co2ReductionKg: number;
  costSavedUsd: number;
  averageQigaRuntimeMs: number;
  qigaFeasibilityRate: number;
  qigaConvergenceRate: number;
}
