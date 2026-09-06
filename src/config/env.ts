/**
 * Robust Frontend Environment Validator
 * Never throws at runtime to prevent white screen crashes.
 */
export interface AppConfig {
  VITE_API_BASE_URL: string;
  VITE_APP_ENV: 'development' | 'staging' | 'production';
  VITE_MAP_PROVIDER: 'osm' | 'carto_dark' | 'carto_light' | 'custom';
  VITE_MAP_TILE_URL: string;
  VITE_ENABLE_DEMO_MODE: boolean;
  VITE_REALTIME_TRANSPORT: 'sse' | 'ws' | 'polling';
  VITE_APP_NAME: string;
}

const getEnv = (): AppConfig => {
  const metaEnv = (import.meta as any).env || {};

  return {
    VITE_API_BASE_URL: metaEnv.VITE_API_BASE_URL || 'http://localhost:8000',
    VITE_APP_ENV: (metaEnv.VITE_APP_ENV as any) || 'development',
    VITE_MAP_PROVIDER: (metaEnv.VITE_MAP_PROVIDER as any) || 'carto_dark',
    VITE_MAP_TILE_URL:
      metaEnv.VITE_MAP_TILE_URL ||
      'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    VITE_ENABLE_DEMO_MODE: metaEnv.VITE_ENABLE_DEMO_MODE === 'false' ? false : true, // Default to true in dev for instant operational testing
    VITE_REALTIME_TRANSPORT: (metaEnv.VITE_REALTIME_TRANSPORT as any) || 'polling',
    VITE_APP_NAME: metaEnv.VITE_APP_NAME || 'Q-MAP Intelligent Route Optimization',
  };
};

export const env = getEnv();
