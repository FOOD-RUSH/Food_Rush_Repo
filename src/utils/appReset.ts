/**
 * App Reset Utilities
 * 
 * Provides centralized functions for resetting app state during logout
 * or when switching between user types.
 */

import { reset } from '../navigation/navigationHelpers';

/**
 * Performs a complete app reset including all stores and navigation
 * This is the recommended way to logout users or switch user types
 */
export const performCompleteAppReset = async (options?: {
  preserveOnboarding?: boolean;
  preserveUserTypeSelection?: boolean;
  navigateToAuth?: boolean;
}) => {
  const {
    preserveOnboarding = true,
    preserveUserTypeSelection = true,
    navigateToAuth = true,
  } = options || {};

  try {
    // Clear tokens from storage
    const TokenManager = (await import('../services/customer/tokenManager')).default;
    await TokenManager.clearAllTokens();

    // Clear cart store
    const { useCartStore } = await import('../stores/customerStores/cartStore');
    useCartStore.getState().clearCart();

    // Reset app store with options
    const { useAppStore } = await import('../stores/customerStores/AppStore');
    const appStore = useAppStore.getState();
    const isOnboardingComplete = appStore.isOnboardingComplete;
    appStore.resetApp();
    
    if (preserveOnboarding && isOnboardingComplete) {
      appStore.completeOnboarding();
    }

    // Reset auth store
    const { useAuthStore } = await import('../stores/customerStores/AuthStore');
    const authStore = useAuthStore.getState();
    const selectedUserType = authStore.selectedUserType;
    
    authStore.resetAuth();
    
    if (preserveUserTypeSelection && selectedUserType) {
      authStore.setSelectedUserType(selectedUserType);
    }

    // Navigate to auth screen if requested
    if (navigateToAuth) {
      reset('Auth');
    }

    return { success: true };
  } catch (error) {
    console.error('Error during app reset:', error);
    
    // Try to at least clear what we can
    try {
      const { useCartStore } = await import('../stores/customerStores/cartStore');
      useCartStore.getState().clearCart();
    } catch (cartError) {
      console.error('Error clearing cart during fallback reset:', cartError);
    }

    if (navigateToAuth) {
      reset('Auth');
    }

    return { success: false, error };
  }
};

/**
 * Switches between user types (customer/restaurant)
 * Clears relevant state but preserves authentication
 */
export const switchUserType = async (newUserType: 'customer' | 'restaurant') => {
  try {
    // Clear cart since it's user-type specific
    const { useCartStore } = await import('../stores/customerStores/cartStore');
    useCartStore.getState().clearCart();

    // Update user type in both stores
    const { useAppStore } = await import('../stores/customerStores/AppStore');
    const { useAuthStore } = await import('../stores/customerStores/AuthStore');
    
    useAppStore.getState().setUserType(newUserType);
    useAuthStore.getState().setSelectedUserType(newUserType);

    // Navigate to appropriate app
    const targetRoute = newUserType === 'customer' ? 'CustomerApp' : 'RestaurantApp';
    reset(targetRoute);

    return { success: true };
  } catch (error) {
    console.error('Error switching user type:', error);
    return { success: false, error };
  }
};

/**
 * Clears only session data (for temporary logout)
 * Preserves user preferences and onboarding state
 */
export const clearSessionData = async () => {
  try {
    // Clear tokens
    const TokenManager = (await import('../services/customer/tokenManager')).default;
    await TokenManager.clearAllTokens();

    // Clear cart
    const { useCartStore } = await import('../stores/customerStores/cartStore');
    useCartStore.getState().clearCart();

    // Reset only auth state
    const { useAuthStore } = await import('../stores/customerStores/AuthStore');
    useAuthStore.getState().resetAuth();

    return { success: true };
  } catch (error) {
    console.error('Error clearing session data:', error);
    return { success: false, error };
  }
};

/**
 * Emergency reset - clears everything including onboarding
 * Use only when app is in an unrecoverable state
 */
export const performEmergencyReset = async () => {
  try {
    await performCompleteAppReset({
      preserveOnboarding: false,
      preserveUserTypeSelection: false,
      navigateToAuth: true,
    });

    // Clear any additional storage if needed
    // This could include clearing AsyncStorage completely in extreme cases
    
    return { success: true };
  } catch (error) {
    console.error('Error during emergency reset:', error);
    return { success: false, error };
  }
};