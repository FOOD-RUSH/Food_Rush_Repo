// Font loading configuration for expo-font - optimized for production
export const FONT_ASSETS = {
  'Urbanist-Regular': require('../../assets/fonts/Urbanist-Regular.ttf'),
  'Urbanist-Medium': require('../../assets/fonts/Urbanist-Medium.ttf'),
  'Urbanist-SemiBold': require('../../assets/fonts/Urbanist-SemiBold.ttf'),
  'Urbanist-Bold': require('../../assets/fonts/Urbanist-Bold.ttf'),
} as const; // Optimized Urbanist font configuration
// Modern, clean font family for the Food Rush app
export const FONT_DEFINITIONS = {
  // Urbanist font variants - production optimized
  'Urbanist-Regular': 'Urbanist-Regular',
  'Urbanist-Medium': 'Urbanist-Medium',
  'Urbanist-SemiBold': 'Urbanist-SemiBold',
  'Urbanist-Bold': 'Urbanist-Bold',
} as const;

// Font family mappings for different use cases
export const FONT_FAMILIES = {
  primary: 'Urbanist-Regular',
  secondary: 'Urbanist-Medium',
  accent: 'Urbanist-SemiBold',
  display: 'Urbanist-Bold',
  mono: 'monospace', // Keep monospace for code/technical content
} as const;

// Font weights mapping for Urbanist
export const FONT_WEIGHTS = {
  thin: '100' as const,
  extraLight: '200' as const,
  light: '300' as const,
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extraBold: '800' as const,
  black: '900' as const,
} as const;

// Urbanist font family with weight mapping - production optimized
export const URBANIST_FONTS = {
  // Fallback to available weights for removed fonts
  thin: 'Urbanist-Regular', // fallback
  extraLight: 'Urbanist-Regular', // fallback
  light: 'Urbanist-Regular', // fallback
  regular: 'Urbanist-Regular',
  medium: 'Urbanist-Medium',
  semibold: 'Urbanist-SemiBold',
  bold: 'Urbanist-Bold',
  extraBold: 'Urbanist-Bold', // fallback
  black: 'Urbanist-Bold', // fallback
} as const;

// Responsive typography scale with Urbanist
export const TYPOGRAPHY_SCALE = {
  // Display styles
  display1: {
    fontSize: 48,
    lineHeight: 56,
    fontFamily: URBANIST_FONTS.bold,
    letterSpacing: -0.5,
  },
  display2: {
    fontSize: 40,
    lineHeight: 48,
    fontFamily: URBANIST_FONTS.bold,
    letterSpacing: -0.25,
  },

  // Heading styles
  h1: {
    fontSize: 32,
    lineHeight: 40,
    fontFamily: URBANIST_FONTS.bold,
    letterSpacing: -0.25,
  },
  h2: {
    fontSize: 28,
    lineHeight: 36,
    fontFamily: URBANIST_FONTS.semibold,
    letterSpacing: 0,
  },
  h3: {
    fontSize: 24,
    lineHeight: 32,
    fontFamily: URBANIST_FONTS.semibold,
    letterSpacing: 0,
  },
  h4: {
    fontSize: 20,
    lineHeight: 28,
    fontFamily: URBANIST_FONTS.medium,
    letterSpacing: 0.15,
  },
  h5: {
    fontSize: 18,
    lineHeight: 26,
    fontFamily: URBANIST_FONTS.medium,
    letterSpacing: 0.15,
  },
  h6: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: URBANIST_FONTS.medium,
    letterSpacing: 0.15,
  },

  // Body styles
  bodyLarge: {
    fontSize: 18,
    lineHeight: 28,
    fontFamily: URBANIST_FONTS.regular,
    letterSpacing: 0.5,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: URBANIST_FONTS.regular,
    letterSpacing: 0.5,
  },
  bodySmall: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: URBANIST_FONTS.regular,
    letterSpacing: 0.25,
  },

  // Label styles
  labelLarge: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: URBANIST_FONTS.medium,
    letterSpacing: 0.1,
  },
  label: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: URBANIST_FONTS.medium,
    letterSpacing: 0.1,
  },
  labelSmall: {
    fontSize: 12,
    lineHeight: 18,
    fontFamily: URBANIST_FONTS.medium,
    letterSpacing: 0.5,
  },

  // Caption and small text
  caption: {
    fontSize: 12,
    lineHeight: 18,
    fontFamily: URBANIST_FONTS.regular,
    letterSpacing: 0.4,
  },
  overline: {
    fontSize: 10,
    lineHeight: 16,
    fontFamily: URBANIST_FONTS.medium,
    letterSpacing: 1.5,
  },
} as const;

