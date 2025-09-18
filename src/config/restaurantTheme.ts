import { MD3LightTheme, MD3DarkTheme, MD3Theme } from 'react-native-paper';
import {
  DefaultTheme,
  DarkTheme,
  Theme as NavigationTheme,
} from '@react-navigation/native';

// Restaurant theme colors - Enhanced color palette centered around #007aff
const COLORS = {
  // Primary brand colors - All variations of #007aff with better harmony
  PRIMARY: '#007aff',
  PRIMARY_LIGHT: '#3395FF', // More vibrant lighter shade
  PRIMARY_DARK: '#0056CC', // Darker shade for depth
  PRIMARY_VARIANT: '#1A85FF', // Slightly lighter variant for variety

  // Secondary colors - Complementary warm tones
  SECONDARY: '#FF6B35', // Vibrant orange that complements blue
  SECONDARY_LIGHT: '#FF8A5B', // Lighter orange
  SECONDARY_DARK: '#E55A2B', // Darker orange

  // Accent colors that create beautiful harmony with #007aff
  SUCCESS: '#00D084', // Modern green with blue undertones
  SUCCESS_LIGHT: '#26E69A', // Lighter success green
  WARNING: '#FF9500', // Apple-style orange
  WARNING_LIGHT: '#FFB340', // Lighter warning
  ERROR: '#FF3B30', // Apple-style red
  ERROR_LIGHT: '#FF6B6B', // Lighter error
  INFO: '#007aff', // Use primary blue for info

  // Neutral colors with blue undertones for cohesion
  BACKGROUND_LIGHT: '#F8FAFF', // Very light blue-tinted white
  BACKGROUND_DARK: '#0A1628', // Deep blue-black
  SURFACE_LIGHT: '#FFFFFF',
  SURFACE_DARK: '#1A2332', // Dark blue-gray
  SURFACE_VARIANT_LIGHT: '#F1F5FF', // Light blue-tinted surface
  SURFACE_VARIANT_DARK: '#2A3441', // Medium blue-gray

  // Text colors with improved contrast
  TEXT_LIGHT: '#1A2332', // Dark blue-gray for light backgrounds
  TEXT_DARK: '#F8FAFF', // Light blue-white for dark backgrounds
  TEXT_SECONDARY_LIGHT: '#5A6B7D', // Medium blue-gray
  TEXT_SECONDARY_DARK: '#9BA8B7', // Light blue-gray
  TEXT_MUTED_LIGHT: '#8A9BA8', // Muted blue-gray
  TEXT_MUTED_DARK: '#6B7A87', // Darker muted

  // Border and divider colors with blue undertones
  BORDER_LIGHT: '#E1E8F0', // Light blue-gray border
  BORDER_DARK: '#3A4A5C', // Dark blue-gray border
  DIVIDER_LIGHT: '#F1F5FF', // Very light divider
  DIVIDER_DARK: '#2A3441', // Dark divider

  // Gradient colors - Multiple beautiful combinations
  GRADIENT_PRIMARY_START: '#007aff',
  GRADIENT_PRIMARY_END: '#3395FF',
  GRADIENT_SECONDARY_START: '#FF6B35',
  GRADIENT_SECONDARY_END: '#FF8A5B',
  GRADIENT_SUCCESS_START: '#00D084',
  GRADIENT_SUCCESS_END: '#26E69A',

  // Dark theme gradients
  GRADIENT_DARK_PRIMARY_START: '#0056CC',
  GRADIENT_DARK_PRIMARY_END: '#007aff',
  GRADIENT_DARK_SECONDARY_START: '#E55A2B',
  GRADIENT_DARK_SECONDARY_END: '#FF6B35',

  // Special UI colors
  CARD_SHADOW: 'rgba(0, 122, 255, 0.1)', // Blue-tinted shadow
  OVERLAY: 'rgba(0, 122, 255, 0.05)', // Light blue overlay
  OVERLAY_DARK: 'rgba(0, 122, 255, 0.15)', // Darker blue overlay

  // Status colors for orders, etc.
  STATUS_PENDING: '#FF9500', // Orange for pending
  STATUS_CONFIRMED: '#007aff', // Primary blue for confirmed
  STATUS_PREPARING: '#FF6B35', // Secondary orange for preparing
  STATUS_READY: '#00D084', // Green for ready
  STATUS_DELIVERED: '#00D084', // Green for delivered
  STATUS_CANCELLED: '#FF3B30', // Red for cancelled
} as const;

