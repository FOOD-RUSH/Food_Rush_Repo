import React, { useCallback, useMemo } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { Linking, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { MaterialIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

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
import CustomerNavigator, { CustomerHelpCenterStackScreen } from './CustomerNavigator';
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
import NotificationsScreen from '../screens/restaurant/profile/NotificationsScreen';
import FoodDetailsScreen from '../screens/customer/home/FoodDetailsScreen';
import RestaurantDetailScreen from '../screens/customer/home/RestaurantDetailScreen';
import NearbyRestaurantsScreen from '../screens/customer/home/NearbyRestaurantsScreen';

// Restaurant full-screen screens
import OrderDetailsScreen from '../screens/restaurant/orders/OrderDetailsScreen';
import ConfirmOrder from '../screens/restaurant/orders/ConfirmOrder';
import RejectOrder from '../screens/restaurant/orders/RejectOrder';
import {AddFoodScreen} from '../screens/restaurant/menu/AddFoodScreen';
import {EditFoodScreen} from '../screens/restaurant/menu/EditFoodScreen';
import FoodCategoriesScreen from '../screens/restaurant/menu/FoodCategoriesScreen';
import AddCategoryScreen from '../screens/restaurant/menu/AddCategoryScreen';
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

// Screen option presets
const createScreenOptions = (colors: any, t: any) => ({
  default: {
    headerShown: false,
    gestureEnabled: true,
    animation: 'slide_from_right' as const,
    contentStyle: { backgroundColor: colors.background },
    headerStyle: { backgroundColor: colors.card, elevation: 0, shadowOpacity: 0 },
    headerTintColor: colors.text,
  },
  modal: {
    presentation: 'modal' as const,
    headerShown: true,
    animation: 'slide_from_bottom' as const,
    gestureDirection: 'vertical' as const,
    contentStyle: { backgroundColor: colors.background },
    headerStyle: { backgroundColor: colors.card, elevation: 0, shadowOpacity: 0 },
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
    headerStyle: { backgroundColor: colors.card, elevation: 0, shadowOpacity: 0 },
    headerTintColor: colors.text,
  },
  checkout: {
    headerShown: true,
    headerTitleAlign: 'center' as const,
    animation: 'slide_from_right' as const,
    contentStyle: { backgroundColor: colors.background },
    headerStyle: { backgroundColor: colors.card, elevation: 0, shadowOpacity: 0 },
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
  const isAuthenticated = useIsAuthenticated();
  const hasHydrated = useHasHydrated();
  const isOnboardingComplete = useOnboardingComplete();
  const userType = useAppUserType(); // 👈 from AppStore
  const user = useAuthUser(); // 👈 from AuthStore

  const themeMode = useAppStore((state) => state.theme);
  const { t } = useTranslation('translation');

  // Cart
  const clearCart = useCartStore((state) => state.clearCart);
  const cartItems = useCartStore((state) => state.items);

  // App store actions
  const { completeOnboarding, setUserType } = useAppStore();

  // Theme
  const theme = useAppTheme(themeMode);
  const navigationTheme = useAppNavigationTheme();

  const screenOptions = useMemo(() => createScreenOptions(theme.colors, t), [theme.colors, t]);

  const handleClearCart = useCallback(() => {
    if (cartItems.length === 0) {
      Toast.show({ type: 'info', text1: t('info'), text2: t('cart_empty'), position: 'bottom' });
      return;
    }
    clearCart();
    Toast.show({ type: 'success', text1: t('success'), text2: t('cart_cleared_successfully'), position: 'top' });
  }, [cartItems.length, clearCart, t]);

  const cartScreenOptions = useMemo(
    () => ({
      headerTitle: t('my_cart'),
      headerBackTitleVisible: false,
      headerRight: () => (
        <TouchableOpacity onPress={handleClearCart} style={{ marginRight: 16 }}>
          <MaterialIcons name="delete-forever" size={24} color={navigationTheme.colors.notification} />
        </TouchableOpacity>
      ),
    }),
    [t, handleClearCart, navigationTheme.colors.notification],
  );

  const handleOnboardingComplete = useCallback(
    (selectedUserType: 'customer' | 'restaurant') => {
      console.log('Onboarding complete with userType:', selectedUserType);
      setUserType(selectedUserType);
      completeOnboarding();
    },
    [completeOnboarding, setUserType],
  );

  const handleUserTypeSelection = useCallback(
    (selectedUserType: 'customer' | 'restaurant') => {
      console.log('User type selected in RootNavigator:', selectedUserType);
      setUserType(selectedUserType);
    },
    [setUserType],
  );

  const handleNavigationReady = useCallback(() => {
    const subscription = Linking.addEventListener('url', ({ url }) => handleDeepLink(url));
    return () => subscription?.remove();
  }, []);

  // 🔥 FIXED: Initial route decision with proper user type flow
  const getInitialRouteName = useCallback((): keyof RootStackParamList => {
    console.log('🔍 getInitialRouteName - isAuthenticated:', isAuthenticated, 'userType:', userType);
    
    // If not authenticated, ALWAYS show user type selection first
    // This ensures users can choose their type even if there's a cached value
    if (!isAuthenticated) {
      console.log('❌ Not authenticated → UserTypeSelection (allowing user to choose)');
      return 'RestaurantApp';
    }

    // User is authenticated, route based on userType and verification status
    switch (userType) {
      case 'customer':
        console.log('✅ Authenticated customer → CustomerApp');
        return 'CustomerApp';
        
      case 'restaurant':
        const verificationStatus = user?.verificationStatus || user?.restaurant?.verificationStatus;
        console.log('🏪 Restaurant verification status:', verificationStatus);
        
        if (verificationStatus === 'PENDING_VERIFICATION' || verificationStatus === 'PENDING') {
          console.log('⏳ Restaurant pending verification → Auth (AwaitingApproval)');
          return 'Auth';
        }
        console.log('✅ Authenticated restaurant → RestaurantApp');
        return 'RestaurantApp';
        
      default:
        console.log('❓ Unknown userType → UserTypeSelection');
        return 'UserTypeSelection';
    }
  }, [isAuthenticated, userType, user]);

  // Wait until hydration
  if (!hasHydrated) return <LoadingScreen />;

  // Show onboarding first
  if (!isOnboardingComplete) {
    return (
      <>
        <StatusBar style="auto" />
        <OnboardingScreen
          OnboardingSlides={OnboardingSlides}
          onComplete={handleOnboardingComplete}
          onLogin={handleUserTypeSelection}
        />
      </>
    );
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
        <Stack.Navigator initialRouteName={getInitialRouteName()} screenOptions={screenOptions.default}>
          {/* UserType selection - FIXED: Remove gestureEnabled: false to allow back navigation */}
          <Stack.Screen name="UserTypeSelection" options={{ headerShown: false }}>
            {(props) => <UserTypeSelectionScreen {...props} onUserTypeSelect={handleUserTypeSelection} />}
          </Stack.Screen>

          {/* Auth (customer & restaurant handled inside AuthNavigator) */}
          <Stack.Screen name="Auth" component={AuthNavigator} options={{ headerShown: false }} />

          {/* Main apps */}
          <Stack.Screen name="CustomerApp" component={CustomerNavigator} options={{ headerShown: false }} />
          <Stack.Screen name="RestaurantApp" component={RestaurantNavigator} options={{ headerShown: false }} />

          {/* Modals */}
          <Stack.Group screenOptions={screenOptions.modal}>
            <Stack.Screen name="Cart" component={CartScreen} options={cartScreenOptions} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ headerTitle: t('notifications') }} />
          </Stack.Group>

          {/* FullScreen */}
          <Stack.Screen name="SearchScreen" component={SearchScreen} options={screenOptions.fullScreen} />

          {/* Card Screens */}
          <Stack.Group screenOptions={screenOptions.card}>
            <Stack.Screen name='RestaurantOrderHistory' component={OrderHistoryScreen} options={{headerTitle: "Order History", }} />
            <Stack.Screen name="FoodDetails" component={FoodDetailsScreen} options={{ headerTitle: '', headerTransparent: true }} />
            <Stack.Screen name="RestaurantDetails" component={RestaurantDetailScreen} options={{ headerTitle: '', headerTransparent: true }} />
            <Stack.Screen name="AddressScreen" component={AddressScreen} options={{ headerTitle: t('address') }} />
            <Stack.Screen name="NearbyRestaurants" component={NearbyRestaurantsScreen} options={{ headerTitle: t('restaurants_near_you') }} />
            
            {/* Restaurant full-screen screens */}
            <Stack.Screen name="RestaurantOrderDetails" component={OrderDetailsScreen} options={{ headerTitle: t('order_details') }} />
            <Stack.Screen name="RestaurantBestSellers" component={BestSellers} options={{ headerTitle: t('best_sellers') }} />
            <Stack.Screen name="RestaurantTimeHeatmap" component={TimeHeatmap} options={{ headerTitle: t('time_heatmap') }} />
            <Stack.Screen name="RestaurantCategoriesManager" component={FoodCategoriesScreen} options={{ headerTitle: t('categories') }} />
          </Stack.Group>
          
          {/* Restaurant Modals */}
          <Stack.Group screenOptions={screenOptions.modal}>
            <Stack.Screen name="RestaurantConfirmOrder" component={ConfirmOrder} options={{ headerTitle: t('confirm_order') }} />
            <Stack.Screen name="RestaurantRejectOrder" component={RejectOrder} options={{ headerTitle: t('reject_order') }} />
            <Stack.Screen name="RestaurantMenuItemForm" component={AddFoodScreen} options={{ headerTitle: t('menu_item') }} />
            <Stack.Screen name="RestaurantAddCategory" component={AddCategoryScreen} options={{ headerTitle: t('add_category') }} />
            <Stack.Screen name="RestaurantEditCategory" component={AddCategoryScreen} options={{ headerTitle: t('edit_category') }} />
          </Stack.Group>

          {/* Profile */}
          <Stack.Group screenOptions={screenOptions.profileCard}>
            <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ headerTitle: t('edit_profile') }} />
            <Stack.Screen name="Help" component={CustomerHelpCenterStackScreen} options={{ headerTitle: t('help_center') }} />
            <Stack.Screen name="FavoriteRestaurantScreen" component={FavoriteRestaurants} options={{ headerTitle: t('favorite_restaurants') }} />
            <Stack.Screen name="PaymentMethods" component={PaymentScreen} options={{ headerTitle: t('payment_methods') }} />
            <Stack.Screen name="LanguageScreen" component={LanguageScreen} options={{ headerTitle: t('language_settings') }} />
            
            {/* Restaurant profile screens */}
            <Stack.Screen name='RestaurantEditProfile' component={ProfileEditScreen} options ={{headerTitle: t('edit_profile')}} />
            <Stack.Screen name="RestaurantProfile" component={ProfileScreen} options={{ headerTitle: t('restaurant_profile') }} />
            <Stack.Screen name="RestaurantLocation" component={RestaurantLocationScreen} options={{ headerTitle: t('restaurant_location') }} />
            <Stack.Screen name="RestaurantThemeSettings" component={ThemeSettingsScreen} options={{ headerTitle: t('theme_language_settings') }} />
            <Stack.Screen name="RestaurantSettings" component={AccountSettingsScreen} options={{ headerTitle: t('settings') }} />
            <Stack.Screen name="RestaurantSupport" component={SupportScreen} options={{ headerTitle: t('support') }} />
            <Stack.Screen name="RestaurantAbout" component={AboutScreen} options={{ headerTitle: t('about') }} />
            <Stack.Screen name="RestaurantPaymentBilling" component={PaymentBillingScreen} options={{ headerTitle: t('payment_billing') }} />
            <Stack.Screen name="RestaurantNotifications" component={NotificationsScreen} options={{ headerTitle: t('notifications') }} />
          </Stack.Group>


          {/* Checkout */}
          <Stack.Screen
            name="Checkout"
            component={CheckOutScreen}
            options={{ ...screenOptions.checkout, headerTitle: t('checkout_order'), contentStyle: { marginTop: -34 } }}
          />

          {/* Order Receipt */}
          <Stack.Screen name="OrderReceipt" component={OrderReceiptScreen} options={{ ...screenOptions.fullScreen, headerTitle: t('order_receipt') }} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default RootNavigator;
