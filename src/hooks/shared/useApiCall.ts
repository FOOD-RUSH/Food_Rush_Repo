import { useState, useCallback, useRef, useEffect } from 'react';
import { ApiError } from '../../services/shared/apiClient';
import Toast from 'react-native-toast-message';

interface UseApiOptions {
  showToast?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: ApiError) => void;
}

interface UseApiReturn<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
  execute: (...args: any[]) => Promise<T | null>;
  reset: () => void;
}

export function useApi<T = any>(
  apiFunction: (...args: any[]) => Promise<T>,
  options: UseApiOptions = {}
): UseApiReturn<T> {
  const { showToast = true, onSuccess, onError } = options;
  
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const execute = useCallback(async (...args: any[]): Promise<T | null> => {
    if (!isMounted.current) return null;

    setLoading(true);
    setError(null);

    try {
      const result = await apiFunction(...args);
      
      if (isMounted.current) {
        setData(result);
        onSuccess?.(result);
      }
      
      return result;
    } catch (err) {
      const apiError = err as ApiError;
      
      if (isMounted.current) {
        setError(apiError);
        onError?.(apiError);
        
        if (showToast) {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: apiError.message,
            visibilityTime: 4000,
          });
        }
      }
      
      return null;
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [apiFunction, showToast, onSuccess, onError]);

  const reset = useCallback(() => {
    if (isMounted.current) {
      setData(null);
      setError(null);
      setLoading(false);
    }
  }, []);

  return { data, loading, error, execute, reset };
}
