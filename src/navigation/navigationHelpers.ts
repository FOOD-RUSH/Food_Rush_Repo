import { createNavigationContainerRef } from '@react-navigation/native';
import { RootStackParamList } from './types';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

// IMPORTANT: navigationRef should ONLY be used for navigation from:
// 1. Outside React components (services, utils, push notifications)

// 3. Global error handlers
// For component navigation, ALWAYS use the navigation prop or useNavigation hook

// Basic navigation functions - USE SPARINGLY
export function navigate<T extends keyof RootStackParamList>(
  name: T,
  params?: RootStackParamList[T],
) {
  if (navigationRef.isReady()) {
    if (params) {
      navigationRef.navigate(name, params);
    } else {
      navigationRef.navigate(name as any);
    }
  }
}

export function goBack() {
  if (navigationRef.isReady() && navigationRef.canGoBack()) {
    navigationRef.goBack();
  }
}

export function reset<T extends keyof RootStackParamList>(
  name: T,
  params?: RootStackParamList[T],
) {
  if (navigationRef.isReady()) {
    navigationRef.reset({
      index: 0,
      routes: [{ name, params }],
    });
  }
}

// Utility functions
export function getCurrentRoute() {
  if (navigationRef.isReady()) {
    return navigationRef.getCurrentRoute();
  }
  return null;
}

export function getCurrentRouteName() {
  if (navigationRef.isReady()) {
    return navigationRef.getCurrentRoute()?.name;
  }
  return null;
}

// Helper for programmatic navigation (use only when navigation prop is not available)
export function navigateFromService<T extends keyof RootStackParamList>(
  name: T,
  params?: RootStackParamList[T],
) {
  if (navigationRef.isReady()) {
    if (params) {
      navigationRef.navigate(name, params);
    } else {
      navigationRef.navigate(name as any);
    }
  } else {
    console.warn(
      'Navigation not ready. This should only be called from services/utils.',
    );
  }
}

// For push notifications, deep links, etc.
export function handleDeepLink(url: string) {
  // Parse URL and navigate accordingly
  console.log('Handling deep link:', url);

  try {
    const parsedUrl = new URL(url);
    const path = parsedUrl.pathname;
    const searchParams = new URLSearchParams(parsedUrl.search);

    // Core app flow deep links
    if (path === '/onboarding' || path.startsWith('/onboarding/')) {
      const stepParam = path.split('/')[2] || searchParams.get('step');
      const step = stepParam ? parseInt(stepParam, 10) : undefined;
      const skipWelcome = searchParams.get('skipWelcome') === 'true';

      navigateFromService('Onboarding', {
        step: step && !isNaN(step) ? step : undefined,
        skipWelcome,
      });
      return;
    }

    if (path === '/user-type-selection') {
      const fromOnboarding = searchParams.get('fromOnboarding') === 'true';
      const returnTo = searchParams.get('returnTo') as keyof RootStackParamList;

      navigateFromService('UserTypeSelection', {
        fromOnboarding,
        returnTo: returnTo || undefined,
      });
      return;
    }

    // Restaurant deep links
    if (path.startsWith('/restaurant/')) {
      const restaurantId = path.split('/')[2];
      if (restaurantId) {
        navigateFromService('RestaurantDetails', { restaurantId });
      }
      return;
    }

    // Food details deep links
    if (path.startsWith('/food/')) {
      const segments = path.split('/');
      const foodId = segments[2];
      const restaurantId = segments[4];
      if (foodId && restaurantId) {
        navigateFromService('FoodDetails', { foodId, restaurantId });
      }
      return;
    }

    // Order tracking deep links
    if (path.startsWith('/order/') && path.includes('/track')) {
      const orderId = path.split('/')[2];
      if (orderId) {
        navigateFromService('OrderTracking', { orderId });
      }
      return;
    }

    // Auth deep links
    if (
      path.startsWith('/auth/') ||
      path.startsWith('/signin') ||
      path.startsWith('/signup')
    ) {
      navigateFromService('Auth');
      return;
    }

    console.warn('Unhandled deep link path:', path);
  } catch (error) {
    console.error('Error parsing deep link:', error);
    // Fallback to home
    navigateFromService('CustomerApp');
  }
}

