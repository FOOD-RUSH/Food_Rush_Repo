import React, { useEffect, ReactNode } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Appearance } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { AppDispatch, RootState } from '@/store/store';
import { loadTheme, selectThemeMode, selectThemeLoading, getActualTheme } from '@/store/slices/themeSlice';
import { lightTheme, darkTheme } from '@/config/theme';

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const themeMode = useSelector((state: RootState) => selectThemeMode(state));
  const isLoading = useSelector((state: RootState) => selectThemeLoading(state));

  // Load theme on app start
  useEffect(() => {
    dispatch(loadTheme());
  }, [dispatch]);

  // Listen to system theme changes
  useEffect(() => {
    const subscription = Appearance.addChangeListener(() => {
      // Force re-render when system theme changes and mode is 'system'
      if (themeMode === 'system') {
        // Component will re-render automatically due to getActualTheme
      }
    });

    return () => subscription?.remove();
  }, [themeMode]);

  // Don't render until theme is loaded
  if (isLoading) {
    return null; // Or a loading component
  }

  const actualTheme = getActualTheme(themeMode);
  const currentTheme = actualTheme === 'dark' ? darkTheme : lightTheme;

  return (
    <PaperProvider theme={currentTheme}>
      <StatusBar style={actualTheme === 'dark' ? 'light' : 'dark'} />
      {children}
    </PaperProvider>
  );
};