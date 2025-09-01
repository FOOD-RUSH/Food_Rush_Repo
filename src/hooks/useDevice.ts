import { useWindowDimensions, useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface DeviceInfo {
  width: number;
  height: number;
  isPortrait: boolean;
  isLandscape: boolean;
  isTablet: boolean;
  isPhone: boolean;
  isSmallPhone: boolean;
  safeAreaInsets: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

export const useDevice = (): DeviceInfo => {
  const { width, height } = useWindowDimensions();
  const isPortrait = height > width;
  const safeAreaInsets = useSafeAreaInsets();

  return {
    width,
    height,
    isPortrait,
    isLandscape: !isPortrait,
    isTablet: width >= 768,
    isPhone: width < 768,
    isSmallPhone: width < 375,
    safeAreaInsets,
  };
};

export const useBreakpoint = () => {
  const { width } = useWindowDimensions();

  return {
    xs: width >= 375,
    sm: width >= 640,
    md: width >= 768,
    lg: width >= 1024,
    xl: width >= 1280,
  };
};

export const useIsSystemDarkMode = () => {
  const systemColorScheme = useColorScheme();
  return systemColorScheme === 'dark';
};