// Navigation actions for services (push notifications, etc.)
export const ServiceNavigation = {
  // Core app flow navigation
  startOnboarding: (step?: number, skipWelcome?: boolean) => {
    navigateFromService('Onboarding', { step, skipWelcome });
  },

  showUserTypeSelection: (
    fromOnboarding?: boolean,
    returnTo?: keyof RootStackParamList,
  ) => {
    navigateFromService('UserTypeSelection', { fromOnboarding, returnTo });
  },

  completeOnboarding: (userType: 'customer' | 'restaurant') => {
    // Navigate to auth with user type context
    navigateFromService('Auth');
  },

  // Order and cart actions
  goToOrderTracking: (orderId: string) => {
    navigateFromService('OrderTracking', { orderId });
  },

  goToNotifications: () => {
    navigateFromService('Notifications');
  },

  showCart: (fromScreen?: string) => {
    navigateFromService('Cart');
  },

  // App switching
  logout: () => {
    reset('Auth');
  },

  switchToCustomerApp: () => {
    reset('CustomerApp');
  },

  switchToRestaurantApp: () => {
    reset('RestaurantApp');
  },

  // Reset to onboarding (for account switching, etc.)
  resetToOnboarding: () => {
    reset('Onboarding');
  },

  resetToUserTypeSelection: () => {
    reset('UserTypeSelection');
  },
};

// Type-safe navigation helpers for components
// These should be used WITH the navigation prop, not instead of it
export const createNavigationHelpers = <T extends any>(navigation: T) => ({
  // Core app flow helpers
  goToOnboarding: (step?: number, skipWelcome?: boolean) => {
    (navigation as any).navigate('Onboarding', { step, skipWelcome });
  },

  goToUserTypeSelection: (
    fromOnboarding?: boolean,
    returnTo?: keyof RootStackParamList,
  ) => {
    (navigation as any).navigate('UserTypeSelection', {
      fromOnboarding,
      returnTo,
    });
  },

  goToAuth: () => {
    (navigation as any).navigate('Auth');
  },

  // Full-screen navigation helpers
  goToCart: () => {
    (navigation as any).navigate('Cart');
  },

  goToCheckout: (cartId?: string) => {
    (navigation as any).navigate('Checkout', { cartId });
  },

  goToOrderTracking: (orderId: string) => {
    (navigation as any).navigate('OrderTracking', { orderId });
  },

  goToFoodDetails: (foodId: string, restaurantId: string) => {
    (navigation as any).navigate('FoodDetails', { foodId, restaurantId });
  },

  goToRestaurantDetails: (restaurantId: string) => {
    (navigation as any).navigate('RestaurantDetails', { restaurantId });
  },

  goToNotifications: () => {
    (navigation as any).navigate('Notifications');
  },

  goToCategory: (categoryId: string) => {
    (navigation as any).navigate('Category', { categoryId });
  },

  goToSearch: () => {
    (navigation as any).navigate('SearchScreen');
  },

  goToSearchResults: (query?: string, filters?: any) => {
    (navigation as any).navigate('SearchResults', { query, filters });
  },

  goToFilters: () => {
    (navigation as any).navigate('FilterScreen');
  },

  goToFilterOptions: () => {
    (navigation as any).navigate('FilterOptions');
  },

  goToOrderSummary: () => {
    (navigation as any).navigate('OrderSummary');
  },

  // Tab navigation helpers
  goToHome: () => {
    (navigation as any).navigate('CustomerApp', {
      screen: 'Home',
      params: { screen: 'HomeScreen' },
    });
  },

  goToOrders: () => {
    (navigation as any).navigate('CustomerApp', {
      screen: 'Orders',
    });
  },

  goToOrderDetails: (orderId: string) => {
    (navigation as any).navigate('CustomerApp', {
      screen: 'Orders',
      params: {
        screen: 'OrderDetails',
        params: { orderId },
      },
    });
  },

  goToProfile: () => {
    (navigation as any).navigate('CustomerApp', {
      screen: 'Profile',
    });
  },
});

// Hook for navigation helpers (preferred approach)
export const useNavigationHelpers = () => {
  const navigation = navigationRef.current;

  if (!navigation) {
    throw new Error(
      'useNavigationHelpers must be used within NavigationContainer',
    );
  }

  return createNavigationHelpers(navigation);
};
