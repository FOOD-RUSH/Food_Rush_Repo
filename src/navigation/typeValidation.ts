/**
 * Navigation Type Validation
 *
 * This file serves as a type-checking utility to ensure all navigation types
 * are properly integrated and no TypeScript errors occur in navigation setup.
 */

import type {
  RootStackParamList,
  AuthStackParamList,
  CustomerTabParamList,
  RestaurantTabParamList,
  OnboardingScreenProps,
  UserTypeSelectionScreenProps,
  RootStackScreenProps,
  AuthStackScreenProps,
  CustomerTabScreenProps,
  RestaurantTabScreenProps,
} from './types';

import type { NavigationProp, RouteProp } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

// Type validation helpers
type AssertNavigationTypes = {
  // Root stack validation
  rootStackNavigationProp: NavigationProp<RootStackParamList>;
  rootStackRouteProp: RouteProp<RootStackParamList>;

  // Screen props validation
  onboardingProps: OnboardingScreenProps;
  userTypeSelectionProps: UserTypeSelectionScreenProps;
  authScreenProps: AuthStackScreenProps<'SignIn'>;
  customerTabProps: CustomerTabScreenProps<'Home'>;
  restaurantTabProps: RestaurantTabScreenProps<'Orders'>;

  // Specific screen validations
  onboardingRoute: RouteProp<RootStackParamList, 'Onboarding'>;
  userTypeSelectionRoute: RouteProp<RootStackParamList, 'UserTypeSelection'>;
  authRoute: RouteProp<RootStackParamList, 'Auth'>;
  customerAppRoute: RouteProp<RootStackParamList, 'CustomerApp'>;
  restaurantAppRoute: RouteProp<RootStackParamList, 'RestaurantApp'>;
};

// Parameter validation for onboarding screens
type OnboardingParams = RootStackParamList['Onboarding'];
type UserTypeSelectionParams = RootStackParamList['UserTypeSelection'];

// Ensure parameters are correctly typed
const validateOnboardingParams = (params?: OnboardingParams) => {
  if (params) {
    // These should all be valid without TypeScript errors
    const step: number | undefined = params.step;
    const skipWelcome: boolean | undefined = params.skipWelcome;
  }
};

const validateUserTypeSelectionParams = (params?: UserTypeSelectionParams) => {
  if (params) {
    // These should all be valid without TypeScript errors
    const fromOnboarding: boolean | undefined = params.fromOnboarding;
    const returnTo: keyof RootStackParamList | undefined = params.returnTo;
  }
};

// Deep linking URL pattern validation
type DeepLinkPatterns = {
  onboarding: '/onboarding' | '/onboarding/1' | '/onboarding/2';
  userTypeSelection: '/user-type-selection';
  auth: '/auth' | '/signin' | '/signup';
  restaurant: `/restaurant/${string}`;
  food: `/food/${string}/restaurant/${string}`;
  order: `/order/${string}/track`;
};

// Navigation helper type validation
type NavigationHelperTypes = {
  navigateToOnboarding: (step?: number, skipWelcome?: boolean) => void;
  navigateToUserTypeSelection: (
    fromOnboarding?: boolean,
    returnTo?: keyof RootStackParamList,
  ) => void;
  navigateToAuth: () => void;
  navigateToCustomerApp: () => void;
  navigateToRestaurantApp: () => void;
};

// Export type validation for use in components
export type ValidatedOnboardingScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Onboarding'
>;

export type ValidatedUserTypeSelectionScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'UserTypeSelection'
>;

// Utility type for components that need navigation helpers
export type NavigationHelpersType = NavigationHelperTypes;

// Type guard functions for runtime validation
export const isOnboardingParams = (params: any): params is OnboardingParams => {
  return (
    params === undefined ||
    (typeof params === 'object' &&
      (params.step === undefined || typeof params.step === 'number') &&
      (params.skipWelcome === undefined ||
        typeof params.skipWelcome === 'boolean'))
  );
};

export const isUserTypeSelectionParams = (
  params: any,
): params is UserTypeSelectionParams => {
  return (
    params === undefined ||
    (typeof params === 'object' &&
      (params.fromOnboarding === undefined ||
        typeof params.fromOnboarding === 'boolean') &&
      (params.returnTo === undefined || typeof params.returnTo === 'string'))
  );
};

// Export successful type validation
export const navigationTypesValidated = true;
