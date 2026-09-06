import { apiClient } from './apiClient';
import { env } from '@/config/env';
import { mockHistoryItems, mockAnalyticsSummary, mockPlaces } from '../adapters/mockAdapter';
import type { RouteHistoryItem, AnalyticsSummary, LocationPoint } from '@/types';

export const historyService = {
  async getHistory(page = 1, limit = 10): Promise<{ items: RouteHistoryItem[]; total: number; page: number }> {
    if (env.VITE_ENABLE_DEMO_MODE) {
      return {
        items: mockHistoryItems,
        total: mockHistoryItems.length,
        page,
      };
    }
    const response = await apiClient.get<{ items: RouteHistoryItem[]; total: number; page: number }>('/api/v1/routes/history', {
      params: { page, limit },
    });
    return response.data;
  },

  async deleteHistoryItem(id: string): Promise<void> {
    if (env.VITE_ENABLE_DEMO_MODE) {
      const idx = mockHistoryItems.findIndex((i) => i.id === id);
      if (idx !== -1) mockHistoryItems.splice(idx, 1);
      return;
    }
    await apiClient.delete(`/api/v1/routes/${id}`);
  },
};

export const analyticsService = {
  async getSummary(): Promise<AnalyticsSummary> {
    if (env.VITE_ENABLE_DEMO_MODE) {
      return mockAnalyticsSummary;
    }
    const response = await apiClient.get<AnalyticsSummary>('/api/v1/analytics');
    return response.data;
  },

  async getBenchmarkData(): Promise<any> {
    if (env.VITE_ENABLE_DEMO_MODE) {
      return [
        { algorithm: 'QIGA (Proposed)', runtimeMs: 384, travelTimeMin: 28, distanceKm: 23.4, fitness: 96.2, feasibilityRate: 98.4 },
        { algorithm: 'Genetic Algorithm', runtimeMs: 820, travelTimeMin: 33, distanceKm: 25.1, fitness: 88.4, feasibilityRate: 92.1 },
        { algorithm: 'A* Algorithm', runtimeMs: 145, travelTimeMin: 38, distanceKm: 21.9, fitness: 81.2, feasibilityRate: 85.0 },
        { algorithm: 'Dijkstra', runtimeMs: 410, travelTimeMin: 41, distanceKm: 22.8, fitness: 76.5, feasibilityRate: 82.3 },
      ];
    }
    const response = await apiClient.get('/api/v1/analytics/benchmark');
    return response.data;
  },
};

export const geocodingService = {
  async searchPlaces(query: string, signal?: AbortSignal): Promise<LocationPoint[]> {
    if (!query || query.trim().length < 2) return [];

    if (env.VITE_ENABLE_DEMO_MODE) {
      const normalized = query.toLowerCase();
      const matches = mockPlaces.filter((p) => p.address.toLowerCase().includes(normalized));
      if (matches.length > 0) return matches;

      // Fallback synthetic location for any custom address entered in demo
      return [
        {
          id: `custom_${Date.now()}`,
          address: `${query.trim()}, CA, USA`,
          latitude: 37.7749 + (Math.random() * 0.08 - 0.04),
          longitude: -122.4194 + (Math.random() * 0.08 - 0.04),
        },
      ];
    }

    const response = await apiClient.get<LocationPoint[]>('/api/v1/gis/geocode', {
      params: { query },
      signal,
    });
    return response.data;
  },

  async reverseGeocode(lat: number, lng: number): Promise<LocationPoint> {
    if (env.VITE_ENABLE_DEMO_MODE) {
      return {
        id: `rev_${lat.toFixed(4)}_${lng.toFixed(4)}`,
        address: `Custom Location Pin (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
        latitude: lat,
        longitude: lng,
      };
    }

    const response = await apiClient.get<LocationPoint>('/api/v1/gis/reverse-geocode', {
      params: { lat, lng },
    });
    return response.data;
  },
};
