import React, { useCallback, useMemo } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { Linking, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { MaterialIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import OrderReceiptScreen from '../screens/customer/Order/OrderReceiptScreen';
import RestaurantReviewScreen from '../screens/customer/RestaurantReviewScreen';

// Navigation types and helpers
import { RootStackParamList } from './types';
import { navigationRef, handleDeepLink } from './navigationHelpers';
import { linking } from './linking';

// Stores
import {
  useAppStore,
  useHasHydrated,
  useOnboardingComplete,
  useAppUserType,
} from '../stores/customerStores/AppStore';
import {
  useIsAuthenticated,
  useUserType,
  useAuthLoading,
} from '../stores/customerStores/AuthStore';
import { useCartStore } from '../stores/customerStores/cartStore';

// Navigators
import AuthNavigator from './AuthNavigator';
import CustomerNavigator, {
  CustomerHelpCenterStackScreen,
} from './CustomerNavigator';
import RestaurantNavigator from './RestaurantNavigator';

// Components and screens
import LoadingScreen from '../components/common/LoadingScreen';
import OnboardingScreen from '../components/onBoardingScreen';
import UserTypeSelectionScreen from '../screens/UserTypeSelectionScreen';

// Full-screen screens (no tabs)
import CheckOutScreen from '../screens/customer/home/CheckOutScreen';
import SearchScreen from '@/src/screens/customer/home/SearchScreen';
import CategoryMenuScreen from '@/src/screens/customer/home/CategoryMenuScreen';
import CartScreen from '../screens/customer/home/CartScreen';
import NotificationScreen from '../screens/customer/home/NotificationScreen';
import FoodDetailsScreen from '../screens/customer/home/FoodDetailsScreen';
import RestaurantDetailScreen from '../screens/customer/home/RestaurantDetailScreen';
import RestaurantReviewsScreen from '../screens/customer/home/RestaurantReviewsScreen';
import NearbyRestaurantsScreen from '../screens/customer/home/NearbyRestaurantsScreen';
import OrderTrackingScreen from '../screens/customer/Order/OrderTrackingScreen';

// Profile screens
import EditProfileScreen from '../screens/customer/Profile/EditProfileScreen';
import FavoriteRestaurants from '../screens/customer/Profile/FavoriteRestaurants';
import PaymentScreen from '../screens/customer/Profile/PaymentScreen';
import LanguageScreen from '../screens/customer/Profile/LanguageScreen';
import AddressScreen from '../screens/customer/Profile/AddressScreen';

// Data
import { OnboardingSlides } from '@/src/utils/onboardingData';
import { useAppTheme, useAppNavigationTheme } from '../config/theme';
import ProfileDetailsScreen from '../screens/customer/Profile/ProfileDetailsScreen';

// Stack navigator
const Stack = createNativeStackNavigator<RootStackParamList>();

// Screen option presets for better organization and reuse
const createScreenOptions = (colors: any, t: any) => ({
  default: {
    headerShown: false,
    gestureEnabled: true,
    animation: 'slide_from_right' as const,
    lazy: true,
    unmountOnBlur: false,
    contentStyle: {
      backgroundColor: colors.background,
    },
    headerStyle: {
      backgroundColor: colors.card,
      elevation: 0,
      shadowOpacity: 0,
    },
    headerTintColor: colors.text,
  },

  modal: {
    presentation: 'modal' as const,
    headerShown: true,
    animation: 'slide_from_bottom' as const,
    gestureDirection: 'vertical' as const,
    contentStyle: {
      backgroundColor: colors.background,
    },
    headerStyle: {
      backgroundColor: colors.card,
      elevation: 0,
      shadowOpacity: 0,
    },
    headerTintColor: colors.text,
  },

  card: {
    presentation: 'card' as const,
    headerShown: true,
    headerTransparent: true,
    headerBackTitleVisible: false,
    animation: 'slide_from_right' as const,
    contentStyle: {
      backgroundColor: colors.background,
    },
    headerTintColor: colors.text,
  },

  profileCard: {
    presentation: 'card' as const,
    headerShown: true,
    headerTitleAlign: 'center' as const,
    animation: 'slide_from_right' as const,
    headerShadowVisible: false,
    contentStyle: {
      backgroundColor: colors.background,
    },
    headerStyle: {
      backgroundColor: colors.card,
      elevation: 0,
      shadowOpacity: 0,
    },
    headerTintColor: colors.text,
  },

  checkout: {
    headerShown: true,
    headerTitleAlign: 'center' as const,
    animation: 'slide_from_right' as const,
    gestureEnabled: true,
    contentStyle: {
      backgroundColor: colors.background,
    },
    headerStyle: {
      backgroundColor: colors.card,
      elevation: 0,
      shadowOpacity: 0,
    },
    headerTintColor: colors.text,
  },

  fullScreen: {
    presentation: 'fullScreenModal' as const,
    headerShown: false,
    gestureEnabled: true,
    animation: 'slide_from_bottom' as const,
  },
});

const RootNavigator: React.FC = () => {
  // Store hooks with performance-optimized selectors
  const isAuthenticated = useIsAuthenticated();
  const hasHydrated = useHasHydrated();
  const isOnboardingComplete = useOnboardingComplete();
  const authUserType = useUserType(); // Primary source from AuthStore
  const appUserType = useAppUserType(); // Secondary source from AppStore
  const isAuthLoading = useAuthLoading();
  const themeMode = useAppStore((state) => state.theme);
  const { t } = useTranslation('translation');

  // Use AuthStore as primary source for user type, fallback to AppStore
  const userType = authUserType || appUserType;

  // Cart store actions
  const clearCart = useCartStore((state) => state.clearCart);
  const cartItems = useCartStore((state) => state.items);

  // App store actions
  const { completeOnboarding, setUserType } = useAppStore();

  // Synchronize user type between stores
  React.useEffect(() => {
    if (authUserType && authUserType !== appUserType) {
      setUserType(authUserType);
    }
  }, [authUserType, appUserType, setUserType]);

  // Theme
  const theme = useAppTheme(themeMode);
  const navigationTheme = useAppNavigationTheme();

  // Memoized screen options for better performance
  const screenOptions = useMemo(
    () => createScreenOptions(theme.colors, t),
    [theme.colors, t],
  );
  const handleClearCart = useCallback(() => {
    if (cartItems.length === 0) {
      Toast.show({
        type: 'info',
        text1: t('info'),
        text2: t('cart_empty'),
        position: 'bottom',
      });
      return;
    }

    clearCart();
    Toast.show({
      type: 'success',
      text1: t('success'),
      text2: t('cart_cleared_successfully'),
      position: 'top',
    });
  }, [cartItems.length, clearCart, t]);

  // Memoized cart screen options
  const cartScreenOptions = useMemo(
    () => ({
      headerTitle: t('my_cart'),
      headerBackTitleVisible: false,
      headerRight: () => (
        <TouchableOpacity onPress={handleClearCart} style={{ marginRight: 16 }}>
          <MaterialIcons
            name="delete-forever"
            size={24}
            color={navigationTheme.colors.notification}
          />
        </TouchableOpacity>
      ),
    }),
    [t, handleClearCart, navigationTheme.colors.notification],
  );

  // Event handlers
  const handleOnboardingComplete = useCallback(() => {
    // Mark onboarding as complete in the store
    completeOnboarding();
  }, [completeOnboarding]);

  const handleLogin = useCallback(
    (selectedUserType: 'customer' | 'restaurant') => {
      setUserType(selectedUserType);
      completeOnboarding();
    },
    [completeOnboarding, setUserType],
  );

  // Navigation ready handler
  const handleNavigationReady = useCallback(() => {
    const subscription = Linking.addEventListener('url', ({ url }) => {
      handleDeepLink(url);
    });

    return () => subscription?.remove();
  }, []);

  // Determine initial route name based on app state
  const getInitialRouteName = useCallback((): keyof RootStackParamList => {
    // If auth is loading, we'll handle this in the render logic
    if (isAuthLoading) {
      return 'Auth'; // Temporary, will show loading screen
    }

    // If onboarding is not complete, show onboarding
    if (!isOnboardingComplete) {
      console.log('Onboarding not complete, showing onboarding');
      return 'Onboarding';
    }

    // If onboarding is complete but no user type selected, show user type selection
    if (!userType) {
      console.log('No user type selected, showing user type selection');
      return 'UserTypeSelection';
    }

    // If not authenticated, go to auth
    if (!isAuthenticated) {
      console.log('User not authenticated, navigating to Auth');
      return 'Auth';
    }

    // Navigate based on user type
    switch (userType) {
      case 'customer':
        console.log('Navigating to CustomerApp');
        return 'CustomerApp';
      case 'restaurant':
        console.log('Navigating to RestaurantApp');
        return 'RestaurantApp';
      default:
        console.log('Unknown user type, navigating to Auth');
        return 'Auth';
    }
  }, [isAuthenticated, userType, isAuthLoading, isOnboardingComplete]);

  // Render loading screen while hydrating or auth is loading
  if (!hasHydrated || isAuthLoading) {
    return <LoadingScreen />;
  }

  // Main app navigation
  return (
    <>
      <StatusBar style={theme.dark ? 'light' : 'dark'} />
      <NavigationContainer
        ref={navigationRef}
        linking={linking}
        theme={navigationTheme}
        fallback={<LoadingScreen />}
        onReady={handleNavigationReady}
      >
        <Stack.Navigator
          initialRouteName={getInitialRouteName()}
          screenOptions={screenOptions.default}
        >
          {/* Onboarding Screens */}
          <Stack.Screen
            name="Onboarding"
            options={{ headerShown: false }}
          >
            {(props) => (
              <OnboardingScreen
                {...props}
                OnboardingSlides={OnboardingSlides}
                onComplete={handleOnboardingComplete}
                onLogin={handleLogin}
              />
            )}
          </Stack.Screen>

          <Stack.Screen
            name="UserTypeSelection"
            component={UserTypeSelectionScreen}
            options={{ headerShown: false }}
          />

          {/* Main App Navigators */}
          <Stack.Screen
            name="Auth"
            component={AuthNavigator}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="CustomerApp"
            component={CustomerNavigator}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="RestaurantApp"
            component={RestaurantNavigator}
            options={{ headerShown: false }}
          />

          {/* Modal Screens */}
          <Stack.Group screenOptions={screenOptions.modal}>
            <Stack.Screen
              name="Cart"
              component={CartScreen}
              options={cartScreenOptions}
            />

            <Stack.Screen
              name="Notifications"
              component={NotificationScreen}
              options={{
                headerTitle: t('notifications'),
              }}
            />
          </Stack.Group>

          {/* Full Screen Modal */}
          <Stack.Screen
            name="SearchScreen"
            component={SearchScreen}
            options={screenOptions.fullScreen}
          />

          <Stack.Screen
            name="CategoryMenu"
            component={CategoryMenuScreen}
            options={{
              presentation: 'fullScreenModal',
              headerShown: true,
              gestureEnabled: true,
              animation: 'slide_from_bottom',
              contentStyle: {
                marginTop: -34
              }
            }}
          />

          {/* Card Presentation Screens */}
          <Stack.Group screenOptions={screenOptions.card}>
            <Stack.Screen
              name="FoodDetails"
              component={FoodDetailsScreen}
              options={{
                headerTitle: '',
                headerTransparent: true,
                headerStyle: {
                  backgroundColor: 'transparent',
                },
              }}
            />

            <Stack.Screen
              name="RestaurantDetails"
              component={RestaurantDetailScreen}
              options={{
                headerTitle: '',
                headerTransparent: true,
                headerStyle: {
                  backgroundColor: 'transparent',
                },
              }}
            />

            <Stack.Screen
              name="AddressScreen"
              component={AddressScreen}
              options={{
                headerTitle: t('address'),
                headerBackVisible: true,
              }}
            />
            <Stack.Screen
              name="NearbyRestaurants"
              component={NearbyRestaurantsScreen}
              options={{
                headerTitle: t('restaurants_near_you'),
              }}
            />

            <Stack.Screen
              name="RestaurantReview"
              component={RestaurantReviewScreen}
              options={{
                headerTitle: '',
                ...screenOptions.fullScreen,
              }}
            />

            <Stack.Screen
              name="RestaurantReviews"
              component={RestaurantReviewsScreen}
              options={{
                headerShown: false,
              }}
            />
          </Stack.Group>

          {/* Profile Screens */}
          <Stack.Group screenOptions={screenOptions.profileCard}>
            <Stack.Screen
              name="EditProfile"
              component={EditProfileScreen}
              options={{
                headerTitle: t('edit_profile'),
              }}
            />

            <Stack.Screen
              name="Help"
              component={CustomerHelpCenterStackScreen}
              options={{
                headerTitle: t('help_center'),
              }}
            />

            <Stack.Screen
              name="FavoriteRestaurantScreen"
              component={FavoriteRestaurants}
              options={{
                headerTitle: t('favorite_restaurants'),
              }}
            />

            <Stack.Screen
              name="PaymentMethods"
              component={PaymentScreen}
              options={{
                headerTitle: t('payment_methods'),
              }}
            />

            <Stack.Screen
              name="LanguageScreen"
              component={LanguageScreen}
              options={{
                headerTitle: t('language_settings'),
              }}
            />
            <Stack.Screen
              name="ProfileDetails"
              component={ProfileDetailsScreen}
              options={{
                headerTitle: t('profile_details'),
              }}
            />
            <Stack.Screen
              name="OrderTracking"
              component={OrderTrackingScreen}
              options={{
                headerTitle: 'Track Order',
                gestureEnabled: false, // Prevent swipe back during tracking
              }}
            />
          </Stack.Group>

          {/* Checkout Screen */}
          <Stack.Screen
            name="Checkout"
            component={CheckOutScreen}
            options={{
              ...screenOptions.checkout,
              headerTitle: t('checkout_order'),
              contentStyle: {
                marginTop: -34,
              },
            }}
          />

          {/* Future screens can be added here */}
          <Stack.Screen
            name="OrderReceipt"
            component={OrderReceiptScreen}
            options={{
              ...screenOptions.fullScreen,
              headerTitle: t('order_receipt'),
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default RootNavigator;
