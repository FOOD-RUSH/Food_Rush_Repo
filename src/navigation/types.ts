// Updated types.ts - Moving full-screen screens to RootStack
import {
  NavigatorScreenParams,
  CompositeScreenProps,
} from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';

// Root Stack - Screens that should NOT show tabs (full-screen)
export type RootStackParamList = {
  // Core app flow screens
  Onboarding: undefined;
  UserTypeSelection: undefined;
  Auth: NavigatorScreenParams<AuthStackParamList>;
  CustomerApp: NavigatorScreenParams<CustomerTabParamList>;
  RestaurantApp: NavigatorScreenParams<RestaurantTabParamList>;

  Cart: undefined; // Full-screen modal/screens (NO TABS) - These are the screens you mentioned

  Checkout: { cartId?: string };
  OrderTracking: { orderId: string };
  FoodDetails: { foodId: string };
  RestaurantDetails: { restaurantId: string };
  Notifications: undefined;
  Category: { categoryId: string };
  SearchScreen: {
    category?: string;
    categoryId?: string;
    type: 'search' | 'category';
  };
  CategoryMenu: {
    categoryTitle: string;
  };
  // profile screens
  EditProfile: undefined;
  ProfileDetails: undefined;
  AddressScreen: undefined;
  PaymentMethods: undefined;
  AddPayment: { paymentId?: string };
  PaymentProcessing: {
    orderId: string;
    amount: number;
    paymentMethod: 'mobile_money' | 'cash';
    provider?: 'mtn' | 'orange';
  };
  Settings: undefined;
  Help: NavigatorScreenParams<CustomerHelpCenterStackParamList>;
  About: undefined;
  FavoriteRestaurantScreen: undefined;
  LanguageScreen: undefined;
  NearbyRestaurants: undefined;
  OrderReceipt: { orderId: string };

  // Restaurant full-screen screens (NO TABS)
  RestaurantOrderDetails: { orderId: string };
  RestaurantOrderActions: { orderId: string };
  RestaurantConfirmOrder: { orderId: string };
  RestaurantRejectOrder: { orderId: string };
  RestaurantMenuItemForm: { itemId?: string };
  RestaurantEditFoodItem: { menuId: string };

  RestaurantTimeHeatmap: undefined;
  RestaurantNotificationDetails: { notificationId: string };
  RestaurantNotifications: undefined;
  RestaurantProfile: undefined;
  RestaurantLocation: undefined;
  RestaurantThemeSettings: undefined;
  RestaurantSupport: undefined;
  RestaurantAbout: undefined;
  RestaurantEditProfile: undefined;
  RestaurantOrderHistory: undefined;
  RestaurantPayments: undefined;

  RestaurantReview: {
    restaurantId?: string;
    restaurantName?: string;
    restaurantImage?: string;
  };
  RestaurantReviews: {
    restaurantId: string;
    restaurantName: string;
  };
  RestaurantCustomerReviews: {
    restaurantId: string;
    restaurantName: string;
  };
};

// Auth Stack (unchanged)
export type AuthStackParamList = {
  SignIn: { userType?: 'customer' | 'restaurant' } | undefined;
  SignUp: { userType?: 'customer' | 'restaurant' } | undefined;
  RestaurantSignupStep1: undefined;
  RestaurantSignupStep2: {
    step1Data: {
      email: string;
      fullName: string;
      phoneNumber: string;
      password: string;
      confirmPassword: string;
    };
  };
  ForgotPassword: undefined;
  OTPVerification: {
    email: string;
    phone: string;
    type: 'email' | 'phone' | 'reset_password';
    userId: string;
    userType: 'customer' | 'restaurant';
  };
  ResetPassword: { email: string };
  AwaitingApproval: {
    restaurantId?: string;
    userId?: string;
  };
};

// Customer Tab Navigator - Only core tab screens
export type CustomerTabParamList = {
  Home: NavigatorScreenParams<CustomerHomeStackParamList>;
  Orders: NavigatorScreenParams<CustomerOrderStackParamList>;
  Profile: NavigatorScreenParams<CustomerProfileStackParamList>;
};

// Customer Home Stack - Only screens that should show tabs
export type CustomerHomeStackParamList = {
  HomeScreen: undefined;

  // Removed: Cart, FoodDetails, RestaurantDetails, SearchScreen, etc.
  // These are now in RootStack
};

