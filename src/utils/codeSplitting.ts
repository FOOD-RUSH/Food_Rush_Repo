import { lazy } from 'react';

/**
 * Code splitting utilities for customer vs restaurant apps
 * This helps reduce bundle size by only loading relevant code
 */

// Customer App Lazy Imports
export const CustomerLazyComponents = {
  // Home screens
  HomeScreen: lazy(() => import('@/src/screens/customer/home/HomeScreen')),
  RestaurantDetailScreen: lazy(
    () => import('@/src/screens/customer/home/RestaurantDetailScreen'),
  ),
  RestaurantReviewsScreen: lazy(
    () => import('@/src/screens/customer/home/RestaurantReviewsScreen'),
  ),
  FoodDetailsScreen: lazy(
    () => import('@/src/screens/customer/home/FoodDetailsScreen'),
  ),
  CartScreen: lazy(() => import('@/src/screens/customer/home/CartScreen')),
  CheckOutScreen: lazy(
    () => import('@/src/screens/customer/home/CheckOutScreen'),
  ),
  SearchScreen: lazy(() => import('@/src/screens/customer/home/SearchScreen')),
  CategoryMenuScreen: lazy(
    () => import('@/src/screens/customer/home/CategoryMenuScreen'),
  ),
  NearbyRestaurantsScreen: lazy(
    () => import('@/src/screens/customer/home/NearbyRestaurantsScreen'),
  ),

  // Order screens
  OrderTrackingScreen: lazy(
    () => import('@/src/screens/customer/Order/OrderTrackingScreen'),
  ),
  OrderReceiptScreen: lazy(
    () => import('@/src/screens/customer/Order/OrderReceiptScreen'),
  ),

  // Profile screens
  ProfileHomeScreen: lazy(
    () => import('@/src/screens/customer/Profile/ProfileHomeScreen'),
  ),
  ProfileDetailsScreen: lazy(
    () => import('@/src/screens/customer/Profile/ProfileDetailsScreen'),
  ),
  EditProfileScreen: lazy(
    () => import('@/src/screens/customer/Profile/EditProfileScreen'),
  ),
  AddressScreen: lazy(
    () => import('@/src/screens/customer/Profile/AddressScreen'),
  ),
  PaymentScreen: lazy(
    () => import('@/src/screens/customer/Profile/PaymentScreen'),
  ),
  FavoriteRestaurants: lazy(
    () => import('@/src/screens/customer/Profile/FavoriteRestaurants'),
  ),
  FAQ: lazy(() => import('@/src/screens/customer/Profile/FAQ')),
};

// Restaurant App Lazy Imports (only load if user is restaurant)
export const RestaurantLazyComponents = {
  // Orders
  OrderDetailsScreen: lazy(
    () => import('@/src/screens/restaurant/orders/OrderDetailsScreen'),
  ),

  // Menu
  AddFoodScreen: lazy(
    () => import('@/src/screens/restaurant/menu/AddFoodScreen'),
  ),
  EditFoodScreen: lazy(
    () => import('@/src/screens/restaurant/menu/EditFoodScreen'),
  ),

  // Profile
  ProfileEditScreen: lazy(
    () => import('@/src/screens/restaurant/account/ProfileEditScreen'),
  ),
  RestaurantSettingsScreen: lazy(
    () => import('@/src/screens/restaurant/account/RestaurantSettingsScreen'),
  ),
  AccountSettingsScreen: lazy(
    () => import('@/src/screens/restaurant/account/AccountSettingsScreen'),
  ),
  AboutScreen: lazy(
    () => import('@/src/screens/restaurant/account/AboutScreen'),
  ),
  SupportScreen: lazy(
    () => import('@/src/screens/restaurant/account/SupportScreen'),
  ),
  PaymentBillingScreen: lazy(
    () => import('@/src/screens/restaurant/account/PaymentBillingScreen'),
  ),
};

// Shared components that both apps use
export const SharedLazyComponents = {
  // Auth screens
  SignUpScreen: lazy(() => import('@/src/screens/auth/SignupScreen')),
  ForgotPasswordScreen: lazy(
    () => import('@/src/screens/auth/ForgotPasswordScreen'),
  ),
  ResetPasswordScreen: lazy(
    () => import('@/src/screens/auth/ResetPasswordScreen'),
  ),
};

/**
 * Dynamic import function that only loads components based on user type
 */
export const loadComponentByUserType = (
  userType: 'customer' | 'restaurant',
  componentName: string,
) => {
  if (userType === 'customer' && componentName in CustomerLazyComponents) {
    return CustomerLazyComponents[
      componentName as keyof typeof CustomerLazyComponents
    ];
  }

  if (userType === 'restaurant' && componentName in RestaurantLazyComponents) {
    return RestaurantLazyComponents[
      componentName as keyof typeof RestaurantLazyComponents
    ];
  }

  if (componentName in SharedLazyComponents) {
    return SharedLazyComponents[
      componentName as keyof typeof SharedLazyComponents
    ];
  }

  throw new Error(
    `Component ${componentName} not found for user type ${userType}`,
  );
};

/**
 * Preload critical components for faster navigation
 */
export const preloadCriticalComponents = (
  userType: 'customer' | 'restaurant',
) => {
  if (userType === 'customer') {
    // Preload most commonly used customer screens
    import('@/src/screens/customer/home/HomeScreen');
    import('@/src/screens/customer/home/RestaurantDetailScreen');
    import('@/src/screens/customer/home/CartScreen');
  } else if (userType === 'restaurant') {
    // Preload most commonly used restaurant screens
    import('@/src/screens/restaurant/orders/OrderDetailsScreen');
    import('@/src/screens/restaurant/menu/AddFoodScreen');
  }
};

/**
 * Bundle size estimation (for monitoring)
 */
export const ESTIMATED_BUNDLE_SIZES = {
  shared: '2.5MB',
  customer: '1.8MB',
  restaurant: '2.2MB',
  total: '6.5MB',
  optimized: {
    customerOnly: '4.3MB', // shared + customer
    restaurantOnly: '4.7MB', // shared + restaurant
    reduction: '34%',
  },
};

/**
 * Feature flags for progressive loading
 */
export const FEATURE_FLAGS = {
  enableLazyLoading: true,
  enableCodeSplitting: true,
  enablePreloading: true,
  enableBundleAnalysis: __DEV__,
};

/**
 * Performance monitoring for code splitting
 */
export const trackComponentLoad = (componentName: string, loadTime: number) => {
  if (__DEV__) {
    console.log(`Component ${componentName} loaded in ${loadTime}ms`);
  }

  // In production, you might send this to analytics
  // Analytics.track('component_load', { componentName, loadTime });
};
