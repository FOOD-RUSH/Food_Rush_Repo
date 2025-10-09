import { MaterialIcon } from '@/src/components/common/icons';
import React, { useMemo, useCallback, useRef } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import {
  TouchableOpacity,
  Linking,
  DeviceEventEmitter,
  Platform,
} from 'react-native';

import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';
import RestaurantReviewScreen from '../screens/customer/RestaurantReviewScreen';

// Stores
import {
  useAppStore,
  useHasHydrated,
  useOnboardingComplete,
  useSelectedUserType,
} from '../stores/AppStore';
import { useIsAuthenticated, useUserType } from '../stores/AuthStore';
import { useCartStore } from '../stores/customerStores/cartStore';

// Navigation
import { RootStackParamList } from './types';
import { linking } from './linking';
import { navigationRef } from './navigationRef';

// Navigators
import AuthNavigator from './AuthNavigator';
import CustomerNavigator, {
  CustomerHelpCenterStackScreen,
} from './CustomerNavigator';
import RestaurantNavigator from './RestaurantNavigator';

import {
  createPlatformScreenOptions,
  getPlatformAnimation,
  getContentMarginTop,
} from './platformNavigation';

// Components and screens
import LoadingScreen from '../components/common/LoadingScreen';
import OnboardingScreen from '../components/onBoardingScreen';
import UserTypeSelectionScreen from '../screens/common/UserTypeSelectionScreen';

// Full-screen screens (no tabs)
import OrderReceiptScreen from '../screens/customer/Order/OrderReceiptScreen';
import CheckOutScreen from '../screens/customer/home/CheckOutScreen';
import SearchScreen from '@/src/screens/customer/home/SearchScreen';
import CategoryMenuScreen from '@/src/screens/customer/home/CategoryMenuScreen';
import CartScreen from '../screens/customer/home/CartScreen';
import NotificationsList from '../screens/restaurant/notifications/NotificationsList';
import NotificationScreen from '../screens/customer/home/NotificationScreen';
import FoodDetailsScreen from '../screens/customer/home/FoodDetailsScreen';
import RestaurantDetailScreen from '../screens/customer/home/RestaurantDetailScreen';
import RestaurantReviewsScreen from '../screens/customer/home/RestaurantReviewsScreen';
import NearbyRestaurantsScreen from '../screens/customer/home/NearbyRestaurantsScreen';
import OrderTrackingScreen from '../screens/customer/Order/OrderTrackingScreen';

// Restaurant full-screen screens
import OrderDetailsScreen from '../screens/restaurant/orders/OrderDetailsScreen';
import ConfirmOrder from '../screens/restaurant/orders/ConfirmOrder';
import RejectOrder from '../screens/restaurant/orders/RejectOrder';
import { AddFoodScreen } from '../screens/restaurant/menu/AddFoodScreen';
import { EditFoodScreen } from '../screens/restaurant/menu/EditFoodScreen';

import RestaurantAnalyticsReviewsScreen from '../screens/restaurant/analytics/RestaurantReviewsScreen';
import TimeHeatmap from '../screens/restaurant/analytics/TimeHeatmap';
import ProfileScreen from '../screens/restaurant/account/ProfileScreen';
import AccountSettingsScreen from '../screens/restaurant/account/AccountSettingsScreen';
import SupportScreen from '../screens/restaurant/account/SupportScreen';
import AboutScreen from '../screens/restaurant/account/AboutScreen';
import RestaurantLocationScreen from '../screens/restaurant/account/RestaurantLocationScreen';
import ThemeSettingsScreen from '../screens/restaurant/account/ThemeSettingsScreen';

