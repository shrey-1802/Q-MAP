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
      if (elapsed < 800) {
        return {
          requestId,
          status: 'PREPARING_ROAD_NETWORK',
          progressPercent: 20,
          currentStageMessage: 'Extracting road network graphs and topology...',
          algorithm: 'QIGA',
          createdAt: new Date().toISOString(),
        };
      } else if (elapsed < 1600) {
        return {
          requestId,
          status: 'LOADING_TRAFFIC',
          progressPercent: 45,
          currentStageMessage: 'Overlaying real-time traffic congestion & incident vectors...',
          algorithm: 'QIGA',
          createdAt: new Date().toISOString(),
        };
      } else if (elapsed < 2400) {
        return {
          requestId,
          status: 'EVALUATING_CANDIDATES',
          progressPercent: 75,
          currentStageMessage: 'QIGA quantum rotation gates updating qubit chromosome population...',
          algorithm: 'QIGA',
          createdAt: new Date().toISOString(),
        };
      } else {
        const dummyRequest: RouteOptimizationRequest = job?.request || {
          origin: { address: 'Origin', latitude: 37.7897, longitude: -122.3972 },
          destination: { address: 'Destination', latitude: 37.6213, longitude: -122.3790 },
          stops: [],
          vehicle: { type: 'FOUR_WHEELER' },
          objective: 'BALANCED',
        };
        return generateMockOptimizationResult(requestId, dummyRequest);
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
        origin: { address: 'San Francisco, CA', latitude: 37.7897, longitude: -122.3972 },
        destination: { address: 'SFO Airport, CA', latitude: 37.6213, longitude: -122.3790 },
        stops: [],
        vehicle: { type: 'FOUR_WHEELER' },
        objective: 'BALANCED',
      };
      return generateMockOptimizationResult(routeId, dummyRequest);
    }

    const response = await apiClient.get<QIGAOptimizationResponse>(`/api/v1/routes/${routeId}`);
    return response.data;
  },
};
