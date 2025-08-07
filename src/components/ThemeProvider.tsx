import React, { ReactNode, useMemo } from 'react';
import { PaperProvider } from 'react-native-paper';
import { lightTheme, darkTheme } from '@/src/config/theme';
import { useAppStore } from '@/src/stores/AppStore';

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const theme = useAppStore((state) => state.theme);

  const paperTheme = useMemo(
    () => (theme === 'light' ? lightTheme : darkTheme),
    [theme],
  );

  return <PaperProvider theme={paperTheme}>{children}</PaperProvider>;
};
