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
    navigationRef.navigate(name, params);
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
    navigationRef.navigate(name, params);
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

  // Example implementation
  const parsedUrl = new URL(url);
  const path = parsedUrl.pathname;

  if (path.startsWith('/restaurant/')) {
    const restaurantId = path.split('/')[2];
    if (restaurantId) {
      navigateFromService('RestaurantDetails', { restaurantId });
    }
  } else if (path.startsWith('/food/')) {
    const segments = path.split('/');
    const foodId = segments[2];
    const restaurantId = segments[4];
    if (foodId && restaurantId) {
      navigateFromService('FoodDetails', { foodId, restaurantId });
    }
  }
  // Add more deep link handlers as needed
}

// Navigation actions for services (push notifications, etc.)
export const ServiceNavigation = {
  goToOrderTracking: (orderId: string) => {
    navigateFromService('OrderTracking', { orderId });
  },

  goToNotifications: () => {
    navigateFromService('Notifications');
  },

  showCart: (fromScreen?: string) => {
    navigateFromService('Cart', { fromScreen });
  },

  logout: () => {
    reset('Auth');
  },

  switchToCustomerApp: () => {
    reset('CustomerApp');
  },

  switchToRestaurantApp: () => {
    reset('RestaurantApp');
  },
};

// Type-safe navigation helpers for components
// These should be used WITH the navigation prop, not instead of it
export const createNavigationHelpers = <T extends any>(navigation: T) => ({
  // Full-screen navigation helpers
  goToCart: (fromScreen?: string) => {
    (navigation as any).navigate('Cart', { fromScreen });
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
