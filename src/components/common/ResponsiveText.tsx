import React from 'react';
import { Text, TextStyle } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useBreakpoint, getResponsiveFontSize } from '@/src/utils/responsive';

interface ResponsiveTextProps {
  children: React.ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'caption';
  color?: string;
  weight?:
    | 'normal'
    | 'bold'
    | '100'
    | '200'
    | '300'
    | '400'
    | '500'
    | '600'
    | '700'
    | '800'
    | '900';
  align?: 'left' | 'center' | 'right' | 'justify';
  className?: string;
  style?: TextStyle;
  numberOfLines?: number;
  ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip';
}

export const ResponsiveText: React.FC<ResponsiveTextProps> = ({
  children,
  variant = 'body',
  color,
  weight = 'normal',
  align = 'left',
  className = '',
  style,
  numberOfLines,
  ellipsizeMode,
}) => {
  const { colors } = useTheme();
  const breakpoint = useBreakpoint();
  const fontSize = getResponsiveFontSize(variant, breakpoint);

  const textStyle: TextStyle = {
    fontSize,
    fontWeight: weight,
    textAlign: align,
    color: color || colors.onSurface,
    ...style,
  };

  return (
    <Text
      style={textStyle}
      className={className}
      numberOfLines={numberOfLines}
      ellipsizeMode={ellipsizeMode}
    >
      {children}
    </Text>
  );
};

export const ResponsiveHeading: React.FC<
  Omit<ResponsiveTextProps, 'variant'> & { level?: 1 | 2 | 3 | 4 }
> = ({ level = 1, weight = 'bold', ...props }) => {
  const variant = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4';
  return <ResponsiveText variant={variant} weight={weight} {...props} />;
};

export const ResponsiveSubheading: React.FC<
  Omit<ResponsiveTextProps, 'variant'>
> = ({ weight = '600', ...props }) => {
  return <ResponsiveText variant="h4" weight={weight} {...props} />;
};

export const ResponsiveBody: React.FC<Omit<ResponsiveTextProps, 'variant'>> = (
  props,
) => {
  return <ResponsiveText variant="body" {...props} />;
};

export const ResponsiveCaption: React.FC<
  Omit<ResponsiveTextProps, 'variant'>
> = ({ color, ...props }) => {
  const { colors } = useTheme();
  return (
    <ResponsiveText
      variant="caption"
      color={color || colors.onSurfaceVariant}
      {...props}
    />
  );
};

// Hook for getting typography styles
export const useTypography = () => {
  const { colors } = useTheme();
  const breakpoint = useBreakpoint();

  return {
    h1: {
      fontSize: getResponsiveFontSize('h1', breakpoint),
      fontWeight: 'bold' as const,
      color: colors.onSurface,
    },
    h2: {
      fontSize: getResponsiveFontSize('h2', breakpoint),
      fontWeight: 'bold' as const,
      color: colors.onSurface,
    },
    h3: {
      fontSize: getResponsiveFontSize('h3', breakpoint),
      fontWeight: '600' as const,
      color: colors.onSurface,
    },
    h4: {
      fontSize: getResponsiveFontSize('h4', breakpoint),
      fontWeight: '600' as const,
      color: colors.onSurface,
    },
    body: {
      fontSize: getResponsiveFontSize('body', breakpoint),
      fontWeight: 'normal' as const,
      color: colors.onSurface,
    },
    caption: {
      fontSize: getResponsiveFontSize('caption', breakpoint),
      fontWeight: 'normal' as const,
      color: colors.onSurfaceVariant,
    },
  };
};
