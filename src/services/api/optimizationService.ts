import { apiClient } from './apiClient';
import { env } from '@/config/env';
import { generateMockOptimizationResult } from '../adapters/mockAdapter';
import type { RouteOptimizationRequest, QIGAOptimizationResponse } from '@/types';

// In-memory demo store for simulated async polling when demo mode is active
const demoJobStore = new Map<string, { request: RouteOptimizationRequest; createdAt: number }>();

export const optimizationService = {
  /**
   * Submit route optimization request to the QIGA engine.
   */
  async submitOptimization(request: RouteOptimizationRequest): Promise<{ requestId: string; status: string }> {
    if (env.VITE_ENABLE_DEMO_MODE) {
      const requestId = `qiga_req_${Math.random().toString(36).substring(2, 11)}`;
      demoJobStore.set(requestId, { request, createdAt: Date.now() });
      return { requestId, status: 'QUEUED' };
    }

    const response = await apiClient.post<{ requestId: string; status: string }>('/api/v1/routes/optimize', request);
    return response.data;
  },

  /**
   * Get optimization progress & authoritative results by Request ID.
   */
  async getOptimizationStatus(requestId: string): Promise<QIGAOptimizationResponse> {
    if (env.VITE_ENABLE_DEMO_MODE) {
      const job = demoJobStore.get(requestId);
      const elapsed = job ? Date.now() - job.createdAt : 3000;

      // Simulate step-by-step progress stages
      if (elapsed < 600) {
        return {
          requestId,
          status: 'PREPARING_ROAD_NETWORK',
          progressPercent: 25,
          currentStageMessage: 'Connecting to OpenStreetMap road graph & topological matrix...',
          algorithm: 'QIGA',
          createdAt: new Date().toISOString(),
        };
      } else if (elapsed < 1200) {
        return {
          requestId,
          status: 'LOADING_TRAFFIC',
          progressPercent: 55,
          currentStageMessage: 'Overlaying real-time traffic congestion, bottlenecks & road restrictions...',
          algorithm: 'QIGA',
          createdAt: new Date().toISOString(),
        };
      } else if (elapsed < 1800) {
        return {
          requestId,
          status: 'EVALUATING_CANDIDATES',
          progressPercent: 80,
          currentStageMessage: 'QIGA quantum rotation gates updating qubit chromosome population...',
          algorithm: 'QIGA',
          createdAt: new Date().toISOString(),
        };
      } else {
        const dummyRequest: RouteOptimizationRequest = job?.request || {
          origin: { address: 'Salesforce Tower, San Francisco, CA', latitude: 37.7897, longitude: -122.3972 },
          destination: { address: 'San Francisco International Airport (SFO)', latitude: 37.6213, longitude: -122.3790 },
          stops: [],
          vehicle: { type: 'FOUR_WHEELER' },
          objective: 'BALANCED',
        };
        return await generateMockOptimizationResult(requestId, dummyRequest);
      }
    }

    const response = await apiClient.get<QIGAOptimizationResponse>(`/api/v1/optimization/${requestId}`);
    return response.data;
  },

  /**
   * Fetch single route details by route ID.
   */
  async getRouteById(routeId: string): Promise<QIGAOptimizationResponse> {
    if (env.VITE_ENABLE_DEMO_MODE) {
      const dummyRequest: RouteOptimizationRequest = {
        origin: { address: 'Salesforce Tower, San Francisco, CA', latitude: 37.7897, longitude: -122.3972 },
        destination: { address: 'SFO Airport, CA', latitude: 37.6213, longitude: -122.3790 },
        stops: [],
        vehicle: { type: 'FOUR_WHEELER' },
        objective: 'BALANCED',
      };
      return await generateMockOptimizationResult(routeId, dummyRequest);
    }

    const response = await apiClient.get<QIGAOptimizationResponse>(`/api/v1/routes/${routeId}`);
    return response.data;
  },
};
