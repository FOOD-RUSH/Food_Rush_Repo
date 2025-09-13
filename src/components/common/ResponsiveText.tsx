import React from 'react';
import { Text, TextStyle, StyleProp } from 'react-native';
import { useResponsive } from '@/src/hooks/useResponsive';

interface ResponsiveTextProps {
  children: React.ReactNode;
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  color?: string;
  style?: StyleProp<TextStyle>;
  className?: string;
  numberOfLines?: number;
  ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip';
}

export const ResponsiveText: React.FC<ResponsiveTextProps> = ({
  children,
  size = 'base',
  weight = 'normal',
  color,
  style,
  className,
  numberOfLines,
  ellipsizeMode,
}) => {
  const { getTypographyScale } = useResponsive();

  const typographyScale = getTypographyScale();
  const fontSize = typographyScale[size];

  const textStyle: TextStyle = {
    fontSize,
    color,
    fontWeight:
      weight === 'normal'
        ? '400'
        : weight === 'medium'
          ? '500'
          : weight === 'semibold'
            ? '600'
            : '700',
  };

  return (
    <Text
      style={[textStyle, style]}
      className={className}
      numberOfLines={numberOfLines}
      ellipsizeMode={ellipsizeMode}
    >
      {children}
    </Text>
  );
};

// Specialized text components
export const ResponsiveHeading: React.FC<
  Omit<ResponsiveTextProps, 'size' | 'weight'>
> = (props) => <ResponsiveText {...props} size="2xl" weight="bold" />;

export const ResponsiveSubheading: React.FC<
  Omit<ResponsiveTextProps, 'size' | 'weight'>
> = (props) => <ResponsiveText {...props} size="xl" weight="semibold" />;

export const ResponsiveBody: React.FC<
  Omit<ResponsiveTextProps, 'size' | 'weight'>
> = (props) => <ResponsiveText {...props} size="base" weight="normal" />;

export const ResponsiveCaption: React.FC<
  Omit<ResponsiveTextProps, 'size' | 'weight'>
> = (props) => <ResponsiveText {...props} size="sm" weight="normal" />;

// Hook for custom typography
export const useTypography = () => {
  const { getTypographyScale } = useResponsive();
  return getTypographyScale();
};