export const restaurantLightTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: COLORS.PRIMARY,
    primaryContainer: COLORS.PRIMARY_LIGHT + '20', // 20% opacity
    secondary: COLORS.SECONDARY,
    secondaryContainer: COLORS.SECONDARY_LIGHT + '20',
    tertiary: COLORS.SUCCESS,
    tertiaryContainer: COLORS.SUCCESS_LIGHT + '20',
    surface: COLORS.SURFACE_LIGHT,
    surfaceVariant: COLORS.SURFACE_VARIANT_LIGHT,
    surfaceDisabled: COLORS.BORDER_LIGHT,
    background: COLORS.BACKGROUND_LIGHT,
    error: COLORS.ERROR,
    errorContainer: COLORS.ERROR_LIGHT + '20',
    onPrimary: '#ffffff',
    onPrimaryContainer: COLORS.PRIMARY_DARK,
    onSecondary: '#ffffff',
    onSecondaryContainer: COLORS.SECONDARY_DARK,
    onTertiary: '#ffffff',
    onTertiaryContainer: COLORS.SUCCESS,
    onSurface: COLORS.TEXT_LIGHT,
    onSurfaceVariant: COLORS.TEXT_SECONDARY_LIGHT,
    onSurfaceDisabled: COLORS.TEXT_MUTED_LIGHT,
    onBackground: COLORS.TEXT_LIGHT,
    onError: '#ffffff',
    onErrorContainer: COLORS.ERROR,
    outline: COLORS.BORDER_LIGHT,
    outlineVariant: COLORS.DIVIDER_LIGHT,
    inverseSurface: COLORS.SURFACE_DARK,
    inverseOnSurface: COLORS.TEXT_DARK,
    inversePrimary: COLORS.PRIMARY_LIGHT,
    shadow: COLORS.CARD_SHADOW,
    scrim: COLORS.OVERLAY,
    backdrop: COLORS.OVERLAY_DARK,
  },
  dark: false,
};

export const restaurantDarkTheme: MD3Theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: COLORS.PRIMARY,
    primaryContainer: COLORS.PRIMARY_DARK,
    secondary: COLORS.SECONDARY,
    secondaryContainer: COLORS.SECONDARY_DARK,
    tertiary: COLORS.SUCCESS,
    tertiaryContainer: COLORS.SUCCESS + '40', // 40% opacity for dark theme
    surface: COLORS.SURFACE_DARK,
    surfaceVariant: COLORS.SURFACE_VARIANT_DARK,
    surfaceDisabled: COLORS.BORDER_DARK,
    background: COLORS.BACKGROUND_DARK,
    error: COLORS.ERROR,
    errorContainer: COLORS.ERROR + '40',
    onPrimary: '#ffffff',
    onPrimaryContainer: COLORS.PRIMARY_LIGHT,
    onSecondary: '#ffffff',
    onSecondaryContainer: COLORS.SECONDARY_LIGHT,
    onTertiary: '#ffffff',
    onTertiaryContainer: COLORS.SUCCESS_LIGHT,
    onSurface: COLORS.TEXT_DARK,
    onSurfaceVariant: COLORS.TEXT_SECONDARY_DARK,
    onSurfaceDisabled: COLORS.TEXT_MUTED_DARK,
    onBackground: COLORS.TEXT_DARK,
    onError: '#ffffff',
    onErrorContainer: COLORS.ERROR_LIGHT,
    outline: COLORS.BORDER_DARK,
    outlineVariant: COLORS.DIVIDER_DARK,
    inverseSurface: COLORS.SURFACE_LIGHT,
    inverseOnSurface: COLORS.TEXT_LIGHT,
    inversePrimary: COLORS.PRIMARY_DARK,
    shadow: 'rgba(0, 0, 0, 0.3)',
    scrim: 'rgba(0, 0, 0, 0.5)',
    backdrop: 'rgba(0, 0, 0, 0.7)',
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

// Export the enhanced color constants for use in components
export { COLORS as RESTAURANT_COLORS };

// Helper functions for color manipulation
export const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'pending':
      return COLORS.STATUS_PENDING;
    case 'confirmed':
      return COLORS.STATUS_CONFIRMED;
    case 'preparing':
      return COLORS.STATUS_PREPARING;
    case 'ready':
      return COLORS.STATUS_READY;
    case 'delivered':
      return COLORS.STATUS_DELIVERED;
    case 'cancelled':
      return COLORS.STATUS_CANCELLED;
    default:
      return COLORS.TEXT_SECONDARY_LIGHT;
  }
};

export const getPrimaryGradient = (isDark: boolean = false) => {
  return isDark
    ? [COLORS.GRADIENT_DARK_PRIMARY_START, COLORS.GRADIENT_DARK_PRIMARY_END]
    : [COLORS.GRADIENT_PRIMARY_START, COLORS.GRADIENT_PRIMARY_END];
};

export const getSecondaryGradient = (isDark: boolean = false) => {
  return isDark
    ? [COLORS.GRADIENT_DARK_SECONDARY_START, COLORS.GRADIENT_DARK_SECONDARY_END]
    : [COLORS.GRADIENT_SECONDARY_START, COLORS.GRADIENT_SECONDARY_END];
};

export const getSuccessGradient = () => {
  return [COLORS.GRADIENT_SUCCESS_START, COLORS.GRADIENT_SUCCESS_END];
};
