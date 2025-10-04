import { useResponsiveFontSize } from '@/src/hooks/useResponsive';

// Responsive font size utility
export const useResponsiveFonts = () => {
  const fontSize = useResponsiveFontSize();

  return {
    // Standard text sizes
    caption: fontSize.xs, // 12px responsive
    body: fontSize.sm, // 14px responsive
    bodyLarge: fontSize.base, // 16px responsive
    label: fontSize.lg, // 18px responsive
    title: fontSize.xl, // 20px responsive
    headline: fontSize['2xl'], // 24px responsive
    display: fontSize['3xl'], // 30px responsive

    // Custom sizes
    getSize: fontSize.getSize,

    // Common UI element sizes
    button: fontSize.getSize(16),
    input: fontSize.getSize(16),
    placeholder: fontSize.getSize(14),
    helper: fontSize.getSize(12),
    badge: fontSize.getSize(10),

    // Navigation sizes
    tabLabel: fontSize.getSize(12),
    headerTitle: fontSize.getSize(18),

    // Card sizes
    cardTitle: fontSize.getSize(16),
    cardSubtitle: fontSize.getSize(14),
    cardCaption: fontSize.getSize(12),
  };
};

// Static responsive font utility (for use outside components)
export const getResponsiveFontSize = (
  baseSize: number,
  screenWidth: number = 375,
) => {
  const scaleFactor = screenWidth / 375; // iPhone X width as base
  return Math.round(baseSize * scaleFactor);
};

// Common font size constants
export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
  '6xl': 60,
} as const;

// Font weight constants
export const FONT_WEIGHTS = {
  light: '300',
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
} as const;

// Line height multipliers
export const LINE_HEIGHT_MULTIPLIERS = {
  tight: 1.2,
  normal: 1.4,
  relaxed: 1.6,
  loose: 1.8,
} as const;
