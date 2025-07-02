
import { useFonts } from '@expo-google-fonts/inter';
import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { fontConfig } from 'react-native-paper/lib/typescript/styles/fonts';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeState {
  mode: ThemeMode;
  isLoading: boolean;
}
export const lightTheme = {
  ...MD3LightTheme,

  colors: {
    ...MD3LightTheme.colors,
    primary: '#007aff', // Blue from Cameroon flag
    secondary: '#facc15', // Yellow from Cameroon flag
    tertiary: '#22c55e', // Green representing nature
    surface: '#ffffff',
    surfaceVariant: '#f8fafc',
    background: '#ffffff',
    error: '#ef4444',
    errorContainer: '#fef2f2',
    onPrimary: '#ffffff',
    onSecondary: '#000000',
    onSurface: '#1e293b',
    onBackground: '#1e293b',
    outline: '#cbd5e1',
  },
  dark: false
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#0ea5e9',
    secondary: '#facc15',
    tertiary: '#22c55e',
    surface: '#1e293b',
    surfaceVariant: '#334155',
    background: '#0f172a',
    error: '#ef4444',
    errorContainer: '#7f1d1d',
    onPrimary: '#ffffff',
    onSecondary: '#000000',
    onSurface: '#f1f5f9',
    onBackground: '#f1f5f9',
    outline: '#64748b',
  },
  dark: true
};
