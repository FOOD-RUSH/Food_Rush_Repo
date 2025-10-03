import React from 'react';
import { Image, ImageProps, View, StyleSheet } from 'react-native';
import { useResponsive } from '@/src/hooks/useResponsive';

interface ResponsiveImageProps extends Omit<ImageProps, 'style'> {
  width?: number | string;
  height?: number | string;
  aspectRatio?: number;
  containerStyle?: any;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
}

const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  width = '100%',
  height,
  aspectRatio,
  containerStyle,
  resizeMode = 'cover',
  style,
  ...props
}) => {
  const { screen } = useResponsive();
  const screenWidth = screen.width;

  // Calculate responsive dimensions
  const responsiveWidth = typeof width === 'number' 
    ? width 
    : width === '100%' 
      ? screenWidth * 0.9  // Default to 90% of screen width
      : width;

  const calculatedHeight = aspectRatio 
    ? typeof responsiveWidth === 'number' ? responsiveWidth / aspectRatio : height
    : height;

  return (
    <View 
      style={[
        styles.container, 
        { 
          width: typeof width === 'string' ? width : responsiveWidth, 
          height: calculatedHeight 
        },
        containerStyle
      ]}
    >
      <Image
        {...props}
        style={[
          StyleSheet.absoluteFill,
          {
            width: '100%',
            height: '100%',
            resizeMode,
          },
          style
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
});

export default ResponsiveImage;