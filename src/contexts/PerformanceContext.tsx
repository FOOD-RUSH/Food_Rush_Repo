import React, {
  createContext,
  useContext,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import { InteractionManager } from 'react-native';

interface PerformanceMetrics {
  renderCount: number;
  lastRenderTime: number;
  averageRenderTime: number;
  memoryWarnings: number;
}

interface PerformanceContextType {
  metrics: PerformanceMetrics;
  trackRender: (componentName: string) => void;
  trackInteraction: (interactionName: string) => Promise<void>;
  isInteractionComplete: boolean;
  runAfterInteractions: (callback: () => void) => void;
}

const PerformanceContext = createContext<PerformanceContextType | undefined>(
  undefined,
);

interface PerformanceProviderProps {
  children: React.ReactNode;
}

export const PerformanceProvider: React.FC<PerformanceProviderProps> = ({
  children,
}) => {
  const metricsRef = useRef<PerformanceMetrics>({
    renderCount: 0,
    lastRenderTime: 0,
    averageRenderTime: 0,
    memoryWarnings: 0,
  });

  const renderTimesRef = useRef<number[]>([]);
  const isInteractionCompleteRef = useRef(true);

  // Track component renders for performance monitoring
  const trackRender = useCallback((componentName: string) => {
    if (__DEV__) {
      const startTime = performance.now();

      // Update metrics
      metricsRef.current.renderCount += 1;
      metricsRef.current.lastRenderTime = startTime;

      // Calculate average render time
      renderTimesRef.current.push(startTime);
      if (renderTimesRef.current.length > 100) {
        renderTimesRef.current.shift(); // Keep only last 100 renders
      }

      const average =
        renderTimesRef.current.reduce((a, b) => a + b, 0) /
        renderTimesRef.current.length;
      metricsRef.current.averageRenderTime = average;

      console.log(`[Performance] ${componentName} rendered in ${startTime}ms`);
    }
  }, []);

  // Track user interactions for performance optimization
  const trackInteraction = useCallback(
    async (interactionName: string): Promise<void> => {
      if (__DEV__) {
        console.log(`[Performance] Starting interaction: ${interactionName}`);
      }

      isInteractionCompleteRef.current = false;

      return new Promise((resolve) => {
        InteractionManager.runAfterInteractions(() => {
          isInteractionCompleteRef.current = true;
          if (__DEV__) {
            console.log(
              `[Performance] Completed interaction: ${interactionName}`,
            );
          }
          resolve();
        });
      });
    },
    [],
  );

  // Run callback after all interactions are complete
  const runAfterInteractions = useCallback((callback: () => void) => {
    InteractionManager.runAfterInteractions(callback);
  }, []);

  // Memoized metrics to prevent unnecessary re-renders
  const currentMetrics = useMemo(() => metricsRef.current, []);

  // Memoize context value
  const contextValue = useMemo<PerformanceContextType>(
    () => ({
      metrics: currentMetrics,
      trackRender,
      trackInteraction,
      isInteractionComplete: isInteractionCompleteRef.current,
      runAfterInteractions,
    }),
    [currentMetrics, trackRender, trackInteraction, runAfterInteractions],
  );

  return (
    <PerformanceContext.Provider value={contextValue}>
      {children}
    </PerformanceContext.Provider>
  );
};

export const usePerformance = (): PerformanceContextType => {
  const context = useContext(PerformanceContext);
  if (context === undefined) {
    throw new Error('usePerformance must be used within a PerformanceProvider');
  }
  return context;
};

// Optimized hook for tracking component renders
export const useRenderTracker = (componentName: string) => {
  const { trackRender } = usePerformance();

  React.useEffect(() => {
    trackRender(componentName);
  });
};

// Optimized hook for running code after interactions
export const useAfterInteractions = (
  callback: () => void,
  deps: React.DependencyList,
) => {
  const { runAfterInteractions } = usePerformance();

  React.useEffect(() => {
    runAfterInteractions(callback);
  }, [callback, runAfterInteractions, deps]);
};

export default PerformanceContext;
