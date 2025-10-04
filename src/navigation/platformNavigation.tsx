import { Platform, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * Platform-specific navigation utilities
 * Handles differences between Android and iOS navigation behavior
 */

// Get the status bar height for Android
const ANDROID_STATUS_BAR_HEIGHT = StatusBar.currentHeight || 0;

/**
 * Calculate the appropriate marginTop for content based on platform
 * iOS already positions content under the header, Android needs adjustment
 */
export const getContentMarginTop = (hasHeader: boolean = true): number => {
  if (!hasHeader) return 0;

  // iOS automatically handles safe area and header positioning
  if (Platform.OS === 'ios') {
    return 0;
  }

  // Android needs negative margin to position content under transparent/translucent headers
  return -40;
};

/**
 * Get header height that accounts for safe area
 */
export const useHeaderHeight = (): number => {
  const insets = useSafeAreaInsets();

  if (Platform.OS === 'ios') {
    return 44 + insets.top; // Standard iOS nav bar height + safe area
  }

  return 56; // Standard Android app bar height
};

/**
 * Get tab bar height with proper safe area handling
 */
export const useTabBarHeight = (): number => {
  const insets = useSafeAreaInsets();

  const baseHeight = Platform.OS === 'ios' ? 0 : 60;
  const bottomPadding = Platform.OS === 'ios' ? 0 : 10;

  return baseHeight + bottomPadding + insets.bottom;
};

/**
 * Platform-specific screen options factory
 */
export const createPlatformScreenOptions = (
  colors: any,
  navigationColors: any,
  t: any,
) => {
  const commonHeaderStyle = {
    backgroundColor: colors.card,
    elevation: Platform.OS === 'android' ? 4 : 0,
    shadowOpacity: Platform.OS === 'ios' ? 0.1 : 0,
    shadowOffset: Platform.OS === 'ios' ? { width: 0, height: 2 } : undefined,
    shadowRadius: Platform.OS === 'ios' ? 4 : undefined,
  };

  const commonHeaderTitleStyle = {
    fontFamily: 'Urbanist-SemiBold',
    fontSize: 18,
    fontWeight: '600' as const,
    color: navigationColors.text,
  };

  return {
    default: {
      headerShown: false,
      gestureEnabled: true,
      animation: 'slide_from_right' as const,
      contentStyle: {
        backgroundColor: colors.background,
        marginTop: 0, // No margin needed for default screens
      },
      headerStyle: commonHeaderStyle,
      headerTintColor: navigationColors.text,
      headerTitleStyle: commonHeaderTitleStyle,
    },

    modal: {
      presentation: 'modal' as const,
      headerShown: true,
      animation:
        Platform.OS === 'ios'
          ? ('slide_from_bottom' as const)
          : ('fade_from_bottom' as const),
      gestureDirection: 'vertical' as const,
      contentStyle: {
        backgroundColor: colors.background,
        marginTop: getContentMarginTop(true),
      },
      headerStyle: commonHeaderStyle,
      headerTintColor: navigationColors.text,
      headerTitleStyle: commonHeaderTitleStyle,
    },

    card: {
      presentation: 'card' as const,
      headerShown: true,
      headerBackTitleVisible: false,
      animation: 'slide_from_right' as const,
      contentStyle: {
        backgroundColor: colors.background,
        marginTop: getContentMarginTop(true),
      },
      headerStyle: commonHeaderStyle,
      headerTintColor: navigationColors.text,
      headerTitleStyle: commonHeaderTitleStyle,
    },

    profileCard: {
      presentation: 'card' as const,
      headerShown: true,
      headerTitleAlign: 'center' as const,
      animation: 'slide_from_right' as const,
      headerShadowVisible: Platform.OS === 'android',
      contentStyle: {
        backgroundColor: colors.background,
        marginTop: getContentMarginTop(true),
      },
      headerStyle: commonHeaderStyle,
      headerTintColor: navigationColors.text,
      headerTitleStyle: commonHeaderTitleStyle,
    },

    checkout: {
      headerShown: true,
      headerTitleAlign: 'center' as const,
      animation: 'slide_from_right' as const,
      contentStyle: {
        backgroundColor: colors.background,
        marginTop: getContentMarginTop(true),
      },
      headerStyle: commonHeaderStyle,
      headerTintColor: navigationColors.text,
      headerTitleStyle: commonHeaderTitleStyle,
    },

    fullScreen: {
      presentation:
        Platform.OS === 'ios'
          ? ('fullScreenModal' as const)
          : ('modal' as const),
      headerShown: false,
      gestureEnabled: true,
      animation:
        Platform.OS === 'ios'
          ? ('slide_from_bottom' as const)
          : ('fade_from_bottom' as const),
      contentStyle: {
        backgroundColor: colors.background,
        marginTop: 0, // Full screen takes entire space
      },
    },

    transparentHeader: {
      headerShown: true,
      headerTransparent: true,
      headerStyle: {
        backgroundColor: 'transparent',
        elevation: 0,
        shadowOpacity: 0,
      },
      headerTintColor: navigationColors.text,
      headerTitleStyle: commonHeaderTitleStyle,
      contentStyle: {
        backgroundColor: colors.background,
        marginTop: 0, // Transparent header overlays content
      },
    },
  };
};

/**
 * Platform-specific tab bar styling
 */
export const getPlatformTabBarStyle = (
  cardColor: string,
  insets: { bottom: number },
) => {
  const baseHeight = Platform.OS === 'ios' ? 80 : 60;
  const basePadding = Platform.OS === 'ios' ? 25 : 10;

  return {
    backgroundColor: cardColor,
    borderColor: cardColor,
    height: baseHeight + basePadding + insets.bottom,
    paddingBottom: basePadding + insets.bottom,
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
    marginTop: -50,
    paddingTop: 10,
    borderTopWidth: 0,
    // Platform-specific shadows
    ...(Platform.OS === 'android'
      ? {
          elevation: 20,
        }
      : {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        }),
  };
};

/**
 * Floating tab bar styling - detached from bottom
 */
export const getFloatingTabBarStyle = () => {
  return {
    position: 'absolute' as const,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
  };
};

/**
 * Platform-specific gesture configurations
 */
export const getPlatformGestureConfig = () => ({
  // iOS has better swipe-back gesture support
  gestureEnabled: true,
  gestureResponseDistance: Platform.OS === 'ios' ? 50 : 35,
  // Full width swipe on iOS, edge swipe on Android for better UX
  fullScreenGestureEnabled: Platform.OS === 'ios',
});

/**
 * Platform-specific animation configurations
 */
export const getPlatformAnimation = (type: 'push' | 'modal' | 'fade') => {
  switch (type) {
    case 'push':
      return Platform.OS === 'ios' ? 'slide_from_right' : 'slide_from_right';
    case 'modal':
      return Platform.OS === 'ios' ? 'slide_from_bottom' : 'fade_from_bottom';
    case 'fade':
      return 'fade';
    default:
      return 'slide_from_right';
  }
};

/**
 * Get safe content insets for scrollable content
 */
export const useContentInsets = (
  hasHeader: boolean = true,
  hasTabBar: boolean = false,
) => {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useTabBarHeight();

  return {
    top: hasHeader ? (Platform.OS === 'ios' ? 0 : headerHeight) : insets.top,
    bottom: hasTabBar ? tabBarHeight : insets.bottom,
    left: insets.left,
    right: insets.right,
  };
};

/**
 * Updated RootNavigator Integration
 *
 * In your RootNavigator.tsx, replace the createScreenOptions function with:
 */
export const integrateIntoRootNavigator = () => {
  return `
// At the top of RootNavigator.tsx, add:
import {
  createPlatformScreenOptions,
  getPlatformGestureConfig,
  getPlatformAnimation,
  getContentMarginTop,
} from './platformNavigation';

// Then in your RootNavigator component, replace the screenOptions useMemo with:
const screenOptions = useMemo(() => {
  return createPlatformScreenOptions(theme.colors, navigationTheme.colors, t);
}, [theme.colors, navigationTheme.colors, t]);

// For CategoryMenu screen, update to:
<Stack.Screen
  name="CategoryMenu"
  component={CategoryMenuScreen}
  options={{
    presentation: 'fullScreenModal',
    headerShown: true,
    gestureEnabled: true,
    animation: getPlatformAnimation('modal'),
    contentStyle: {
      backgroundColor: theme.colors.background,
      marginTop: getContentMarginTop(true),
    },
  }}
/>

// For transparent header screens (FoodDetails, RestaurantDetails), use:
<Stack.Screen
  name="FoodDetails"
  component={FoodDetailsScreen}
  options={{
    ...screenOptions.transparentHeader,
    headerTitle: '',
  }}
/>
`;
};
