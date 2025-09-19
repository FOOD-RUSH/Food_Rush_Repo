/**
 * Typography Migration Utility
 * 
 * This utility provides helper functions and patterns for migrating
 * from React Native Text components to the new Typography system.
 */

// Common Text style patterns and their Typography equivalents
export const TYPOGRAPHY_MIGRATION_PATTERNS = {
  // Headings
  'fontSize: 32.*fontWeight.*bold': 'Heading1',
  'fontSize: 28.*fontWeight.*bold': 'Heading2', 
  'fontSize: 24.*fontWeight.*bold': 'Heading3',
  'fontSize: 20.*fontWeight.*bold': 'Heading4',
  'fontSize: 18.*fontWeight.*bold': 'Heading5',
  'fontSize: 16.*fontWeight.*bold': 'Heading6',
  
  // Display text
  'fontSize: 48': 'Display1',
  'fontSize: 40': 'Display2',
  
  // Body text
  'fontSize: 18.*fontWeight.*regular': 'BodyLarge',
  'fontSize: 16.*fontWeight.*regular': 'Body',
  'fontSize: 14.*fontWeight.*regular': 'BodySmall',
  
  // Labels
  'fontSize: 16.*fontWeight.*medium': 'LabelLarge',
  'fontSize: 14.*fontWeight.*medium': 'Label',
  'fontSize: 12.*fontWeight.*medium': 'LabelSmall',
  
  // Small text
  'fontSize: 12': 'Caption',
  'fontSize: 10': 'Overline',
  
  // Common className patterns
  'text-xs': 'Caption',
  'text-sm': 'BodySmall',
  'text-base': 'Body',
  'text-lg': 'LabelLarge',
  'text-xl': 'Heading5',
  'text-2xl': 'Heading4',
  'text-3xl': 'Heading3',
  'text-4xl': 'Heading2',
  'text-5xl': 'Heading1',
  'text-6xl': 'Display2',
  'text-7xl': 'Display1',
} as const;

// Font weight mappings
export const FONT_WEIGHT_MAPPING = {
  '100': 'thin',
  '200': 'extraLight',
  '300': 'light',
  '400': 'regular',
  '500': 'medium',
  '600': 'semibold',
  '700': 'bold',
  '800': 'extraBold',
  '900': 'black',
  'thin': 'thin',
  'light': 'light',
  'normal': 'regular',
  'medium': 'medium',
  'semibold': 'semibold',
  'bold': 'bold',
  'heavy': 'extraBold',
  'black': 'black',
} as const;

// Common style to Typography prop mappings
export const STYLE_TO_PROPS_MAPPING = {
  textAlign: 'align',
  color: 'color',
  fontWeight: 'weight',
  fontFamily: 'weight', // Maps to Urbanist weight variants
} as const;

/**
 * Converts a fontSize value to the appropriate Typography variant
 */
export const getTypographyVariantFromFontSize = (fontSize: number): string => {
  if (fontSize >= 48) return 'Display1';
  if (fontSize >= 40) return 'Display2';
  if (fontSize >= 32) return 'Heading1';
  if (fontSize >= 28) return 'Heading2';
  if (fontSize >= 24) return 'Heading3';
  if (fontSize >= 20) return 'Heading4';
  if (fontSize >= 18) return 'Heading5';
  if (fontSize >= 16) return 'Body';
  if (fontSize >= 14) return 'BodySmall';
  if (fontSize >= 12) return 'Caption';
  return 'Overline';
};

/**
 * Converts a fontWeight value to Urbanist weight
 */
export const getUrbanistWeight = (fontWeight: string | number): string => {
  const weight = fontWeight.toString();
  return FONT_WEIGHT_MAPPING[weight as keyof typeof FONT_WEIGHT_MAPPING] || 'regular';
};

/**
 * Analyzes Text component props and suggests Typography component
 */
