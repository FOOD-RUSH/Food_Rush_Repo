import { useWindowDimensions } from 'react-native';
import { useMemo } from 'react';

// Breakpoint definitions based on common device sizes
export const BREAKPOINTS = {
  xs: 0,     // Small phones (iPhone SE, small Android)
  sm: 576,   // Large phones (iPhone 12, Pixel)
  md: 768,   // Tablets (iPad Mini, small tablets)
  lg: 992,   // Large tablets (iPad Pro, large tablets)
  xl: 1200,  // Desktop/Large screens
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

// Hook to get current breakpoint
export const useBreakpoint = (): Breakpoint => {
  const { width } = useWindowDimensions();
  
  return useMemo(() => {
    if (width >= BREAKPOINTS.xl) return 'xl';
    if (width >= BREAKPOINTS.lg) return 'lg';
    if (width >= BREAKPOINTS.md) return 'md';
    if (width >= BREAKPOINTS.sm) return 'sm';
    return 'xs';
  }, [width]);
};

// Hook to check if current screen is at least a certain breakpoint
export const useBreakpointValue = <T>(values: Partial<Record<Breakpoint, T>>): T | undefined => {
  const breakpoint = useBreakpoint();
  
  return useMemo(() => {
    // Try current breakpoint first
    if (values[breakpoint] !== undefined) {
      return values[breakpoint];
    }
    
    // Fallback to smaller breakpoints
    const breakpointOrder: Breakpoint[] = ['xl', 'lg', 'md', 'sm', 'xs'];
    const currentIndex = breakpointOrder.indexOf(breakpoint);
    
    for (let i = currentIndex + 1; i < breakpointOrder.length; i++) {
      const fallbackBreakpoint = breakpointOrder[i];
      if (values[fallbackBreakpoint] !== undefined) {
        return values[fallbackBreakpoint];
      }
    }
    
    return undefined;
  }, [breakpoint, values]);
};

// Hook to get responsive dimensions
export const useResponsiveDimensions = () => {
  const { width, height } = useWindowDimensions();
  const breakpoint = useBreakpoint();
  
  return useMemo(() => ({
    width,
    height,
    breakpoint,
    isPhone: breakpoint === 'xs' || breakpoint === 'sm',
    isTablet: breakpoint === 'md' || breakpoint === 'lg',
    isDesktop: breakpoint === 'xl',
    isLandscape: width > height,
    isPortrait: height > width,
  }), [width, height, breakpoint]);
};

// Utility to get responsive spacing
export const getResponsiveSpacing = (breakpoint: Breakpoint): number => {
  switch (breakpoint) {
    case 'xs': return 8;
    case 'sm': return 12;
    case 'md': return 16;
    case 'lg': return 20;
    case 'xl': return 24;
    default: return 16;
  }
};

// Utility to get responsive font sizes
export const getResponsiveFontSize = (
  variant: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'caption',
  breakpoint: Breakpoint
): number => {
  const fontSizes = {
    h1: { xs: 24, sm: 28, md: 32, lg: 36, xl: 40 },
    h2: { xs: 20, sm: 24, md: 28, lg: 32, xl: 36 },
    h3: { xs: 18, sm: 20, md: 24, lg: 28, xl: 32 },
    h4: { xs: 16, sm: 18, md: 20, lg: 24, xl: 28 },
    body: { xs: 14, sm: 16, md: 16, lg: 18, xl: 20 },
    caption: { xs: 12, sm: 14, md: 14, lg: 16, xl: 18 },
  };
  
  return fontSizes[variant][breakpoint];
};

// Utility to get responsive grid columns
export const getResponsiveColumns = (
  columns: Partial<Record<Breakpoint, number>>,
  breakpoint: Breakpoint
): number => {
  return columns[breakpoint] || columns.xs || 1;
};

// Utility to get container max width
export const getContainerMaxWidth = (breakpoint: Breakpoint): number => {
  switch (breakpoint) {
    case 'xs': return BREAKPOINTS.sm;
    case 'sm': return BREAKPOINTS.md;
    case 'md': return BREAKPOINTS.lg;
    case 'lg': return BREAKPOINTS.xl;
    case 'xl': return 1400; // Max container width
    default: return BREAKPOINTS.sm;
  }
};

// Utility for responsive padding/margin
export const getResponsivePadding = (
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl',
  breakpoint: Breakpoint
): number => {
  const basePadding = getResponsiveSpacing(breakpoint);
  
  const multipliers = {
    xs: 0.5,
    sm: 0.75,
    md: 1,
    lg: 1.5,
    xl: 2,
  };
  
  return basePadding * multipliers[size];
};