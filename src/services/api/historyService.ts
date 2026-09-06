import { apiClient } from './apiClient';
import { env } from '@/config/env';
import { mockHistoryItems } from '../adapters/mockAdapter';
import type { RouteHistoryItem } from '@/types';

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
