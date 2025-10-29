/**
 * App Reset Utilities
 *
 * Provides centralized functions for resetting app state during logout
 * or when switching between user types.
 */

import { reset } from '../navigation/navigationHelpers';
import TokenManager from '../services/shared/tokenManager';
import { useCartStore } from '../stores/customerStores/cartStore';
import { useAppStore } from '../stores/AppStore';
import { useAuthStore } from '../stores/AuthStore';

/**
 * Performs a complete app reset including all stores and navigation
 * This is the recommended way to logout users or switch user types
 */
export const performCompleteAppReset = async (options?: {
  preserveOnboarding?: boolean;
  preserveTheme?: boolean;
  navigateToAuth?: boolean;
}) => {
  const { preserveOnboarding = true, navigateToAuth = true } = options || {};

  try {
    // Clear tokens from storage
    await TokenManager.clearAllTokens();

    // Clear cart store
    useCartStore.getState().clearCart();

    // Reset app store with options
    const appStore = useAppStore.getState();
    const isOnboardingComplete = appStore.isOnboardingComplete;
    appStore.resetApp();

    if (preserveOnboarding && isOnboardingComplete) {
      appStore.completeOnboarding();
    }

    // Reset auth store
    const authStore = useAuthStore.getState();
    authStore.resetAuth();

    // Navigate to user type selection screen if requested
    if (navigateToAuth) {
      reset('UserTypeSelection');
    }

    return { success: true };
  } catch (error) {
    console.error('Error during app reset:', error);

    // Try to at least clear what we can
    try {
      useCartStore.getState().clearCart();
    } catch (cartError) {
      console.error('Error clearing cart during fallback reset:', cartError);
    }

    if (navigateToAuth) {
      reset('UserTypeSelection');
    }

    return { success: false, error };
  }
};

/**
 * Switches between user types (customer/restaurant)
 * Clears relevant state but preserves authentication
 */
export const switchUserType = async (
  newUserType: 'customer' | 'restaurant',
) => {
  try {
    // Clear cart since it's user-type specific
    useCartStore.getState().clearCart();

    // Update user type in app store
    useAppStore.getState().setUserType(newUserType);

    // Navigate to appropriate app
    const targetRoute =
      newUserType === 'customer' ? 'CustomerApp' : 'RestaurantApp';
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
    await TokenManager.clearAllTokens();

    // Clear cart
    useCartStore.getState().clearCart();

    // Reset only auth state
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
      preserveTheme: false,
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
