import React from 'react';
import {
  Image,
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
} from 'react-native';
import { useResponsive } from '@/src/hooks/useResponsive';

interface ResponsiveImageProps {
  source: ImageSourcePropType;
  style?: StyleProp<ImageStyle>;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  aspectRatio?: number;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
  className?: string;
}

export const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  source,
  style,
  size = 'md',
  aspectRatio = 1,
  resizeMode = 'cover',
  className,
}) => {
  const { getResponsiveImageSize, isSmallDevice, isTablet } = useResponsive();

  // Define base sizes for different breakpoints
  const sizeMap = {
    xs: 40,
    sm: 60,
    md: 80,
    lg: 120,
    xl: 160,
    '2xl': 200,
  };

  // Adjust sizes based on device type
  const deviceMultiplier = isSmallDevice ? 0.8 : isTablet ? 1.2 : 1;
  const baseSize = sizeMap[size] * deviceMultiplier;

  // Get responsive size with constraints
  const responsiveSize = getResponsiveImageSize(baseSize);

  const imageStyle: ImageStyle = {
    width: responsiveSize,
    height: responsiveSize * aspectRatio,
  };

  return (
    <Image
      source={source}
      style={[imageStyle, style]}
      resizeMode={resizeMode}
      className={className}
    />
  );
};

// Specialized image variants
export const ResponsiveAvatar: React.FC<
  Omit<ResponsiveImageProps, 'aspectRatio'>
> = (props) => (
  <ResponsiveImage {...props} aspectRatio={1} resizeMode="cover" />
);

export const ResponsiveIcon: React.FC<
  Omit<ResponsiveImageProps, 'aspectRatio' | 'resizeMode'>
> = (props) => (
  <ResponsiveImage {...props} aspectRatio={1} resizeMode="contain" />
);

export const ResponsiveBanner: React.FC<
  Omit<ResponsiveImageProps, 'aspectRatio'>
> = (props) => (
  <ResponsiveImage {...props} aspectRatio={16 / 9} resizeMode="cover" />
);

// Hook for responsive image dimensions
export const useResponsiveImage = (baseWidth: number, baseHeight: number) => {
  const { getResponsiveImageSize } = useResponsive();

  return {
    width: getResponsiveImageSize(baseWidth),
    height: getResponsiveImageSize(baseHeight),
  };
};
