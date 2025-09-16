import { useWindowDimensions } from 'react-native';
import { useBreakpoint } from './responsive';

// Image quality settings based on device capabilities
export const IMAGE_QUALITY = {
  xs: 70,  // Small phones - lower quality to save bandwidth
  sm: 75,  // Large phones
  md: 80,  // Tablets
  lg: 85,  // Large tablets
  xl: 90,  // Desktop - higher quality
} as const;

// Image size presets for different use cases
export const IMAGE_SIZES = {
  thumbnail: { xs: 60, sm: 80, md: 100, lg: 120, xl: 140 },
  avatar: { xs: 32, sm: 40, md: 48, lg: 56, xl: 64 },
  card: { xs: 120, sm: 150, md: 180, lg: 200, xl: 220 },
  banner: { xs: 300, sm: 400, md: 500, lg: 600, xl: 800 },
  hero: { xs: 400, sm: 500, md: 700, lg: 900, xl: 1200 },
} as const;

export type ImageSizePreset = keyof typeof IMAGE_SIZES;

interface OptimizedImageConfig {
  uri: string;
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
}

/**
 * Generate optimized image URI with responsive sizing and quality
 */
export const getOptimizedImageUri = (
  originalUri: string,
  preset?: ImageSizePreset,
  customWidth?: number,
  customHeight?: number
): OptimizedImageConfig => {
  const breakpoint = useBreakpoint();
  const { width: screenWidth } = useWindowDimensions();
  
  // Determine image dimensions
  let targetWidth: number;
  let targetHeight: number | undefined;
  
  if (preset && IMAGE_SIZES[preset]) {
    targetWidth = IMAGE_SIZES[preset][breakpoint];
  } else if (customWidth) {
    targetWidth = customWidth;
  } else {
    targetWidth = screenWidth;
  }
  
  if (customHeight) {
    targetHeight = customHeight;
  }
  
  // Get quality based on breakpoint
  const quality = IMAGE_QUALITY[breakpoint];
  
  // For now, return the original URI with metadata
  // In a real implementation, you might use a CDN service like Cloudinary
  return {
    uri: originalUri,
    width: targetWidth,
    height: targetHeight,
    quality,
    format: 'webp', // Prefer WebP for better compression
  };
};

/**
 * Hook for responsive image optimization
 */
export const useResponsiveImage = () => {
  const breakpoint = useBreakpoint();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  
  const getImageSize = (preset: ImageSizePreset) => {
    return IMAGE_SIZES[preset][breakpoint];
  };
  
  const getImageQuality = () => {
    return IMAGE_QUALITY[breakpoint];
  };
  
  const optimizeImageForScreen = (
    originalUri: string,
    maxWidth?: number,
    aspectRatio?: number
  ) => {
    const containerWidth = maxWidth || screenWidth;
    const quality = getImageQuality();
    
    let targetWidth = containerWidth;
    let targetHeight: number | undefined;
    
    if (aspectRatio) {
      targetHeight = targetWidth / aspectRatio;
    }
    
    return {
      uri: originalUri,
      width: targetWidth,
      height: targetHeight,
      quality,
      format: 'webp' as const,
    };
  };
  
  return {
    getImageSize,
    getImageQuality,
    optimizeImageForScreen,
    screenWidth,
    screenHeight,
    breakpoint,
  };
};

/**
 * Generate srcSet for responsive images (useful for web)
 */
export const generateImageSrcSet = (baseUri: string, sizes: number[]) => {
  return sizes
    .map(size => `${baseUri}?w=${size}&q=80 ${size}w`)
    .join(', ');
};

/**
 * Lazy loading configuration
 */
export const LAZY_LOADING_CONFIG = {
  threshold: 0.1, // Start loading when 10% visible
  rootMargin: '50px', // Start loading 50px before entering viewport
  enableNativeLoading: true, // Use native lazy loading when available
};

/**
 * Image caching configuration
 */
export const IMAGE_CACHE_CONFIG = {
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  maxSize: 100 * 1024 * 1024, // 100MB
  strategy: 'memory-disk' as const,
};

/**
 * Placeholder image generator
 */
export const generatePlaceholder = (width: number, height: number, color = '#f0f0f0') => {
  // Generate a simple placeholder data URI
  return `data:image/svg+xml;base64,${btoa(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${color}"/>
    </svg>
  `)}`;
};

/**
 * Image format detection and optimization
 */
export const getOptimalImageFormat = (originalUri: string) => {
  // Check if WebP is supported (most modern devices do)
  const supportsWebP = true; // Assume WebP support for React Native
  
  if (supportsWebP && !originalUri.includes('.gif')) {
    return 'webp';
  }
  
  // Fallback to original format
  if (originalUri.includes('.png')) return 'png';
  if (originalUri.includes('.jpg') || originalUri.includes('.jpeg')) return 'jpeg';
  
  return 'jpeg'; // Default fallback
};