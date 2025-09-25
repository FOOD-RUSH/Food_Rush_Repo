import { useState, useEffect } from 'react';
import { Dimensions, ScaledSize } from 'react-native';

interface ScreenData {
  width: number;
  height: number;
  scale: number;
  fontScale: number;
}

interface ResponsiveBreakpoints {
  xs: boolean;
  sm: boolean;
  md: boolean;
  lg: boolean;
  xl: boolean;
}

interface ResponsiveUtils {
  screen: ScreenData;
  breakpoints: ResponsiveBreakpoints;
  isSmallScreen: boolean;
  isMediumScreen: boolean;
  isLargeScreen: boolean;
  isTablet: boolean;
  isPhone: boolean;
  orientation: 'portrait' | 'landscape';
  wp: (percentage: number) => number;
  hp: (percentage: number) => number;
  moderateScale: (size: number, factor?: number) => number;
  responsiveSize: (size: number) => number;
  getResponsiveText: (baseSize: number) => number;
  getResponsiveSpacing: (size: number) => number;
  scale: (size: number) => number;
}

const BREAKPOINTS = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const;

export const useResponsive = (): ResponsiveUtils => {
  const [screenData, setScreenData] = useState<ScreenData>(() => {
    const { width, height, scale, fontScale } = Dimensions.get('window');
    return {
      width: width || 375, // fallback to iPhone X width
      height: height || 812, // fallback to iPhone X height
      scale: scale || 2,
      fontScale: fontScale || 1,
    };
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener(
      'change',
      ({ window }: { window: ScaledSize }) => {
        setScreenData({
          width: window.width || 375,
          height: window.height || 812,
          scale: window.scale || 2,
          fontScale: window.fontScale || 1,
        });
      },
    );

    return () => subscription?.remove();
  }, []);

  const { width, height } = screenData;

  // Calculate breakpoints
  const breakpoints: ResponsiveBreakpoints = {
    xs: width >= BREAKPOINTS.xs,
    sm: width >= BREAKPOINTS.sm,
    md: width >= BREAKPOINTS.md,
    lg: width >= BREAKPOINTS.lg,
    xl: width >= BREAKPOINTS.xl,
  };

  // Device type detection
  const isSmallScreen = width < BREAKPOINTS.sm;
  const isMediumScreen = width >= BREAKPOINTS.sm && width < BREAKPOINTS.lg;
  const isLargeScreen = width >= BREAKPOINTS.lg;
  const isTablet = width >= BREAKPOINTS.md;
  const isPhone = width < BREAKPOINTS.md;
  const orientation = width > height ? 'landscape' : 'portrait';

  // Responsive utility functions
  const wp = (percentage: number): number => {
    return (width * percentage) / 100;
  };

  const hp = (percentage: number): number => {
    return (height * percentage) / 100;
  };

  const moderateScale = (size: number, factor: number = 0.5): number => {
    return size + (screenData.scale - 2) * factor;
  };

  const responsiveSize = (size: number): number => {
    if (isSmallScreen) return size * 0.9;
    if (isMediumScreen) return size;
    if (isLargeScreen) return size * 1.1;
    return size;
  };

  const getResponsiveText = (baseSize: number): number => {
    const scaleFactor = Math.min(screenData.fontScale, 1.3); // Cap at 1.3x

    if (isSmallScreen) {
      return Math.round(baseSize * 0.9 * scaleFactor);
    } else if (isLargeScreen) {
      return Math.round(baseSize * 1.1 * scaleFactor);
    }

    return Math.round(baseSize * scaleFactor);
  };

  const getResponsiveSpacing = (size: number): number => {
    if (isSmallScreen) return size * 0.9;
    if (isMediumScreen) return size;
    if (isLargeScreen) return size * 1.1;
    return size;
  };

  // Scale function for responsive sizing
  const scale = (size: number): number => {
    const baseWidth = 375; // iPhone X width as base
    const scaleFactor = width / baseWidth;
    return Math.round(size * scaleFactor);
  };

  return {
    screen: screenData,
    breakpoints,
    isSmallScreen,
    isMediumScreen,
    isLargeScreen,
    isTablet,
    isPhone,
    orientation,
    wp,
    hp,
    moderateScale,
    responsiveSize,
    getResponsiveText,
    getResponsiveSpacing,
    scale,
  };
};

// Hook for responsive font sizes
export const useResponsiveFontSize = () => {
  const { getResponsiveText, isSmallScreen, isLargeScreen } = useResponsive();

  return {
    xs: getResponsiveText(12),
    sm: getResponsiveText(14),
    base: getResponsiveText(16),
    lg: getResponsiveText(18),
    xl: getResponsiveText(20),
    '2xl': getResponsiveText(24),
    '3xl': getResponsiveText(30),
    '4xl': getResponsiveText(36),
    '5xl': getResponsiveText(48),
    '6xl': getResponsiveText(60),
    getSize: getResponsiveText,
    isSmallScreen,
    isLargeScreen,
  };
};

// Hook for responsive spacing
export const useResponsiveSpacing = () => {
  const { responsiveSize, wp, hp, isSmallScreen, isLargeScreen } =
    useResponsive();

  return {
    xs: responsiveSize(4),
    sm: responsiveSize(8),
    md: responsiveSize(16),
    lg: responsiveSize(24),
    xl: responsiveSize(32),
    '2xl': responsiveSize(48),
    '3xl': responsiveSize(64),
    wp,
    hp,
    getSize: responsiveSize,
    isSmallScreen,
    isLargeScreen,
  };
};
