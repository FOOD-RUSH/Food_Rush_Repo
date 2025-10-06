import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

type I18nMetrics = {
  translationCount: number;
  slowTranslations: number;
  missingKeys: Set<string>;
  averageTime: number;
};

/**
 * Hook to monitor i18n performance in development
 * Helps identify slow translation lookups and missing keys
 */
export const useI18nPerformance = () => {
  const { i18n } = useTranslation();
  const metricsRef = useRef<I18nMetrics>({
    translationCount: 0,
    slowTranslations: 0,
    missingKeys: new Set<string>(),
    averageTime: 0,
  });

  useEffect(() => {
    const isDev = (globalThis as any).__DEV__ === true;
    if (!isDev) return;

    const getNow = () => {
      const perf = (globalThis as any).performance;
      return perf && typeof perf.now === 'function' ? perf.now() : Date.now();
    };

    const anyI18n = i18n as any;
    const originalT = anyI18n.t.bind(i18n) as typeof i18n.t;

    // Wrap the translation function to measure performance
    anyI18n.t = ((key: any, options?: any) => {
      const startTime = getNow();
      const result = originalT(key as any, options as any) as any;
      const endTime = getNow();
      const duration = endTime - startTime;

      // Update metrics
      const metrics = metricsRef.current;
      metrics.translationCount++;
      metrics.averageTime =
        (metrics.averageTime * (metrics.translationCount - 1) + duration) /
        metrics.translationCount;

      // Track slow translations (>1ms)
      if (duration > 1) {
        metrics.slowTranslations++;
      }

      // Track missing keys
      if (result === key && typeof key === 'string') {
        metrics.missingKeys.add(key);
      }

      return result;
    }) as typeof i18n.t;

    // Log performance summary every 100 translations
    const logInterval = setInterval(() => {
      const metrics = metricsRef.current;
      if (
        metrics.translationCount > 0 &&
        metrics.translationCount % 100 === 0
      ) {
      }
    }, 5000);

    return () => {
      clearInterval(logInterval as any);
      // Restore original function
      anyI18n.t = originalT;
    };
  }, [i18n]);

  return (globalThis as any).__DEV__ ? metricsRef.current : null;
};
