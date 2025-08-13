import { MD3LightTheme, MD3DarkTheme, MD3Theme } from 'react-native-paper';
import { useColorScheme } from 'react-native';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeState {
  mode: ThemeMode;
  isLoading: boolean;
}

// Color constants for consistency
const COLORS = {
  PRIMARY: '#007aff',
  SECONDARY: '#facc15',
  TERTIARY_LIGHT: '#f3f4f6',
  TERTIARY_DARK: '#22c55e',
  ERROR: '#ef4444',
} as const;

export const lightTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: COLORS.PRIMARY,
    secondary: COLORS.SECONDARY,
    tertiary: COLORS.TERTIARY_LIGHT,
    surface: '#ffffff',
    surfaceVariant: '#f8fafc',
    background: '#ffffff',
    error: COLORS.ERROR,
    errorContainer: '#fef2f2',
    onPrimary: '#ffffff',
    onSecondary: '#000000',
    onSurface: '#1e293b',
    onBackground: '#1e293b',
    outline: '#cbd5e1',
    // Additional semantic colors
    onSurfaceVariant: '#64748b',
  },
  dark: false,
};

export const darkTheme: MD3Theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: COLORS.PRIMARY,
    secondary: COLORS.SECONDARY,
    tertiary: COLORS.TERTIARY_DARK,
    surface: '#1e293b',
    surfaceVariant: '#334155',
    background: '#0f172a',
    error: COLORS.ERROR,
    errorContainer: '#7f1d1d',
    onPrimary: '#ffffff',
    onSecondary: '#000000',
    onSurface: '#f1f5f9',
    onBackground: '#f1f5f9',
    outline: '#64748b',
    // Additional semantic colors
    onSurfaceVariant: '#94a3b8',
  },
  dark: true,
};

// Hook to get the appropriate theme based on user preference and system settings
export const useAppTheme = (themeMode: ThemeMode): MD3Theme => {
  const systemColorScheme = useColorScheme();
  
  if (themeMode === 'system') {
    return systemColorScheme === 'dark' ? darkTheme : lightTheme;
  }
  
  return themeMode === 'dark' ? darkTheme : lightTheme;
};

// Theme utilities
export const getThemeColors = (isDark: boolean) => {
  return isDark ? darkTheme.colors : lightTheme.colors;
};

export const isSystemDarkMode = () => {
  const systemColorScheme = useColorScheme();
  return systemColorScheme === 'dark';
};
