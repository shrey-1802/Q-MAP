import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { env } from '@/config/env';
import { useAuthStore } from '@/stores/authStore';

export interface ApiErrorPayload {
  status: number;
  code: string;
  message: string;
  details?: Record<string, unknown> | string[];
}

/**
 * Normalized application error object to eliminate raw network/Axios crashes in UI.
 */
export class AppApiError extends Error {
  public status: number;
  public code: string;
  public details?: Record<string, unknown> | string[];

  constructor(payload: ApiErrorPayload) {
    super(payload.message);
    this.name = 'AppApiError';
    this.status = payload.status;
    this.code = payload.code;
    this.details = payload.details;
  }
}

export const apiClient = axios.create({
  baseURL: env.VITE_API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request Interceptor: Attach Auth Token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().token;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Normalize Errors and handle 401 Expiry
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<any>) => {
    let normalizedError: ApiErrorPayload = {
      status: 500,
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred while communicating with the QIGA optimization engine.',
    };

    if (error.response) {
      const { status, data } = error.response;

      if (status === 401) {
        useAuthStore.getState().setSessionExpired(true);
        normalizedError = {
          status: 401,
          code: 'UNAUTHORIZED',
          message: 'Your session has expired. Please sign in again to continue.',
        };
      } else if (status === 403) {
        normalizedError = {
          status: 403,
          code: 'FORBIDDEN',
          message: 'You do not have permission to execute this operation.',
        };
      } else if (status === 404) {
        normalizedError = {
          status: 404,
          code: 'NOT_FOUND',
          message: data?.message || 'The requested route or resource was not found.',
        };
      } else if (status === 422 || status === 400) {
        normalizedError = {
          status,
          code: 'VALIDATION_ERROR',
          message: data?.message || 'The route parameters or vehicle constraints submitted are invalid.',
          details: data?.details || data?.errors,
        };
      } else if (status === 429) {
        normalizedError = {
          status: 429,
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many optimization requests. Please wait a moment before trying again.',
        };
      } else if (status >= 500) {
        normalizedError = {
          status,
          code: 'SERVER_ERROR',
          message: 'The QIGA optimization cluster is currently unavailable. Please try again shortly.',
        };
      }
    } else if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      normalizedError = {
        status: 408,
        code: 'TIMEOUT',
        message: 'The optimization request timed out. The road network computation took too long.',
      };
    } else if (!navigator.onLine || error.message.includes('Network Error')) {
      normalizedError = {
        status: 0,
        code: 'NETWORK_OFFLINE',
        message: 'Network connection lost. Please check your internet connection.',
      };
    }

    return Promise.reject(new AppApiError(normalizedError));
  }
);
