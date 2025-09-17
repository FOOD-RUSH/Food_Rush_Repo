import React, {
  useEffect,
  useMemo,
  useCallback,
  
} from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { TouchableOpacity, Linking } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';
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

// Components and screens
import LoadingScreen from '../components/common/LoadingScreen';
import OnboardingScreen from '../components/onBoardingScreen';
import UserTypeSelectionScreen from '../screens/common/UserTypeSelectionScreen';

// Full-screen screens (no tabs)
import OrderReceiptScreen from '../screens/customer/Order/OrderReceiptScreen';
import CheckOutScreen from '../screens/customer/home/CheckOutScreen';
import SearchScreen from '@/src/screens/customer/home/SearchScreen';
import CartScreen from '../screens/customer/home/CartScreen';
import NotificationsList from '../screens/restaurant/notifications/NotificationsList';
import NotificationsScreen from '../screens/restaurant/profile/NotificationsScreen';
import FoodDetailsScreen from '../screens/customer/home/FoodDetailsScreen';
import RestaurantDetailScreen from '../screens/customer/home/RestaurantDetailScreen';
import NearbyRestaurantsScreen from '../screens/customer/home/NearbyRestaurantsScreen';

// Restaurant full-screen screens
import OrderDetailsScreen from '../screens/restaurant/orders/OrderDetailsScreen';
import ConfirmOrder from '../screens/restaurant/orders/ConfirmOrder';
import RejectOrder from '../screens/restaurant/orders/RejectOrder';
import { AddFoodScreen } from '../screens/restaurant/menu/AddFoodScreen';
import { EditFoodScreen } from '../screens/restaurant/menu/EditFoodScreen';
import FoodCategoriesScreen from '../screens/restaurant/menu/FoodCategoriesScreen';
import BestSellers from '../screens/restaurant/analytics/BestSellers';
import TimeHeatmap from '../screens/restaurant/analytics/TimeHeatmap';
import ProfileScreen from '../screens/restaurant/profile/ProfileScreen';
import PaymentBillingScreen from '../screens/restaurant/profile/PaymentBillingScreen';
import AccountSettingsScreen from '../screens/restaurant/profile/AccountSettingsScreen';
import SupportScreen from '../screens/restaurant/profile/SupportScreen';
import AboutScreen from '../screens/restaurant/profile/AboutScreen';
import RestaurantLocationScreen from '../screens/restaurant/profile/RestaurantLocationScreen';
import ThemeSettingsScreen from '../screens/restaurant/profile/ThemeSettingsScreen';

// Profile screens
import EditProfileScreen from '../screens/customer/Profile/EditProfileScreen';
import FavoriteRestaurants from '../screens/customer/Profile/FavoriteRestaurants';
import PaymentScreen from '../screens/customer/Profile/PaymentScreen';
import LanguageScreen from '../screens/customer/Profile/LanguageScreen';
import ProfileEditScreen from '../screens/restaurant/profile/ProfileEditScreen';
import AddressScreen from '../screens/customer/Profile/AddressScreen';

// Data & theme
import { OnboardingSlides } from '@/src/utils/onboardingData';
import { useAppTheme, useAppNavigationTheme } from '../config/theme';
import OrderHistoryScreen from '../screens/restaurant/orders/OrderHistoryScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

