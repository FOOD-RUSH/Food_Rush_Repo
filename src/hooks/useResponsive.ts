import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';
import {
  breakpoints,
  scale,
  verticalScale,
  moderateScale,
  isSmallDevice,
  isMediumDevice,
  isLargeDevice,
  isTablet,
  isLandscape,
  touchTargets,
  getResponsiveSpacing,
  getResponsiveFontSize,
  getContainerWidth,
  getGridColumns,
  getResponsiveImageSize,
  getSafeAreaInsets,
} from '@/src/utils/responsive';

export const useResponsive = () => {
  const { width, height } = useWindowDimensions();

  return useMemo(() => {
    // Device detection based on current dimensions
    const currentIsSmallDevice = width < breakpoints.sm;
    const currentIsMediumDevice = width >= breakpoints.sm && width < breakpoints.md;
    const currentIsLargeDevice = width >= breakpoints.md;
    const currentIsTablet = width >= breakpoints.lg;
    const currentIsLandscape = width > height;

    return {
      // Current dimensions
      width,
      height,

      // Device type detection
      isSmallDevice: currentIsSmallDevice,
      isMediumDevice: currentIsMediumDevice,
      isLargeDevice: currentIsLargeDevice,
      isTablet: currentIsTablet,
      isLandscape: currentIsLandscape,

      // Scaling functions
      scale: (size: number) => scale(size),
      verticalScale: (size: number) => verticalScale(size),
      moderateScale: (size: number, factor = 0.5) => moderateScale(size, factor),

      // Responsive utilities
      getResponsiveSpacing: (baseSize: number) => getResponsiveSpacing(baseSize),
      getResponsiveFontSize: (baseSize: number) => getResponsiveFontSize(baseSize),
      getContainerWidth: (maxWidth?: number) => getContainerWidth(maxWidth),
      getGridColumns: (preferredColumns: number) => getGridColumns(preferredColumns),
      getResponsiveImageSize: (baseSize: number) => getResponsiveImageSize(baseSize),
      getSafeAreaInsets: () => getSafeAreaInsets(),

      // Touch targets
      touchTargets,

      // Breakpoints for conditional styling
      breakpoints,

      // Convenience methods
      isBreakpoint: (breakpoint: keyof typeof breakpoints) => width >= breakpoints[breakpoint],
      getBreakpoint: () => {
        const entries = Object.entries(breakpoints).reverse();
        const current = entries.find(([, bpWidth]) => width >= bpWidth);
        return current ? current[0] as keyof typeof breakpoints : 'xs';
      },

      // Layout helpers
      getColumnWidth: (columns: number, spacing = 16) => {
        const totalSpacing = (columns - 1) * spacing;
        return (width - 32 - totalSpacing) / columns; // 32px for container padding
      },

      // Typography helpers
      getTypographyScale: () => ({
        xs: getResponsiveFontSize(12),
        sm: getResponsiveFontSize(14),
        base: getResponsiveFontSize(16),
        lg: getResponsiveFontSize(18),
        xl: getResponsiveFontSize(20),
        '2xl': getResponsiveFontSize(24),
        '3xl': getResponsiveFontSize(30),
        '4xl': getResponsiveFontSize(36),
      }),

      // Spacing helpers
      getSpacingScale: () => ({
        xs: getResponsiveSpacing(4),
        sm: getResponsiveSpacing(8),
        md: getResponsiveSpacing(16),
        lg: getResponsiveSpacing(24),
        xl: getResponsiveSpacing(32),
        '2xl': getResponsiveSpacing(48),
      }),
    };
  }, [width, height]);
};

// Specialized hooks for common use cases
export const useDeviceType = () => {
  const { isSmallDevice, isTablet, isLandscape } = useResponsive();
  return { isSmallDevice, isTablet, isLandscape };
};

export const useTypography = () => {
  const { getTypographyScale } = useResponsive();
  return getTypographyScale();
};

export const useSpacing = () => {
  const { getSpacingScale } = useResponsive();
  return getSpacingScale();
};

export const useLayout = () => {
  const { getContainerWidth, getGridColumns, getColumnWidth } = useResponsive();
  return { getContainerWidth, getGridColumns, getColumnWidth };
};