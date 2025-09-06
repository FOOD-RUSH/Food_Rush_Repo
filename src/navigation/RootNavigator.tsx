import React, { useCallback, useMemo } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { Linking, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { MaterialIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import OrderReceiptScreen from '../screens/customer/Order/OrderReceiptScreen';

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
import { useIsAuthenticated, useAuthUser } from '../stores/customerStores/AuthStore';
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

// Full-screen screens (no tabs)
import CheckOutScreen from '../screens/customer/home/CheckOutScreen';
import SearchScreen from '@/src/screens/customer/home/SearchScreen';
import CartScreen from '../screens/customer/home/CartScreen';
import NotificationsScreen from '../screens/restaurant/profile/NotificationsScreen';
import FoodDetailsScreen from '../screens/customer/home/FoodDetailsScreen';
import RestaurantDetailScreen from '../screens/customer/home/RestaurantDetailScreen';
import NearbyRestaurantsScreen from '../screens/customer/home/NearbyRestaurantsScreen';

// Profile screens
import EditProfileScreen from '../screens/customer/Profile/EditProfileScreen';
import FavoriteRestaurants from '../screens/customer/Profile/FavoriteRestaurants';
import PaymentScreen from '../screens/customer/Profile/PaymentScreen';
import LanguageScreen from '../screens/customer/Profile/LanguageScreen';
import AddressScreen from '../screens/customer/Profile/AddressScreen';

// Data
import { OnboardingSlides } from '@/src/utils/onboardingData';
import { useAppTheme, useAppNavigationTheme } from '../config/theme';

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
  const user = useAuthUser();
  const hasHydrated = useHasHydrated();
  const isOnboardingComplete = useOnboardingComplete();
  const userType = useAppUserType();
  const themeMode = useAppStore((state) => state.theme);
  const { t } = useTranslation('translation');

  // Cart store actions
  const clearCart = useCartStore((state) => state.clearCart);
  const cartItems = useCartStore((state) => state.items);

  // App store actions
  const { completeOnboarding, setUserType } = useAppStore();

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
        <TouchableOpacity
          onPress={handleClearCart}
          style={{ marginRight: 16 }}
        >
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
  const handleOnboardingComplete = useCallback(
    (selectedUserType: 'customer' | 'restaurant') => {
      setUserType(selectedUserType);
      completeOnboarding();
    },
    [completeOnboarding, setUserType],
  );

  
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
    if (!isAuthenticated) {
      console.log('navigating to login');
      return 'RestaurantApp';
    }

    switch (userType) {
      case 'customer':
        return 'CustomerApp';
      case 'restaurant':
        // Check restaurant verification status
        const verificationStatus = user?.verificationStatus || user?.restaurant?.verificationStatus;
        if (verificationStatus === 'PENDING_VERIFICATION' || verificationStatus === 'PENDING') {
          console.log('Restaurant not approved, navigating to awaiting approval');
          return 'Auth'; // This will show AwaitingApproval screen
        }
        return 'RestaurantApp';
      default:
        return 'Auth';
    }
  }, [isAuthenticated, userType, user]);

  // Render loading screen while hydrating
  if (!hasHydrated) {
    return <LoadingScreen />;
  }

  // Render onboarding if not completed
  if (!isOnboardingComplete) {
    return (
      <>
        <StatusBar style="auto" />
        <OnboardingScreen
          OnboardingSlides={OnboardingSlides}
          onComplete={handleOnboardingComplete}
          onLogin={handleLogin}
        />
      </>
      
    );
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
              component={NotificationsScreen}
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
          {/* 
          <Stack.Screen 
            name="OrderTracking" 
            component={OrderTrackingScreen}
            options={{
              ...screenOptions.checkout,
              headerTitle: 'Track Order',
              gestureEnabled: false, // Prevent swipe back during tracking
            }}
          />
          */}
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default RootNavigator;