// Profile screens
import EditProfileScreen from '../screens/customer/Profile/EditProfileScreen';
import FavoriteRestaurants from '../screens/customer/Profile/FavoriteRestaurants';
import TransactionHistoryScreen from '../screens/customer/Profile/TransactionHistoryScreen';
import TransactionDetailsScreen from '../screens/customer/Profile/TransactionDetailsScreen';
import LanguageScreen from '../screens/customer/Profile/LanguageScreen';
import ProfileEditScreen from '../screens/restaurant/account/ProfileEditScreen';
import AddressScreen from '../screens/customer/Profile/AddressScreen';
import PaymentProcessingScreen from '../screens/customer/payment/PaymentProcessingScreen';
import AllRestaurantsScreen from '../screens/customer/home/AllRestaurantsScreen';
// Data & theme
import { OnboardingSlides } from '@/src/utils/onboardingData';
import { useAppTheme, useAppNavigationTheme } from '../config/theme';
import OrderHistoryScreen from '../screens/restaurant/orders/OrderHistoryScreen';
import ProfileDetailsScreen from '../screens/customer/Profile/ProfileDetailsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => {
  // Store hooks with performance-optimized selectors
  const isAuthenticated = useIsAuthenticated();
  const hasHydrated = useHasHydrated();
  const isOnboardingComplete = useOnboardingComplete();
  const authUserType = useUserType(); // Primary source from AuthStore
  const appUserType = useSelectedUserType(); // Secondary source from AppStore
  const themeMode = useAppStore((state) => state.theme);
  const { t } = useTranslation('translation');

  // Use AuthStore as primary source for user type, fallback to AppStore
  const userType = authUserType || appUserType;

  // App store actions
  const { completeOnboarding, setSelectedUserType } = useAppStore();

  // Synchronize user type between stores
  React.useEffect(() => {
    if (authUserType && authUserType !== appUserType) {
      setSelectedUserType(authUserType);
    }
  }, [authUserType, appUserType, setSelectedUserType]);

  // Cart store selectors
  const clearCart = useCartStore((state) => state.clearCart);
  const cartItemsLength = useCartStore((state) => state.items.length);

  // Theme
  const theme = useAppTheme(themeMode);
  const navigationTheme = useAppNavigationTheme();

  // Stable callbacks
  const handleClearCart = useCallback(() => {
    if (cartItemsLength === 0) {
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
  }, [cartItemsLength, clearCart, t]);

  const handleDeepLink = useCallback((url: string) => {
    // Deep link received: url
  }, []);

  // Stable onboarding handlers
  // Event handlers
  const handleOnboardingComplete = useCallback(() => {
    // Mark onboarding as complete in the store
    completeOnboarding();
  }, [completeOnboarding]);

  const handleLogin = useCallback(
    (selectedUserType: 'customer' | 'restaurant') => {
      setSelectedUserType(selectedUserType);
      completeOnboarding();
    },
    [completeOnboarding, setSelectedUserType],
  );

  // Logout event listener with ref to prevent multiple listeners
  const logoutListenerRef = useRef<any>(null);

  // Navigation ready handler
  const handleNavigationReady = useCallback(() => {
    const subscription = Linking.addEventListener('url', ({ url }) => {
      handleDeepLink(url);
    });

    // Remove existing logout listener if any
    if (logoutListenerRef.current) {
      logoutListenerRef.current.remove();
    }

    // Add single logout event listener
    // Add single logout event listener
    const logoutListener = () => {
      // Logout event received, navigating to UserTypeSelection
      // Navigate to user type selection when logout event is received
      if (navigationRef.isReady()) {
        navigationRef.reset({
          index: 0,
          routes: [{ name: 'UserTypeSelection' }],
        });
      }
    };

    // Store the listener reference
    logoutListenerRef.current = DeviceEventEmitter.addListener(
      'user-logout',
      logoutListener,
    );

    return () => {
      subscription?.remove();
      if (logoutListenerRef.current) {
        logoutListenerRef.current.remove();
        logoutListenerRef.current = null;
      }
    };
  }, [handleDeepLink]);

  // Memoized screen options
  // Then in your RootNavigator component, replace the screenOptions useMemo with:
  const screenOptions = useMemo(() => {
    return createPlatformScreenOptions(theme.colors, navigationTheme.colors, t);
  }, [theme.colors, navigationTheme.colors, t]);

  // Memoized cart screen options
  const cartScreenOptions = useMemo(
    () => ({
      headerTitle: t('my_cart'),
      headerBackTitleVisible: false,
      headerRight: () => (
        <TouchableOpacity onPress={handleClearCart} style={{ marginRight: 16 }}>
          <MaterialIcon
            name="delete-forever"
            size={24}
            color={navigationTheme.colors.notification}
          />
        </TouchableOpacity>
      ),
    }),
    [t, handleClearCart, navigationTheme.colors.notification],
  );

  // Determine initial route name based on app state
  const getInitialRouteName = useCallback((): keyof RootStackParamList => {
    // If onboarding is not complete, show onboarding
    if (!isOnboardingComplete) {
      // Onboarding not complete, showing onboarding
      return 'Onboarding';
    }

    // If onboarding is complete but no user type selected, show user type selection
    if (!userType && !appUserType) {
      // No user type selected, showing user type selection
      return 'UserTypeSelection';
    }

    // If not authenticated, go to auth
    if (!isAuthenticated) {
      // User not authenticated, navigating to Auth
      return 'UserTypeSelection';
    }

    // Navigate based on user type
    switch (userType) {
      case 'customer':
        // Navigating to CustomerApp
        return 'CustomerApp';
      case 'restaurant':
        // Navigating to RestaurantApp
        return 'RestaurantApp';
      default:
        // Unknown user type, navigating to UserTypeSelection
        return 'UserTypeSelection';
    }
  }, [isAuthenticated, userType, appUserType, isOnboardingComplete]);

  // Render loading screen while hydrating
  if (!hasHydrated) {
    return <LoadingScreen />;
  }

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
          <Stack.Screen name="Onboarding" options={{ headerShown: false }}>
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

          {/* Auth */}
          <Stack.Screen name="Auth" options={{ headerShown: false }}>
            {(props) => <AuthNavigator {...props} userType={userType} />}
          </Stack.Screen>

          {/* Main apps */}
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

          {/* Modals */}
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

          {/* FullScreen */}
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
              animation: getPlatformAnimation('modal'),
              contentStyle: {
                backgroundColor: theme.colors.background,
                marginTop: getContentMarginTop(true),
              },
              headerTitle: '',
              headerLeft: () => (
                <TouchableOpacity onPressIn={() => navigationRef.goBack()}>
                  <MaterialIcon
                    name={
                      Platform.OS === 'ios' ? 'arrow-back-ios' : 'arrow-back'
                    }
                    size={24}
                    color={navigationTheme.colors.text}
                  />
                </TouchableOpacity>
              ),
            }}
          />

          {/* Card Presentation Screens */}
          <Stack.Group screenOptions={screenOptions.card}>
            <Stack.Screen
              name="RestaurantOrderHistory"
              component={OrderHistoryScreen}
              options={{ headerTitle: t('order_history') }}
            />
            <Stack.Screen
              name="FoodDetails"
              component={FoodDetailsScreen}
              options={{
                ...screenOptions.transparentHeader,
                headerTitle: '',
              }}
            />
            <Stack.Screen
              name="RestaurantDetails"
              component={RestaurantDetailScreen}
              options={{
                ...screenOptions.transparentHeader,
                headerTitle: '',
              }}
            />
            <Stack.Screen
              name="AddressScreen"
              component={AddressScreen}
              options={{ headerTitle: t('address') }}
            />
            <Stack.Screen
              name="NearbyRestaurants"
              component={NearbyRestaurantsScreen}
              options={{ headerTitle: t('restaurants_near_you') }}
            />
            <Stack.Screen
              name="AllRestaurants"
              component={AllRestaurantsScreen}
              options={{ headerTitle: t('all_restaurants') }}
            />
          </Stack.Group>

          {/* Restaurant screens */}
          <Stack.Group screenOptions={screenOptions.card}>
            <Stack.Screen
              name="RestaurantOrderDetails"
              component={OrderDetailsScreen}
              options={{ headerTitle: t('order_details') }}
            />
            <Stack.Screen
              name="RestaurantCustomerReviews"
              component={RestaurantAnalyticsReviewsScreen}
              options={{ headerTitle: t('customer_reviews') }}
            />
            <Stack.Screen
              name="RestaurantTimeHeatmap"
              component={TimeHeatmap}
              options={{ headerTitle: t('time_heatmap') }}
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
              options={{}}
            />
          </Stack.Group>

          {/* Restaurant Modals */}
          <Stack.Group screenOptions={screenOptions.modal}>
            <Stack.Screen
              name="RestaurantConfirmOrder"
              component={ConfirmOrder}
              options={{ headerTitle: t('confirm_order') }}
            />
            <Stack.Screen
              name="RestaurantRejectOrder"
              component={RejectOrder}
              options={{ headerTitle: t('reject_order') }}
            />
            <Stack.Screen
              name="RestaurantMenuItemForm"
              component={AddFoodScreen}
              options={{
                headerTitle: t('add_new_item'),
                contentStyle: {
                  marginTop: -50,
                },
              }}
            />
          </Stack.Group>

          {/* Profile */}
          <Stack.Group screenOptions={screenOptions.profileCard}>
            <Stack.Screen
              name="EditProfile"
              component={EditProfileScreen}
              options={{ headerTitle: t('edit_profile') }}
            />
            <Stack.Screen
              name="Help"
              component={CustomerHelpCenterStackScreen}
              options={{ headerTitle: t('help_center') }}
            />
            <Stack.Screen
              name="FavoriteRestaurantScreen"
              component={FavoriteRestaurants}
              options={{ headerTitle: t('favorite_restaurants') }}
            />
            <Stack.Screen
              name="TransactionHistory"
              component={TransactionHistoryScreen}
              options={{ headerTitle: t('transaction_history') }}
            />
            <Stack.Screen
              name="TransactionDetails"
              component={TransactionDetailsScreen}
              options={{ headerTitle: t('transaction_details') }}
            />
            <Stack.Screen
              name="LanguageScreen"
              component={LanguageScreen}
              options={{ headerTitle: t('language_settings') }}
            />

            {/* Restaurant profile screens */}
            <Stack.Screen
              name="RestaurantEditProfile"
              component={ProfileEditScreen}
              options={{
                headerTitle: t('edit_profile'),
              }}
            />
            <Stack.Screen
              name="RestaurantEditFoodItem"
              component={EditFoodScreen}
              options={{
                headerTitle: 'Edit Item',
                headerBackTitleVisible: Platform.OS === 'ios',
                headerBackTitle: 'Menu',
              }}
            />
            <Stack.Screen
              name="RestaurantProfile"
              component={ProfileScreen}
              options={{
                headerTitle: t('restaurant_profile'),
              }}
            />
            <Stack.Screen
              name="RestaurantLocation"
              component={RestaurantLocationScreen}
              options={{
                headerTitle: t('restaurant_location'),
              }}
            />
            <Stack.Screen
              name="RestaurantThemeSettings"
              component={ThemeSettingsScreen}
              options={{
                headerTitle: t('appearance_language'),
              }}
            />
            <Stack.Screen
              name="RestaurantSettings"
              component={AccountSettingsScreen}
              options={{
                headerTitle: t('settings'),
              }}
            />
            <Stack.Screen
              name="RestaurantSupport"
              component={SupportScreen}
              options={{
                headerTitle: t('support'),
              }}
            />
            <Stack.Screen
              name="RestaurantAbout"
              component={AboutScreen}
              options={{
                headerTitle: t('about'),
              }}
            />

            <Stack.Screen
              name="RestaurantNotifications"
              component={NotificationsList}
              options={{
                headerTitle: t('notifications'),
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
                headerTitle: t('track_order'),
                gestureEnabled: false, // Prevent swipe back during tracking
              }}
            />
          </Stack.Group>

          {/* Checkout */}
          <Stack.Screen
            name="Checkout"
            component={CheckOutScreen}
            options={{
              ...screenOptions.checkout,
              headerTitle: t('checkout_order'),
            }}
          />

          {/* Payment Processing */}
          <Stack.Screen
            name="PaymentProcessing"
            component={PaymentProcessingScreen}
            options={{
              ...screenOptions.default,
              headerShown: false,
              gestureEnabled: false, // Prevent swipe back during payment
            }}
          />

          {/* Order Receipt */}
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

export default React.memo(RootNavigator);
