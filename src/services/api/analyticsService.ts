import { apiClient } from './apiClient';
import { env } from '@/config/env';
import { mockAnalyticsSummary } from '../adapters/mockAdapter';
import type { AnalyticsSummary } from '@/types';

export const analyticsService = {
  async getSummary(): Promise<AnalyticsSummary> {
    if (env.VITE_ENABLE_DEMO_MODE) {
      return mockAnalyticsSummary;
    }
    const response = await apiClient.get<AnalyticsSummary>('/api/v1/analytics');
    return response.data;
  },

  async getBenchmarkData(): Promise<any[]> {
    if (env.VITE_ENABLE_DEMO_MODE) {
      return [
        { algorithm: 'QIGA (Proposed)', runtimeMs: 384, travelTimeMin: 28, distanceKm: 23.4, fitness: 96.2, feasibilityRate: 98.4 },
        { algorithm: 'Genetic Algorithm', runtimeMs: 820, travelTimeMin: 33, distanceKm: 25.1, fitness: 88.4, feasibilityRate: 92.1 },
        { algorithm: 'A* Algorithm', runtimeMs: 145, travelTimeMin: 38, distanceKm: 21.9, fitness: 81.2, feasibilityRate: 85.0 },
        { algorithm: 'Dijkstra', runtimeMs: 410, travelTimeMin: 41, distanceKm: 22.8, fitness: 76.5, feasibilityRate: 82.3 },
      ];
    }
    const response = await apiClient.get<any[]>('/api/v1/analytics/benchmark');
    return response.data;
  },
};