// Screen option presets - moved outside component to prevent recreation
const createScreenOptions = (colors: any, t: any) => ({
  default: {
    headerShown: false,
    gestureEnabled: true,
    animation: 'slide_from_right' as const,
    contentStyle: { backgroundColor: colors.background },
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
    contentStyle: { backgroundColor: colors.background },
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
    contentStyle: { backgroundColor: colors.background },
    headerTintColor: colors.text,
  },
  profileCard: {
    presentation: 'card' as const,
    headerShown: true,
    headerTitleAlign: 'center' as const,
    animation: 'slide_from_right' as const,
    headerShadowVisible: false,
    contentStyle: { backgroundColor: colors.background },
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
    contentStyle: { backgroundColor: colors.background },
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

  // App store actions
  const { completeOnboarding, setUserType } = useAppStore();

  useEffect(() => {
    if (authUserType && authUserType !== appUserType) {
      setUserType(authUserType);
    }
  }, [authUserType, appUserType, setUserType]);

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
    console.log('Deep link received:', url);
  }, []);

  // Stable onboarding handlers
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

  // Memoized screen options
  const screenOptions = useMemo(() => {
    return createScreenOptions(theme.colors, t);
  }, [theme.colors, t]);

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
            {(props) => (
              <AuthNavigator {...props} userType={userType && 'customer'} />
            )}
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
              component={NotificationsScreen}
              options={{ headerTitle: t('notifications') }}
            />
          </Stack.Group>

          {/* FullScreen */}
          <Stack.Screen
            name="SearchScreen"
            component={SearchScreen}
            options={screenOptions.fullScreen}
          />

          {/* Card Screens */}
          <Stack.Group screenOptions={screenOptions.card}>
            <Stack.Screen
              name="RestaurantOrderHistory"
              component={OrderHistoryScreen}
              options={{ headerTitle: 'Order History' }}
            />
            <Stack.Screen
              name="FoodDetails"
              component={FoodDetailsScreen}
              options={{ headerTitle: '', headerTransparent: true }}
            />
            <Stack.Screen
              name="RestaurantDetails"
              component={RestaurantDetailScreen}
              options={{ headerTitle: '', headerTransparent: true }}
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

            {/* Restaurant screens */}
            <Stack.Screen
              name="RestaurantOrderDetails"
              component={OrderDetailsScreen}
              options={{ headerTitle: t('order_details') }}
            />
            <Stack.Screen
              name="RestaurantBestSellers"
              component={BestSellers}
              options={{ headerTitle: t('best_sellers') }}
            />
            <Stack.Screen
              name="RestaurantTimeHeatmap"
              component={TimeHeatmap}
              options={{ headerTitle: t('time_heatmap') }}
            />
            <Stack.Screen
              name="RestaurantCategoriesManager"
              component={FoodCategoriesScreen}
              options={{ headerTitle: t('categories') }}
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
              options={{ headerTitle: t('menu_item') }}
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
              name="PaymentMethods"
              component={PaymentScreen}
              options={{ headerTitle: t('payment_methods') }}
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
                contentStyle: { marginTop: -34 },
              }}
            />
            <Stack.Screen
              name="RestaurantProfile"
              component={ProfileScreen}
              options={{
                headerTitle: t('restaurant_profile'),
                contentStyle: { marginTop: -34 },
              }}
            />
            <Stack.Screen
              name="RestaurantLocation"
              component={RestaurantLocationScreen}
              options={{
                headerTitle: t('restaurant_location'),
                contentStyle: { marginTop: -34 },
              }}
            />
            <Stack.Screen
              name="RestaurantThemeSettings"
              component={ThemeSettingsScreen}
              options={{
                headerTitle: t('theme_language_settings'),
                contentStyle: { marginTop: -34 },
              }}
            />
            <Stack.Screen
              name="RestaurantSettings"
              component={AccountSettingsScreen}
              options={{
                headerTitle: t('settings'),
                contentStyle: { marginTop: -34 },
              }}
            />
            <Stack.Screen
              name="RestaurantSupport"
              component={SupportScreen}
              options={{
                headerTitle: t('support'),
                contentStyle: { marginTop: -34 },
              }}
            />
            <Stack.Screen
              name="RestaurantAbout"
              component={AboutScreen}
              options={{
                headerTitle: t('about'),
                contentStyle: { marginTop: -34 },
              }}
            />
            <Stack.Screen
              name="RestaurantPaymentBilling"
              component={PaymentBillingScreen}
              options={{
                headerTitle: t('payment_billing'),
                contentStyle: { marginTop: -34 },
              }}
            />
            <Stack.Screen
              name="RestaurantNotifications"
              component={NotificationsList}
              options={{
                headerTitle: t('notifications'),
                contentStyle: { marginTop: -34 },
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
              contentStyle: { marginTop: -34 },
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
