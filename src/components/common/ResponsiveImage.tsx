import React from 'react';
import { View, ViewStyle, ImageStyle } from 'react-native';
import { Image } from 'expo-image';
import { useBreakpoint, useResponsiveDimensions, Breakpoint } from '@/src/utils/responsive';
import Avatar from './Avatar';

interface ResponsiveImageProps {
  source: string | { uri: string };
  aspectRatio?: number;
  maxWidth?: Partial<Record<Breakpoint, number>>;
  maxHeight?: Partial<Record<Breakpoint, number>>;
  borderRadius?: number;
  className?: string;
  style?: ImageStyle;
  placeholder?: string;
  contentFit?: 'cover' | 'contain' | 'fill' | 'scale-down';
  priority?: 'low' | 'normal' | 'high';
}

export const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  source,
  aspectRatio = 1,
  maxWidth,
  maxHeight,
  borderRadius = 0,
  className = '',
  style,
  placeholder,
  contentFit = 'cover',
  priority = 'normal',
}) => {
  const breakpoint = useBreakpoint();
  const { width: screenWidth } = useResponsiveDimensions();
  
  // Calculate responsive dimensions
  const getImageWidth = () => {
    if (maxWidth && maxWidth[breakpoint]) {
      return Math.min(maxWidth[breakpoint]!, screenWidth);
    }
    return screenWidth;
  };
  
  const getImageHeight = () => {
    const width = getImageWidth();
    const calculatedHeight = width / aspectRatio;
    
    if (maxHeight && maxHeight[breakpoint]) {
      return Math.min(calculatedHeight, maxHeight[breakpoint]!);
    }
    
    return calculatedHeight;
  };
  
  const imageWidth = getImageWidth();
  const imageHeight = getImageHeight();
  
  const imageStyle: ImageStyle = {
    width: imageWidth,
    height: imageHeight,
    borderRadius,
    ...style,
  };
  
  return (
    <Image
      source={typeof source === 'string' ? { uri: source } : source}
      style={imageStyle}
      className={className}
      placeholder={placeholder}
      contentFit={contentFit}
      priority={priority}
      cachePolicy="memory-disk"
      transition={200}
    />
  );
};

interface ResponsiveAvatarProps {
  profilePicture?: string | null;
  fullName: string;
  size?: Partial<Record<Breakpoint, number>>;
  className?: string;
}

export const ResponsiveAvatar: React.FC<ResponsiveAvatarProps> = ({
  profilePicture,
  fullName,
  size = { xs: 32, sm: 40, md: 48, lg: 56, xl: 64 },
  className = '',
}) => {
  const breakpoint = useBreakpoint();
  const avatarSize = size[breakpoint] || size.xs || 40;
  
  return (
    <Avatar
      profilePicture={profilePicture}
      fullName={fullName}
      size={avatarSize}
      className={className}
    />
  );
};

interface ResponsiveIconProps {
  name: string;
  size?: Partial<Record<Breakpoint, number>>;
  color?: string;
  className?: string;
}

export const ResponsiveIcon: React.FC<ResponsiveIconProps> = ({
  name,
  size = { xs: 20, sm: 24, md: 28, lg: 32, xl: 36 },
  color,
  className = '',
}) => {
  const breakpoint = useBreakpoint();
  const iconSize = size[breakpoint] || size.xs || 24;
  
  // This would use your existing Icon component
  // For now, returning a placeholder
  return (
    <View
      style={{
        width: iconSize,
        height: iconSize,
        backgroundColor: color || '#ccc',
        borderRadius: iconSize / 2,
      }}
      className={className}
    />
  );
};

interface ResponsiveBannerProps {
  source: string | { uri: string };
  height?: Partial<Record<Breakpoint, number>>;
  overlay?: boolean;
  overlayColor?: string;
  overlayOpacity?: number;
  children?: React.ReactNode;
  className?: string;
}

export const ResponsiveBanner: React.FC<ResponsiveBannerProps> = ({
  source,
  height = { xs: 200, sm: 250, md: 300, lg: 350, xl: 400 },
  overlay = false,
  overlayColor = '#000',
  overlayOpacity = 0.3,
  children,
  className = '',
}) => {
  const breakpoint = useBreakpoint();
  const { width: screenWidth } = useResponsiveDimensions();
  const bannerHeight = height[breakpoint] || height.xs || 200;
  
  const containerStyle: ViewStyle = {
    width: screenWidth,
    height: bannerHeight,
    position: 'relative',
  };
  
  const overlayStyle: ViewStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: overlayColor,
    opacity: overlayOpacity,
    zIndex: 1,
  };
  
  return (
    <View style={containerStyle} className={className}>
      <ResponsiveImage
        source={source}
        aspectRatio={screenWidth / bannerHeight}
        contentFit="cover"
        style={{ position: 'absolute' }}
      />
      {overlay && <View style={overlayStyle} />}
      {children && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 2 }}>
          {children}
        </View>
      )}
    </View>
  );
};

// Hook for responsive image utilities
export const useResponsiveImage = () => {
  const breakpoint = useBreakpoint();
  const { width: screenWidth } = useResponsiveDimensions();
  
  const getOptimizedImageSize = (
    originalWidth: number,
    originalHeight: number,
    maxWidth?: number
  ) => {
    const containerWidth = maxWidth || screenWidth;
    const aspectRatio = originalWidth / originalHeight;
    
    if (originalWidth <= containerWidth) {
      return { width: originalWidth, height: originalHeight };
    }
    
    return {
      width: containerWidth,
      height: containerWidth / aspectRatio,
    };
  };
  
  const getImageQuality = () => {
    // Lower quality for smaller screens to save bandwidth
    switch (breakpoint) {
      case 'xs': return 70;
      case 'sm': return 80;
      case 'md': return 85;
      case 'lg': return 90;
      case 'xl': return 95;
      default: return 80;
    }
  };
  
  return {
    getOptimizedImageSize,
    getImageQuality,
    screenWidth,
    breakpoint,
  };
};