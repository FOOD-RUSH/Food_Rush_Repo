import React, { memo, useMemo } from 'react';
import { I18nextProvider } from 'react-i18next';
import { QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

import { queryClient } from '@/src/services/queryClient';
import { ThemeProvider } from '@/src/components/ThemeProvider';
import { NetworkProvider } from '@/src/contexts/NetworkContext';
import { LanguageProvider } from '@/src/contexts/LanguageContext';
import { BottomSheetProvider } from '@/src/components/common/BottomSheet/BottomSheetContext';
import { AppStateProvider } from '@/src/contexts/AppStateContext';
import { PerformanceProvider } from '@/src/contexts/PerformanceContext';
import i18n from '@/src/locales/i18n';

interface AppContextProviderProps {
  children: React.ReactNode;
}

/**
 * Core Infrastructure Providers
 * These providers handle fundamental app infrastructure and rarely change
 */
const CoreInfrastructureProviders = memo<AppContextProviderProps>(
  ({ children }) => {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <QueryClientProvider client={queryClient}>
            <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
          </QueryClientProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    );
  },
);

CoreInfrastructureProviders.displayName = 'CoreInfrastructureProviders';

/**
 * App State Providers
 * These providers handle app-level state that may change during runtime
 */
const AppStateProviders = memo<AppContextProviderProps>(({ children }) => {
  return (
    <AppStateProvider>
      <PerformanceProvider>
        <LanguageProvider>
          <ThemeProvider>
            <NetworkProvider>{children}</NetworkProvider>
          </ThemeProvider>
        </LanguageProvider>
      </PerformanceProvider>
    </AppStateProvider>
  );
});

AppStateProviders.displayName = 'AppStateProviders';

/**
 * UI Providers
 * These providers handle UI-specific functionality
 */
const UIProviders = memo<AppContextProviderProps>(({ children }) => {
  return (
    <BottomSheetModalProvider>
      <BottomSheetProvider>{children}</BottomSheetProvider>
    </BottomSheetModalProvider>
  );
});

UIProviders.displayName = 'UIProviders';

/**
 * Main App Context Provider
 * Combines all providers in an optimized hierarchy
 */
export const AppContextProvider: React.FC<AppContextProviderProps> = memo(
  ({ children }) => {
    // Memoize the provider tree to prevent unnecessary re-renders
    const providerTree = useMemo(
      () => (
        <CoreInfrastructureProviders>
          <AppStateProviders>
            <UIProviders>{children}</UIProviders>
          </AppStateProviders>
        </CoreInfrastructureProviders>
      ),
      [children],
    );

    return providerTree;
  },
);

AppContextProvider.displayName = 'AppContextProvider';

export default AppContextProvider;
