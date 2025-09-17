import React, { useState, useCallback } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { useTheme } from 'react-native-paper';
import { 
  useResponsiveImage, 
  ImageSizePreset, 
  generatePlaceholder,
  IMAGE_CACHE_CONFIG 
} from '@/src/utils/imageOptimization';

interface OptimizedImageProps {
  source: string | { uri: string };
  preset?: ImageSizePreset;
  width?: number;
  height?: number;
  aspectRatio?: number;
  borderRadius?: number;
  className?: string;
  style?: any;
  placeholder?: string;
  contentFit?: 'cover' | 'contain' | 'fill' | 'scale-down';
  priority?: 'low' | 'normal' | 'high';
  lazy?: boolean;
  onLoad?: () => void;
  onError?: () => void;
  fallbackSource?: string;
}

/**
 * Optimized Image component with responsive sizing, lazy loading, and caching
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  source,
  preset,
  width,
  height,
  aspectRatio = 1,
  borderRadius = 0,
  className = '',
  style,
  placeholder,
  contentFit = 'cover',
  priority = 'normal',
  lazy = true,
  onLoad,
  onError,
  fallbackSource,
}) => {
  const { colors } = useTheme();
  const { optimizeImageForScreen, getImageSize } = useResponsiveImage();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Determine image dimensions
  const imageWidth = width || (preset ? getImageSize(preset) : 300);
  const imageHeight = height || imageWidth / aspectRatio;

  // Optimize image configuration
  const imageUri = typeof source === 'string' ? source : source.uri;
  const optimizedConfig = optimizeImageForScreen(imageUri, imageWidth, aspectRatio);

  // Generate placeholder if not provided
  const placeholderUri = placeholder || generatePlaceholder(imageWidth, imageHeight, colors.surfaceVariant);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    setHasError(false);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  }, [onError]);

  const imageStyle = {
    width: imageWidth,
    height: imageHeight,
    borderRadius,
    ...style,
  };

  // Show fallback if there's an error and fallback is provided
  const finalSource = hasError && fallbackSource 
    ? { uri: fallbackSource }
    : { uri: optimizedConfig.uri };

  return (
    <View style={imageStyle} className={className}>
      <Image
        source={finalSource}
        style={imageStyle}
        placeholder={placeholderUri}
        contentFit={contentFit}
        priority={priority}
        cachePolicy={IMAGE_CACHE_CONFIG.strategy}
        transition={200}
        onLoad={handleLoad}
        onError={handleError}
      />
      
      {/* Loading indicator */}
      {isLoading && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.surfaceVariant,
            borderRadius,
          }}
        >
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      )}
    </View>
  );
};

export default OptimizedImage;