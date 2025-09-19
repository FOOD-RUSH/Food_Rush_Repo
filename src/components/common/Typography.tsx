import React from 'react';
import { Text, TextProps, TextStyle } from 'react-native';
import { useTheme } from 'react-native-paper';
import { 
  TYPOGRAPHY_SCALE, 
  getTypographyProps, 
  getUrbanistFont,
  URBANIST_FONTS 
} from '@/src/config/fonts';
import { useResponsive } from '@/src/hooks/useResponsive';

type TypographyVariant = keyof typeof TYPOGRAPHY_SCALE;
type UrbanistWeight = keyof typeof URBANIST_FONTS;

interface TypographyProps extends Omit<TextProps, 'style'> {
  variant?: TypographyVariant;
  weight?: UrbanistWeight;
  color?: string;
  align?: 'left' | 'center' | 'right' | 'justify';
  responsive?: boolean;
  style?: TextStyle | TextStyle[];
  children: React.ReactNode;
}

export const Typography: React.FC<TypographyProps> = ({
  variant = 'body',
  weight,
  color,
  align = 'left',
  responsive = true,
  style,
  children,
  ...props
}) => {
  const { colors } = useTheme();
  const { screen } = useResponsive();

  // Get typography props with responsive sizing
  const typographyStyle = getTypographyProps(variant, responsive, screen.width);
  
  // Override font family if weight is specified
  const fontFamily = weight ? getUrbanistFont(weight) : typographyStyle.fontFamily;

  const textStyle: TextStyle = {
    ...typographyStyle,
    fontFamily,
    color: color || colors.onSurface,
    textAlign: align,
  };

  const combinedStyle = Array.isArray(style) 
    ? [textStyle, ...style] 
    : [textStyle, style].filter(Boolean);

  return (
    <Text style={combinedStyle} {...props}>
      {children}
    </Text>
  );
};

// Predefined typography components for common use cases
export const Display1: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="display1" {...props} />
);

export const Display2: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="display2" {...props} />
);

export const Heading1: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="h1" {...props} />
);

export const Heading2: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="h2" {...props} />
);

export const Heading3: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="h3" {...props} />
);

export const Heading4: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="h4" {...props} />
);

export const Heading5: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="h5" {...props} />
);

export const Heading6: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="h6" {...props} />
);

export const BodyLarge: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="bodyLarge" {...props} />
);

export const Body: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="body" {...props} />
);

export const BodySmall: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="bodySmall" {...props} />
);

export const LabelLarge: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="labelLarge" {...props} />
);

export const Label: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="label" {...props} />
);

export const LabelSmall: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="labelSmall" {...props} />
);

export const Caption: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="caption" {...props} />
);

export const Overline: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="overline" {...props} />
);

// Export default Typography component
export default Typography;