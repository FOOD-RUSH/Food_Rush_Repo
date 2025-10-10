import { MD3LightTheme, MD3DarkTheme, MD3Theme } from 'react-native-paper';
import { useColorScheme } from 'react-native';
import {
  DefaultTheme,
  DarkTheme,
  Theme as NavigationTheme,
} from '@react-navigation/native';
import { useAppStore } from '../stores/AppStore';
// Restaurant themes are available but not used in this file

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

// Futuristic Font Configuration using system fonts (ZERO bundle size)
export const FUTURISTIC_FONTS = {
  primary: {
    fontFamily: 'monospace', // System monospace font
    fontWeight: '400' as const,
  },
  secondary: {
    fontFamily: 'monospace',
    fontWeight: '400' as const,
  },
  accent: {
    fontFamily: 'monospace',
    fontWeight: '400' as const,
  },
  display: {
    fontFamily: 'monospace',
    fontWeight: '700' as const,
  },
  mono: {
    fontFamily: 'monospace',
    fontWeight: '400' as const,
  },
} as const;

// Font scale factors for different contexts
export const FONT_SCALES = {
  heading: 1.2,
  subheading: 1.1,
  body: 1.0,
  caption: 0.9,
  small: 0.8,
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

// React Navigation themes that perfectly match React Native Paper themes
export const lightNavigationTheme: NavigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: COLORS.PRIMARY,
    background: '#ffffff',
    card: '#ffffff',
    text: '#1e293b',
    border: '#cbd5e1',
    notification: COLORS.ERROR,
  },
};

export const darkNavigationTheme: NavigationTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: COLORS.PRIMARY,
    background: '#0f172a',
    card: '#1e293b',
    text: '#f1f5f9',
    border: '#64748b',
    notification: COLORS.ERROR,
  },
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

// Hook to get the appropriate navigation theme
export const useNavigationTheme = (themeMode: ThemeMode): NavigationTheme => {
  const systemColorScheme = useColorScheme();

  if (themeMode === 'system') {
    return systemColorScheme === 'dark'
      ? darkNavigationTheme
      : lightNavigationTheme;
  }

  return themeMode === 'dark' ? darkNavigationTheme : lightNavigationTheme;
};

// Hook that integrates with Zustand store
export const useAppNavigationTheme = (): NavigationTheme => {
  const themeMode = useAppStore((state) => state.theme) as ThemeMode;
  return useNavigationTheme(themeMode);
};

// Theme utilities
export const getThemeColors = (isDark: boolean) => {
  return isDark ? darkTheme.colors : lightTheme.colors;
};

// Custom hook to check if system is in dark mode
export const useIsSystemDarkMode = () => {
  const systemColorScheme = useColorScheme();
  return systemColorScheme === 'dark';
};

// Theme utilities

// Utility function that doesn't use hooks (for non-component usage)
export const getSystemColorScheme = () => {
  // This should be used only when you can't use the hook version
  // For most cases, use useIsSystemDarkMode instead
  return 'light'; // Default fallback
};