export type CustomerOrderStackParamList = {
  CompletedOrdersScreen: undefined;
  PendingOrdersScreen: undefined;
  OrderDetails: { orderId: string };
  OrderConfirmation: {
    status?: 'CONFIRMED' | 'CANCELLED' | string;
  };
};

export type CustomerProfileStackParamList = {
  ProfileHome: undefined;
  ProfileDetails: undefined;
};

export type CustomerHelpCenterStackParamList = {
  FAQ: undefined;
  ContactUs: undefined;
};

// Restaurant types - Updated with new structure
export type RestaurantTabParamList = {
  Orders: NavigatorScreenParams<RestaurantOrdersStackParamList>;
  Menu: NavigatorScreenParams<RestaurantMenuStackParamList>;
  Analytics: NavigatorScreenParams<RestaurantAnalyticsStackParamList>;
  Account: NavigatorScreenParams<RestaurantAccountStackParamList>;
};

// Restaurant Tab Stacks - Only screens that should show tabs
export type RestaurantOrdersStackParamList = {
  OrdersList: undefined;
};

export type RestaurantMenuStackParamList = {
  MenuItemsList: undefined;
};

export type RestaurantAnalyticsStackParamList = {
  AnalyticsOverview: undefined;
};

export type RestaurantAccountStackParamList = {
  AccountHome: undefined;
};

// Navigation Prop Types
export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type AuthStackScreenProps<T extends keyof AuthStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<AuthStackParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

export type CustomerTabScreenProps<T extends keyof CustomerTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<CustomerTabParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

export type RestaurantTabScreenProps<T extends keyof RestaurantTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<RestaurantTabParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

export type CustomerHomeStackScreenProps<
  T extends keyof CustomerHomeStackParamList,
> = CompositeScreenProps<
  NativeStackScreenProps<CustomerHomeStackParamList, T>,
  CustomerTabScreenProps<'Home'>
>;

export type CustomerOrderScreenProps<
  T extends keyof CustomerOrderStackParamList,
> = CompositeScreenProps<
  MaterialTopTabScreenProps<CustomerOrderStackParamList, T>,
  CustomerTabScreenProps<'Orders'>
>;

export type CustomerProfileStackScreenProps<
  T extends keyof CustomerProfileStackParamList,
> = CompositeScreenProps<
  NativeStackScreenProps<CustomerProfileStackParamList, T>,
  CustomerTabScreenProps<'Profile'>
>;

export type CustomerHelpCenterStackScreenProps<
  T extends keyof CustomerHelpCenterStackParamList,
> = CompositeScreenProps<
  MaterialTopTabScreenProps<CustomerHelpCenterStackParamList, T>,
  RootStackScreenProps<'Help'>
>;

export type RestaurantOrdersStackScreenProps<
  T extends keyof RestaurantOrdersStackParamList,
> = CompositeScreenProps<
  NativeStackScreenProps<RestaurantOrdersStackParamList, T>,
  RestaurantTabScreenProps<'Orders'>
>;

export type RestaurantMenuStackScreenProps<
  T extends keyof RestaurantMenuStackParamList,
> = CompositeScreenProps<
  NativeStackScreenProps<RestaurantMenuStackParamList, T>,
  RestaurantTabScreenProps<'Menu'>
>;

export type RestaurantAnalyticsStackScreenProps<
  T extends keyof RestaurantAnalyticsStackParamList,
> = CompositeScreenProps<
  NativeStackScreenProps<RestaurantAnalyticsStackParamList, T>,
  RestaurantTabScreenProps<'Analytics'>
>;

export type RestaurantAccountStackScreenProps<
  T extends keyof RestaurantAccountStackParamList,
> = CompositeScreenProps<
  NativeStackScreenProps<RestaurantAccountStackParamList, T>,
  RestaurantTabScreenProps<'Account'>
>;

// Core app flow screen props
export type OnboardingScreenProps = RootStackScreenProps<'Onboarding'>;
export type UserTypeSelectionScreenProps =
  RootStackScreenProps<'UserTypeSelection'>;

// User type enum
export type UserType = 'customer' | 'restaurant';

// Global navigation state
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
// Shared user type
export interface User {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  restaurantName: string;
  address?: string;
  bio?: string;
  website?: string;
  cuisine?: string;
}
