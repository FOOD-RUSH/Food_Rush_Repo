import { Dimensions, PixelRatio, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Breakpoint definitions for consistent responsive behavior
export const breakpoints = {
  xs: 375,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

// Guideline sizes based on iPhone 6/7/8 dimensions
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

// Responsive scale functions
export const scale = (size: number): number => {
  const scaleFactor = SCREEN_WIDTH / guidelineBaseWidth;
  return Math.round(PixelRatio.roundToNearestPixel(size * scaleFactor));
};

export const verticalScale = (size: number): number => {
  const scaleFactor = SCREEN_HEIGHT / guidelineBaseHeight;
  return Math.round(PixelRatio.roundToNearestPixel(size * scaleFactor));
};

export const moderateScale = (size: number, factor = 0.5): number => {
  return size + (scale(size) - size) * factor;
};

// Device type detection
export const isSmallDevice = SCREEN_WIDTH < breakpoints.sm;
export const isMediumDevice = SCREEN_WIDTH >= breakpoints.sm && SCREEN_WIDTH < breakpoints.md;
export const isLargeDevice = SCREEN_WIDTH >= breakpoints.md;
export const isTablet = SCREEN_WIDTH >= breakpoints.lg;
export const isLandscape = SCREEN_WIDTH > SCREEN_HEIGHT;

// Touch target sizes (accessibility compliant)
export const touchTargets = {
  minSize: Platform.OS === 'ios' ? 44 : 48,
  preferredSize: isSmallDevice ? 44 : 48,
  largeSize: isSmallDevice ? 48 : 56,
};

// Spacing scale based on device size
export const getResponsiveSpacing = (baseSize: number) => {
  if (isSmallDevice) return baseSize * 0.8;
  if (isTablet) return baseSize * 1.2;
  return baseSize;
};

// Font size scaling
export const getResponsiveFontSize = (baseSize: number) => {
  const scaleFactor = Math.min(SCREEN_WIDTH / guidelineBaseWidth, SCREEN_HEIGHT / guidelineBaseHeight);
  return Math.round(PixelRatio.roundToNearestPixel(baseSize * scaleFactor));
};

// Container width calculations
export const getContainerWidth = (maxWidth?: number) => {
  const defaultMaxWidth = isTablet ? 800 : 375;
  const targetWidth = maxWidth || defaultMaxWidth;
  return Math.min(SCREEN_WIDTH - 32, targetWidth); // 32px for padding
};

// Grid calculations
export const getGridColumns = (preferredColumns: number) => {
  if (isSmallDevice) return 1;
  if (isTablet) return Math.min(preferredColumns, 3);
  return preferredColumns;
};

// Image size calculations
export const getResponsiveImageSize = (baseSize: number) => {
  const scaleFactor = SCREEN_WIDTH / guidelineBaseWidth;
  const scaledSize = baseSize * scaleFactor;
  return Math.min(scaledSize, baseSize * 1.5); // Cap at 150% of base size
};

// Safe area calculations
export const getSafeAreaInsets = () => {
  const topInset = Platform.OS === 'ios' ? (isSmallDevice ? 44 : 47) : 24;
  const bottomInset = Platform.OS === 'ios' ? (isSmallDevice ? 34 : 44) : 24;
  return { top: topInset, bottom: bottomInset };
};

// Performance optimized dimension updates
let currentDimensions = { width: SCREEN_WIDTH, height: SCREEN_HEIGHT };

export const updateDimensions = () => {
  const newDimensions = Dimensions.get('window');
  currentDimensions = newDimensions;
  return newDimensions;
};

export const getCurrentDimensions = () => currentDimensions;

// Utility for creating responsive style objects
export const createResponsiveStyle = <T extends Record<string, any>>(
  styles: T,
  responsiveOverrides?: Partial<Record<keyof typeof breakpoints, Partial<T>>>
): T => {
  if (!responsiveOverrides) return styles;

  const currentBreakpoint = Object.entries(breakpoints)
    .reverse()
    .find(([, width]) => SCREEN_WIDTH >= width)?.[0] as keyof typeof breakpoints;

  if (currentBreakpoint && responsiveOverrides[currentBreakpoint]) {
    return { ...styles, ...responsiveOverrides[currentBreakpoint] };
  }

  return styles;
};