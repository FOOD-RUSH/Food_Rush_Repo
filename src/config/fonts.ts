// Lightweight font configuration using system fonts
// ZERO bundle size increase - uses built-in system fonts
export const FONT_DEFINITIONS = {
  // Using system monospace fonts (available on all platforms)
  'JetBrainsMono-Regular': 'monospace',
  'JetBrainsMono-Bold': 'monospace',
  'SpaceMono-Regular': 'monospace',
  'Orbitron-Regular': 'monospace',
} as const;

// Font family mappings for different use cases (system fonts)
export const FONT_FAMILIES = {
  primary: 'monospace',
  secondary: 'monospace',
  accent: 'monospace',
  display: 'monospace',
  mono: 'monospace',
} as const;

// Font weights mapping
export const FONT_WEIGHTS = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
} as const;

// Typography scale
export const TYPOGRAPHY_SCALE = {
  h1: { fontSize: 32, lineHeight: 40, fontWeight: FONT_WEIGHTS.bold },
  h2: { fontSize: 28, lineHeight: 36, fontWeight: FONT_WEIGHTS.semibold },
  h3: { fontSize: 24, lineHeight: 32, fontWeight: FONT_WEIGHTS.semibold },
  h4: { fontSize: 20, lineHeight: 28, fontWeight: FONT_WEIGHTS.medium },
  body: { fontSize: 16, lineHeight: 24, fontWeight: FONT_WEIGHTS.regular },
  caption: { fontSize: 14, lineHeight: 20, fontWeight: FONT_WEIGHTS.regular },
  small: { fontSize: 12, lineHeight: 18, fontWeight: FONT_WEIGHTS.regular },
} as const;

// Helper function to get font style
export const getFontStyle = (
  variant: keyof typeof TYPOGRAPHY_SCALE = 'body',
  family: keyof typeof FONT_FAMILIES = 'primary'
) => {
  return {
    fontFamily: FONT_FAMILIES[family],
    fontSize: TYPOGRAPHY_SCALE[variant].fontSize,
    lineHeight: TYPOGRAPHY_SCALE[variant].lineHeight,
    fontWeight: TYPOGRAPHY_SCALE[variant].fontWeight,
  };
};