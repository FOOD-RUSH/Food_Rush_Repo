import { MD3LightTheme, MD3DarkTheme, MD3Theme } from 'react-native-paper';
import { DefaultTheme, DarkTheme, Theme as NavigationTheme } from '@react-navigation/native';

// Restaurant theme colors - Food delivery inspired palette
const COLORS = {
  // Primary brand colors - Orange/Red gradient for food delivery
  PRIMARY: '#FF6B35', // Vibrant orange
  PRIMARY_DARK: '#E55A2B', // Darker orange
  SECONDARY: '#FFD23F', // Golden yellow
  SECONDARY_DARK: '#F4C430', // Darker yellow
  
  // Accent colors
  SUCCESS: '#00C851', // Green for success states
  WARNING: '#FF8800', // Orange for warnings
  ERROR: '#FF4444', // Red for errors
  INFO: '#33B5E5', // Blue for info
  
  // Neutral colors
  BACKGROUND_LIGHT: '#FAFAFA',
  BACKGROUND_DARK: '#1A1A1A',
  SURFACE_LIGHT: '#FFFFFF',
  SURFACE_DARK: '#2D2D2D',
  TEXT_LIGHT: '#2C2C2C',
  TEXT_DARK: '#FFFFFF',
  TEXT_SECONDARY_LIGHT: '#666666',
  TEXT_SECONDARY_DARK: '#CCCCCC',
  
  // Border and divider colors
  BORDER_LIGHT: '#E0E0E0',
  BORDER_DARK: '#404040',
  
  // Gradient colors for buttons and headers
  GRADIENT_START: '#FF6B35',
  GRADIENT_END: '#F7931E',
  GRADIENT_DARK_START: '#E55A2B',
  GRADIENT_DARK_END: '#D84315',
} as const;

export const restaurantLightTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: COLORS.PRIMARY,
    secondary: COLORS.SECONDARY,
    tertiary: COLORS.SUCCESS,
    surface: COLORS.SURFACE_LIGHT,
    surfaceVariant: COLORS.BACKGROUND_LIGHT,
    background: COLORS.BACKGROUND_LIGHT,
    error: COLORS.ERROR,
    errorContainer: '#fef2f2',
    onPrimary: COLORS.TEXT_DARK,
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
    surfaceVariant: '#3A3A3A',
    background: COLORS.BACKGROUND_DARK,
    error: COLORS.ERROR,
    errorContainer: '#7f1d1d',
    onPrimary: COLORS.TEXT_DARK,
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


