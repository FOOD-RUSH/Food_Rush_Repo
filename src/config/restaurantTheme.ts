import { MD3LightTheme, MD3DarkTheme, MD3Theme } from 'react-native-paper';
import { DefaultTheme, DarkTheme, Theme as NavigationTheme } from '@react-navigation/native';

// Restaurant theme colors - Centered around #007aff
const COLORS = {
  // Primary brand colors - All variations of #007aff
  PRIMARY: '#007aff', 
  PRIMARY_LIGHT: '#4DA3FF', // Lighter shade of #007aff
  PRIMARY_DARK: '#0056CC', // Darker shade of #007aff
  SECONDARY: '#FFD23F', // Golden yellow for contrast
  SECONDARY_DARK: '#F4C430', // Darker yellow
  
  // Accent colors that complement #007aff
  SUCCESS: '#00C851', // Green for success states
  WARNING: '#FF8800', // Orange for warnings
  ERROR: '#FF4444', // Red for errors
  INFO: '#007aff', // Use primary blue for info
  
  // Neutral colors
  BACKGROUND_LIGHT: '#FAFAFA',
  BACKGROUND_DARK: '#0f172a',
  SURFACE_LIGHT: '#FFFFFF',
  SURFACE_DARK: '#1e293b',
  TEXT_LIGHT: '#1e293b',
  TEXT_DARK: '#f1f5f9',
  TEXT_SECONDARY_LIGHT: '#64748b',
  TEXT_SECONDARY_DARK: '#94a3b8',
  
  // Border and divider colors
  BORDER_LIGHT: '#cbd5e1',
  BORDER_DARK: '#64748b',
  
  // Gradient colors based on #007aff
  GRADIENT_START: '#007aff',
  GRADIENT_END: '#4DA3FF',
  GRADIENT_DARK_START: '#0056CC',
  GRADIENT_DARK_END: '#007aff',
} as const;

export const restaurantLightTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: COLORS.PRIMARY,
    secondary: COLORS.SECONDARY,
    tertiary: COLORS.SUCCESS,
    surface: COLORS.SURFACE_LIGHT,
    surfaceVariant:'#f8fafc',
    background: COLORS.BACKGROUND_LIGHT,
    error: COLORS.ERROR,
    errorContainer: '#fef2f2',
    onPrimary: '#ffffff',
    onSecondary: COLORS.TEXT_LIGHT,
    onSurface: COLORS.TEXT_LIGHT,
    onBackground: COLORS.TEXT_LIGHT,
    outline: COLORS.BORDER_LIGHT,
    onSurfaceVariant: COLORS.TEXT_SECONDARY_LIGHT,
  },
  dark: false,
};

export const restaurantDarkTheme: MD3Theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: COLORS.PRIMARY,
    secondary: COLORS.SECONDARY,
    tertiary: COLORS.SUCCESS,
    surface: COLORS.SURFACE_DARK,
    surfaceVariant: '#334155',
    background: COLORS.BACKGROUND_DARK,
    error: COLORS.ERROR,
    errorContainer: '#7f1d1d',
    onPrimary: '#ffffff',
    onSecondary: COLORS.TEXT_LIGHT,
    onSurface: COLORS.TEXT_DARK,
    onBackground: COLORS.TEXT_DARK,
    outline: COLORS.BORDER_DARK,
    onSurfaceVariant: COLORS.TEXT_SECONDARY_DARK,
  },
  dark: true,
};

export const restaurantLightNavigationTheme: NavigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: COLORS.PRIMARY,
    background: COLORS.BACKGROUND_LIGHT,
    card: COLORS.SURFACE_LIGHT,
    text: COLORS.TEXT_LIGHT,
    border: COLORS.BORDER_LIGHT,
    notification: COLORS.ERROR,
  },
};

export const restaurantDarkNavigationTheme: NavigationTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: COLORS.PRIMARY,
    background: COLORS.BACKGROUND_DARK,
    card: COLORS.SURFACE_DARK,
    text: COLORS.TEXT_DARK,
    border: COLORS.BORDER_DARK,
    notification: COLORS.ERROR,
  },
};

// Export the color constants for use in components
export { COLORS as RESTAURANT_COLORS };


