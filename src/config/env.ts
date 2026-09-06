import { z } from 'zod';

/**
 * Frontend environment schema validation.
 * Ensures critical configuration is present at boot time.
 */
const envSchema = z.object({
  VITE_API_BASE_URL: z.string().url().default('http://localhost:8000'),
  VITE_APP_ENV: z.enum(['development', 'staging', 'production']).default('development'),
  VITE_MAP_PROVIDER: z.enum(['osm', 'carto_dark', 'carto_light', 'custom']).default('carto_dark'),
  VITE_MAP_TILE_URL: z.string().default('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'),
  VITE_ENABLE_DEMO_MODE: z
    .string()
    .transform((val) => val === 'true')
    .default('false'),
  VITE_REALTIME_TRANSPORT: z.enum(['sse', 'ws', 'polling']).default('polling'),
  VITE_APP_NAME: z.string().default('Q-MAP Intelligent Route Optimization'),
});

const parseEnv = () => {
  const result = envSchema.safeParse(import.meta.env);

  if (!result.success) {
    console.error('❌ Invalid frontend environment configuration:', result.error.format());
    if (import.meta.env.MODE === 'production') {
      throw new Error('Fatal: Invalid environment configuration in production build.');
    }
  }

  return result.success
    ? result.data
    : {
        VITE_API_BASE_URL: 'http://localhost:8000',
        VITE_APP_ENV: 'development' as const,
        VITE_MAP_PROVIDER: 'carto_dark' as const,
        VITE_MAP_TILE_URL: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        VITE_ENABLE_DEMO_MODE: true,
        VITE_REALTIME_TRANSPORT: 'polling' as const,
        VITE_APP_NAME: 'Q-MAP Intelligent Route Optimization',
      };
};

export const env = parseEnv();
export type AppEnv = z.infer<typeof envSchema>;
