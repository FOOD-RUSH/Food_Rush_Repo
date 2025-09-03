import { useMemo } from 'react';
import { Dimensions, Platform, PixelRatio } from 'react-native';
import { useResponsive } from './useResponsive';

// Device capability detection
export interface DeviceCapabilities {
  isHighEnd: boolean;
  hasLargeMemory: boolean;
  supportsHighRefreshRate: boolean;
  hasGoodGPU: boolean;
  recommendedQuality: 'low' | 'medium' | 'high' | 'ultra';
}

// Performance optimization settings
export interface PerformanceSettings {
  imageQuality: 'low' | 'medium' | 'high';
  animationComplexity: 'simple' | 'normal' | 'complex';
  listVirtualization: boolean;
  imagePreloading: boolean;
  gestureOptimization: boolean;
  memoryOptimization: boolean;
}

// Device-specific configurations
export interface DeviceConfig {
  capabilities: DeviceCapabilities;
  performance: PerformanceSettings;
  ui: {
    touchTargetSize: number;
    borderRadius: number;
    shadowIntensity: number;
    animationDuration: number;
  };
  layout: {
    gridColumns: number;
    cardSpacing: number;
    containerPadding: number;
  };
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const PIXEL_RATIO = PixelRatio.get();
const IS_TABLET = SCREEN_WIDTH >= 768;
const IS_HIGH_RES = PIXEL_RATIO >= 3;
const IS_LOW_END = SCREEN_WIDTH < 360 || PIXEL_RATIO < 2;

// Detect device capabilities
const detectDeviceCapabilities = (): DeviceCapabilities => {
  const totalMemory = 0; // Would need native module for actual memory detection
  const isHighEndDevice = IS_TABLET || (SCREEN_WIDTH >= 400 && PIXEL_RATIO >= 3);
  const hasLargeMemory = totalMemory > 2048 || isHighEndDevice; // Assume high-end devices have good memory

  let recommendedQuality: 'low' | 'medium' | 'high' | 'ultra' = 'medium';

  if (IS_LOW_END) {
    recommendedQuality = 'low';
  } else if (isHighEndDevice && IS_HIGH_RES) {
    recommendedQuality = 'ultra';
  } else if (isHighEndDevice) {
    recommendedQuality = 'high';
  }

  return {
    isHighEnd: isHighEndDevice,
    hasLargeMemory,
    supportsHighRefreshRate: Platform.OS === 'ios' || PIXEL_RATIO >= 3,
    hasGoodGPU: isHighEndDevice,
    recommendedQuality,
  };
};

// Generate performance settings based on device capabilities
const getPerformanceSettings = (capabilities: DeviceCapabilities): PerformanceSettings => {
  const { isHighEnd, recommendedQuality } = capabilities;

  switch (recommendedQuality) {
    case 'low':
      return {
        imageQuality: 'low',
        animationComplexity: 'simple',
        listVirtualization: true,
        imagePreloading: false,
        gestureOptimization: true,
        memoryOptimization: true,
      };

    case 'high':
      return {
        imageQuality: 'high',
        animationComplexity: 'normal',
        listVirtualization: true,
        imagePreloading: true,
        gestureOptimization: false,
        memoryOptimization: false,
      };

    case 'ultra':
      return {
        imageQuality: 'high',
        animationComplexity: 'complex',
        listVirtualization: false,
        imagePreloading: true,
        gestureOptimization: false,
        memoryOptimization: false,
      };

    default: // medium
      return {
        imageQuality: 'medium',
        animationComplexity: 'normal',
        listVirtualization: true,
        imagePreloading: false,
        gestureOptimization: false,
        memoryOptimization: false,
      };
  }
};

// Generate UI settings based on device
const getUISettings = (capabilities: DeviceCapabilities) => {
  const { isHighEnd, recommendedQuality } = capabilities;

  const baseTouchTarget = IS_TABLET ? 48 : 44;
  const baseBorderRadius = IS_TABLET ? 12 : 8;
  const baseAnimationDuration = recommendedQuality === 'low' ? 200 : 300;

  return {
    touchTargetSize: baseTouchTarget,
    borderRadius: baseBorderRadius,
    shadowIntensity: isHighEnd ? 1 : 0.5,
    animationDuration: baseAnimationDuration,
  };
};

// Generate layout settings
const getLayoutSettings = () => {
  const gridColumns = IS_TABLET ? 3 : 2;
  const cardSpacing = IS_TABLET ? 20 : 16;
  const containerPadding = IS_TABLET ? 24 : 16;

  return {
    gridColumns,
    cardSpacing,
    containerPadding,
  };
};

export const useDeviceOptimization = (): DeviceConfig => {
  const { isSmallDevice } = useResponsive();

  return useMemo(() => {
    const capabilities = detectDeviceCapabilities();
    const performance = getPerformanceSettings(capabilities);
    const ui = getUISettings(capabilities);
    const layout = getLayoutSettings();

    return {
      capabilities,
      performance,
      ui,
      layout,
    };
  }, [isSmallDevice]);
};

// Hook for getting optimized image settings
export const useOptimizedImageSettings = () => {
  const { performance } = useDeviceOptimization();

  return useMemo(() => {
    const qualitySettings = {
      low: { resizeMode: 'cover' as const, blurRadius: 2 },
      medium: { resizeMode: 'cover' as const, blurRadius: 0 },
      high: { resizeMode: 'cover' as const, blurRadius: 0 },
    };

    return {
      quality: performance.imageQuality,
      ...qualitySettings[performance.imageQuality],
      enablePreloading: performance.imagePreloading,
    };
  }, [performance]);
};

// Hook for getting optimized animation settings
export const useOptimizedAnimationSettings = () => {
  const { performance, ui } = useDeviceOptimization();

  return useMemo(() => {
    const complexitySettings = {
      simple: {
        duration: ui.animationDuration * 0.5,
        easing: 'ease' as const,
        useNativeDriver: true,
      },
      normal: {
        duration: ui.animationDuration,
        easing: 'ease-in-out' as const,
        useNativeDriver: true,
      },
      complex: {
        duration: ui.animationDuration * 1.2,
        easing: 'ease-in-out' as const,
        useNativeDriver: false,
      },
    };

    return complexitySettings[performance.animationComplexity];
  }, [performance, ui]);
};

// Hook for getting optimized list settings
export const useOptimizedListSettings = () => {
  const { performance, capabilities } = useDeviceOptimization();

  return useMemo(() => ({
    enableVirtualization: performance.listVirtualization,
    initialNumToRender: capabilities.recommendedQuality === 'low' ? 5 : 10,
    maxToRenderPerBatch: capabilities.recommendedQuality === 'low' ? 5 : 10,
    windowSize: capabilities.recommendedQuality === 'low' ? 5 : 10,
    removeClippedSubviews: performance.memoryOptimization,
  }), [performance, capabilities]);
};

// Device info utilities
export const getDeviceInfo = () => ({
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  pixelRatio: PIXEL_RATIO,
  isTablet: IS_TABLET,
  isHighRes: IS_HIGH_RES,
  isLowEnd: IS_LOW_END,
  platform: Platform.OS,
  version: Platform.Version,
});

// Performance monitoring utilities
export const usePerformanceMonitor = () => {
  const deviceConfig = useDeviceOptimization();

  return useMemo(() => ({
    shouldThrottleAnimations: deviceConfig.capabilities.recommendedQuality === 'low',
    shouldReduceImageQuality: deviceConfig.performance.imageQuality === 'low',
    shouldUseSimpleGestures: deviceConfig.performance.gestureOptimization,
    recommendedBatchSize: deviceConfig.capabilities.isHighEnd ? 20 : 10,
  }), [deviceConfig]);
};