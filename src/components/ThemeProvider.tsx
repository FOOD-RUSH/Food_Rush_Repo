import React, { ReactNode } from 'react';
import { PaperProvider } from 'react-native-paper';
import { useAppTheme } from '@/src/config/theme';
import { useAppStore } from '@/src/stores/customerStores/AppStore';

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const themeMode = useAppStore((state) => state.theme);

  // Use the unified theme hook that handles system mode
  const selectedTheme = useAppTheme(themeMode);

  // Only re-render when theme actually changes
  return <PaperProvider theme={selectedTheme}>{children}</PaperProvider>;
};
