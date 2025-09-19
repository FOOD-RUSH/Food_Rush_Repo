
// Font loading configuration for expo-font
export const FONT_ASSETS = {
  'Urbanist-Thin': require('../../assets/fonts/Urbanist-Thin.ttf'),
  'Urbanist-ExtraLight': require('../../assets/fonts/Urbanist-ExtraLight.ttf'),
  'Urbanist-Light': require('../../assets/fonts/Urbanist-Light.ttf'),
  'Urbanist-Regular': require('../../assets/fonts/Urbanist-Regular.ttf'),
  'Urbanist-Medium': require('../../assets/fonts/Urbanist-Medium.ttf'),
  'Urbanist-SemiBold': require('../../assets/fonts/Urbanist-SemiBold.ttf'),
  'Urbanist-Bold': require('../../assets/fonts/Urbanist-Bold.ttf'),
  'Urbanist-ExtraBold': require('../../assets/fonts/Urbanist-ExtraBold.ttf'),
  'Urbanist-Black': require('../../assets/fonts/Urbanist-Black.ttf'),
} as const;// Urbanist font configuration
// Modern, clean font family for the Food Rush app
export const FONT_DEFINITIONS = {
  // Urbanist font variants
  'Urbanist-Thin': 'Urbanist-Thin',
  'Urbanist-ExtraLight': 'Urbanist-ExtraLight',
  'Urbanist-Light': 'Urbanist-Light',
  'Urbanist-Regular': 'Urbanist-Regular',
  'Urbanist-Medium': 'Urbanist-Medium',
  'Urbanist-SemiBold': 'Urbanist-SemiBold',
  'Urbanist-Bold': 'Urbanist-Bold',
  'Urbanist-ExtraBold': 'Urbanist-ExtraBold',
  'Urbanist-Black': 'Urbanist-Black',
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

// Urbanist font family with weight mapping
export const URBANIST_FONTS = {
  thin: 'Urbanist-Thin',
  extraLight: 'Urbanist-ExtraLight',
  light: 'Urbanist-Light',
  regular: 'Urbanist-Regular',
  medium: 'Urbanist-Medium',
  semibold: 'Urbanist-SemiBold',
  bold: 'Urbanist-Bold',
  extraBold: 'Urbanist-ExtraBold',
  black: 'Urbanist-Black',
} as const;

// Responsive typography scale with Urbanist
export const TYPOGRAPHY_SCALE = {
  // Display styles
  display1: { 
    fontSize: 48, 
    lineHeight: 56, 
    fontFamily: URBANIST_FONTS.bold,
    letterSpacing: -0.5 
  },
  display2: { 
    fontSize: 40, 
    lineHeight: 48, 
    fontFamily: URBANIST_FONTS.bold,
    letterSpacing: -0.25 
  },
  
  // Heading styles
  h1: { 
    fontSize: 32, 
    lineHeight: 40, 
    fontFamily: URBANIST_FONTS.bold,
    letterSpacing: -0.25 
  },
  h2: { 
    fontSize: 28, 
    lineHeight: 36, 
    fontFamily: URBANIST_FONTS.semibold,
    letterSpacing: 0 
  },
  h3: { 
    fontSize: 24, 
    lineHeight: 32, 
    fontFamily: URBANIST_FONTS.semibold,
    letterSpacing: 0 
  },
  h4: { 
    fontSize: 20, 
    lineHeight: 28, 
    fontFamily: URBANIST_FONTS.medium,
    letterSpacing: 0.15 
  },
  h5: { 
    fontSize: 18, 
    lineHeight: 26, 
    fontFamily: URBANIST_FONTS.medium,
    letterSpacing: 0.15 
  },
  h6: { 
    fontSize: 16, 
    lineHeight: 24, 
    fontFamily: URBANIST_FONTS.medium,
    letterSpacing: 0.15 
  },
  
  // Body styles
  bodyLarge: { 
    fontSize: 18, 
    lineHeight: 28, 
    fontFamily: URBANIST_FONTS.regular,
    letterSpacing: 0.5 
  },
  body: { 
    fontSize: 16, 
    lineHeight: 24, 
    fontFamily: URBANIST_FONTS.regular,
    letterSpacing: 0.5 
  },
  bodySmall: { 
    fontSize: 14, 
    lineHeight: 20, 
    fontFamily: URBANIST_FONTS.regular,
    letterSpacing: 0.25 
  },
  
  // Label styles
  labelLarge: { 
    fontSize: 16, 
    lineHeight: 24, 
    fontFamily: URBANIST_FONTS.medium,
    letterSpacing: 0.1 
  },
  label: { 
    fontSize: 14, 
    lineHeight: 20, 
    fontFamily: URBANIST_FONTS.medium,
    letterSpacing: 0.1 
  },
  labelSmall: { 
    fontSize: 12, 
    lineHeight: 18, 
    fontFamily: URBANIST_FONTS.medium,
    letterSpacing: 0.5 
  },
  
  // Caption and small text
  caption: { 
    fontSize: 12, 
    lineHeight: 18, 
    fontFamily: URBANIST_FONTS.regular,
    letterSpacing: 0.4 
  },
  overline: { 
    fontSize: 10, 
    lineHeight: 16, 
    fontFamily: URBANIST_FONTS.medium,
    letterSpacing: 1.5 
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
  weight: keyof typeof URBANIST_FONTS = 'regular'
) => {
  return URBANIST_FONTS[weight];
};

// Responsive font size helper
export const getResponsiveFontSize = (
  baseSize: number,
  screenWidth: number
): number => {
  // Breakpoints
  if (screenWidth < 375) return baseSize * 0.9; // Small phones
  if (screenWidth < 414) return baseSize; // Regular phones
  if (screenWidth < 768) return baseSize * 1.05; // Large phones
  if (screenWidth < 1024) return baseSize * 1.1; // Tablets
  return baseSize * 1.15; // Large tablets/desktop
};

// Typography component props helper
export const getTypographyProps = (
  variant: keyof typeof TYPOGRAPHY_SCALE,
  responsive: boolean = true,
  screenWidth?: number
) => {
  const baseStyle = TYPOGRAPHY_SCALE[variant];
  const fontSize = responsive && screenWidth 
    ? getResponsiveFontSize(baseStyle.fontSize, screenWidth)
    : baseStyle.fontSize;
    
  return {
    ...baseStyle,
    fontSize,
  };
};