export const analyzeTextComponent = (props: any) => {
  const { style, className } = props;
  
  let variant = 'Body';
  let weight = 'regular';
  let color = undefined;
  let align = undefined;
  
  // Analyze style prop
  if (style) {
    const flatStyle = Array.isArray(style) ? Object.assign({}, ...style) : style;
    
    if (flatStyle.fontSize) {
      variant = getTypographyVariantFromFontSize(flatStyle.fontSize);
    }
    
    if (flatStyle.fontWeight) {
      weight = getUrbanistWeight(flatStyle.fontWeight);
    }
    
    if (flatStyle.color) {
      color = flatStyle.color;
    }
    
    if (flatStyle.textAlign) {
      align = flatStyle.textAlign;
    }
  }
  
  // Analyze className prop
  if (className) {
    // Extract text size classes
    const sizeMatch = className.match(/text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl)/);
    if (sizeMatch) {
      const sizeClass = `text-${sizeMatch[1]}`;
      variant = TYPOGRAPHY_MIGRATION_PATTERNS[sizeClass as keyof typeof TYPOGRAPHY_MIGRATION_PATTERNS] || variant;
    }
    
    // Extract font weight classes
    if (className.includes('font-thin')) weight = 'thin';
    else if (className.includes('font-light')) weight = 'light';
    else if (className.includes('font-medium')) weight = 'medium';
    else if (className.includes('font-semibold')) weight = 'semibold';
    else if (className.includes('font-bold')) weight = 'bold';
    else if (className.includes('font-black')) weight = 'black';
    
    // Extract text alignment
    if (className.includes('text-center')) align = 'center';
    else if (className.includes('text-right')) align = 'right';
    else if (className.includes('text-justify')) align = 'justify';
  }
  
  return {
    variant,
    weight,
    color,
    align,
    component: getTypographyComponent(variant),
  };
};

/**
 * Gets the appropriate Typography component name
 */
export const getTypographyComponent = (variant: string): string => {
  const componentMap = {
    'Display1': 'Display1',
    'Display2': 'Display2',
    'Heading1': 'Heading1',
    'Heading2': 'Heading2',
    'Heading3': 'Heading3',
    'Heading4': 'Heading4',
    'Heading5': 'Heading5',
    'Heading6': 'Heading6',
    'BodyLarge': 'BodyLarge',
    'Body': 'Body',
    'BodySmall': 'BodySmall',
    'LabelLarge': 'LabelLarge',
    'Label': 'Label',
    'LabelSmall': 'LabelSmall',
    'Caption': 'Caption',
    'Overline': 'Overline',
  };
  
  return componentMap[variant as keyof typeof componentMap] || 'Typography';
};

/**
 * Generates the import statement for Typography components
 */
export const generateTypographyImport = (components: string[]): string => {
  const uniqueComponents = [...new Set(components)];
  return `import { ${uniqueComponents.join(', ')} } from '@/src/components/common/Typography';`;
};

/**
 * Migration examples for common patterns
 */
export const MIGRATION_EXAMPLES = {
  basicText: {
    before: `<Text style={{ fontSize: 16, color: colors.onSurface }}>Hello</Text>`,
    after: `<Body color={colors.onSurface}>Hello</Body>`,
  },
  headingText: {
    before: `<Text style={{ fontSize: 24, fontWeight: 'bold', color: colors.onSurface }}>Title</Text>`,
    after: `<Heading3 color={colors.onSurface} weight="bold">Title</Heading3>`,
  },
  classNameText: {
    before: `<Text className="text-lg font-semibold text-center">Label</Text>`,
    after: `<LabelLarge weight="semibold" align="center">Label</LabelLarge>`,
  },
  complexText: {
    before: `<Text style={[styles.text, { color: theme.colors.primary }]} numberOfLines={2}>Content</Text>`,
    after: `<Body color={theme.colors.primary} numberOfLines={2} style={styles.text}>Content</Body>`,
  },
};

export default {
  TYPOGRAPHY_MIGRATION_PATTERNS,
  FONT_WEIGHT_MAPPING,
  STYLE_TO_PROPS_MAPPING,
  getTypographyVariantFromFontSize,
  getUrbanistWeight,
  analyzeTextComponent,
  getTypographyComponent,
  generateTypographyImport,
  MIGRATION_EXAMPLES,
};