// Helper function to get font style
export const getFontStyle = (
  variant: keyof typeof TYPOGRAPHY_SCALE = 'body',
  customFamily?: string,
) => {
  const style = TYPOGRAPHY_SCALE[variant];
  return {
    fontFamily: customFamily || style.fontFamily,
    fontSize: style.fontSize,
    lineHeight: style.lineHeight,
    letterSpacing: style.letterSpacing,
  };
};

// Helper function to get Urbanist font with specific weight
export const getUrbanistFont = (
  weight: keyof typeof URBANIST_FONTS = 'regular',
) => {
  return URBANIST_FONTS[weight];
};

// Responsive font size helper
export const getResponsiveFontSize = (
  baseSize: number,
  screenWidth: number,
  screenHeight: number,
  fontScale: number = 1,
): number => {
  // Calculate scaling factor based on screen size
  const screenArea = screenWidth * screenHeight;
  const baseScreenArea = 375 * 812; // iPhone X dimensions as base
  const screenScaleFactor = Math.sqrt(screenArea / baseScreenArea);

  // Adjust for different screen sizes
  let sizeMultiplier = 1;
  if (screenWidth < 375)
    sizeMultiplier = 0.85; // Very small screens
  else if (screenWidth < 414)
    sizeMultiplier = 0.9; // Small phones
  else if (screenWidth < 768)
    sizeMultiplier = 1; // Regular phones
  else if (screenWidth < 1024)
    sizeMultiplier = 1.1; // Tablets
  else sizeMultiplier = 1.2; // Large tablets/desktop

  // Combine screen scaling and font scaling
  const finalSize = baseSize * sizeMultiplier * fontScale;

  // Apply screen area scaling to make it more proportional
  return finalSize * screenScaleFactor;
};

// Typography component props helper
export const getTypographyProps = (
  variant: keyof typeof TYPOGRAPHY_SCALE,
  responsive: boolean = true,
  screenWidth?: number,
  screenHeight?: number,
  fontScale?: number,
) => {
  // Ensure variant exists in TYPOGRAPHY_SCALE
  if (!variant || !TYPOGRAPHY_SCALE[variant]) {
    console.warn(
      `Typography variant '${variant}' not found, falling back to 'body'`,
    );
    variant = 'body';
  }

  const baseStyle = TYPOGRAPHY_SCALE[variant];

  // Ensure baseStyle exists and has required properties
  if (!baseStyle || typeof baseStyle.fontSize !== 'number') {
    console.warn(
      `Invalid typography style for variant '${variant}', using fallback`,
    );
    return {
      fontSize: 16,
      lineHeight: 24,
      fontFamily: URBANIST_FONTS.regular,
      letterSpacing: 0.5,
    };
  }

  const fontSize =
    responsive && screenWidth && screenWidth > 0 && screenHeight
      ? getResponsiveFontSize(
          baseStyle.fontSize,
          screenWidth,
          screenHeight,
          fontScale,
        )
      : baseStyle.fontSize;

  // Adjust line height proportionally with font size
  const lineHeight =
    responsive && screenWidth && screenWidth > 0 && screenHeight
      ? Math.round(baseStyle.lineHeight * (fontSize / baseStyle.fontSize))
      : baseStyle.lineHeight;

  return {
    ...baseStyle,
    fontSize,
    lineHeight,
  };
};
