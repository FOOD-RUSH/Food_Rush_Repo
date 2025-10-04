import React from 'react';
import { Text, TextProps, TextStyle, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useResponsive } from '@/src/hooks/useResponsive';

interface ResponsiveTextProps extends TextProps {
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  weight?: 'thin' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
  color?: string;
  align?: 'left' | 'center' | 'right' | 'justify';
  lineHeight?: number;
  children: React.ReactNode;
}

const ResponsiveText: React.FC<ResponsiveTextProps> = ({
  size = 'base',
  weight = 'normal',
  color,
  align = 'left',
  lineHeight,
  style,
  children,
  ...props
}) => {
  const { colors } = useTheme();
  const { scale } = useResponsive();

  // Define responsive font sizes
  const fontSize = {
    xs: scale(12),
    sm: scale(14),
    base: scale(16),
    lg: scale(18),
    xl: scale(20),
    '2xl': scale(24),
    '3xl': scale(30),
    '4xl': scale(36),
  }[size];

  // Define font weights
  const fontWeight = {
    thin: '100',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  }[weight];

  // Define line heights based on font size
  const calculatedLineHeight = lineHeight || fontSize * 1.3;

  const textStyle: TextStyle = {
    fontSize,
    fontWeight,
    color: color || colors.onSurface,
    textAlign: align,
    lineHeight: calculatedLineHeight,
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

export default ResponsiveText;
