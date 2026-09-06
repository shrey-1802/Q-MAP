import { useState, useEffect, useRef } from 'react';
import { optimizationService } from '@/services/api/optimizationService';
import type { QIGAOptimizationResponse } from '@/types';

export function useOptimizationJob(requestId: string | null) {
  const [data, setData] = useState<QIGAOptimizationResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!requestId) {
      setData(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    let isSubscribed = true;
    setIsLoading(true);
    setError(null);

    const poll = async () => {
      try {
        const response = await optimizationService.getOptimizationStatus(requestId);
        if (!isSubscribed) return;

        setData(response);

        if (response.status === 'COMPLETED' || response.status === 'FAILED') {
          setIsLoading(false);
          if (response.status === 'FAILED') {
            setError(response.errorMessage || 'Optimization failed in QIGA computation node.');
          }
        } else {
          // Poll again in 600ms
          timerRef.current = setTimeout(poll, 600);
        }
      } catch (err: any) {
        if (!isSubscribed) return;
        setIsLoading(false);
        setError(err.message || 'Failed to fetch optimization job status.');
      }
    };

    poll();

    return () => {
      isSubscribed = false;
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [requestId]);

  const cancelJob = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setIsLoading(false);
  };

  return { data, isLoading, error, cancelJob };
}
