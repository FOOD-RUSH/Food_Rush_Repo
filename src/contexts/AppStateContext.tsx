import React, {
  createContext,
  useContext,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useAppStore } from '@/src/stores/AppStore';

interface AppStateContextType {
  appState: AppStateStatus;
  isAppActive: boolean;
  isAppInBackground: boolean;
  lastActiveTime: number;
  onAppStateChange: (nextAppState: AppStateStatus) => void;
}

const AppStateContext = createContext<AppStateContextType | undefined>(
  undefined,
);

interface AppStateProviderProps {
  children: React.ReactNode;
}

export const AppStateProvider: React.FC<AppStateProviderProps> = ({
  children,
}) => {
  const { updateLastActive } = useAppStore();
  const appStateRef = useRef(AppState.currentState);
  const lastActiveTimeRef = useRef(Date.now());

  // Memoized app state values to prevent unnecessary re-renders
  const appStateValues = useMemo(() => {
    const currentState = appStateRef.current;
    return {
      appState: currentState,
      isAppActive: currentState === 'active',
      isAppInBackground: currentState === 'background',
      lastActiveTime: lastActiveTimeRef.current,
    };
  }, []);

  // Optimized app state change handler
  const handleAppStateChange = useCallback(
    (nextAppState: AppStateStatus) => {
      const previousState = appStateRef.current;
      appStateRef.current = nextAppState;

      // Only update store when app becomes active
      if (previousState !== 'active' && nextAppState === 'active') {
        const now = Date.now();
        lastActiveTimeRef.current = now;
        updateLastActive();
      }

      // Handle app state transitions
      if (nextAppState === 'background') {
        // App went to background - save any pending data
        console.log('App went to background');
      } else if (nextAppState === 'active') {
        // App became active - refresh data if needed
        console.log('App became active');
      }
    },
    [updateLastActive],
  );

  // Set up app state listener
  React.useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );
    return () => subscription?.remove();
  }, [handleAppStateChange]);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo<AppStateContextType>(
    () => ({
      ...appStateValues,
      onAppStateChange: handleAppStateChange,
    }),
    [appStateValues, handleAppStateChange],
  );

  return (
    <AppStateContext.Provider value={contextValue}>
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = (): AppStateContextType => {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};

// Optimized hook for components that only need to know if app is active
export const useIsAppActive = (): boolean => {
  const { isAppActive } = useAppState();
  return isAppActive;
};

// Optimized hook for components that only need to know if app is in background
export const useIsAppInBackground = (): boolean => {
  const { isAppInBackground } = useAppState();
  return isAppInBackground;
};

export default AppStateContext;
