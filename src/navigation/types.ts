
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
  Onboarding: undefined;
  Auth: NavigatorScreenParams<AuthStackParamList>;
  CustomerApp: NavigatorScreenParams<CustomerTabParamList>;
  RestaurantApp: NavigatorScreenParams<RestaurantTabParamList>;

  Cart: undefined; // Full-screen modal/screens (NO TABS) - These are the screens you mentioned

  Checkout: { cartId?: string };
  OrderTracking: { orderId: string };
  FoodDetails: { foodId: string; restaurantId: string };
  RestaurantDetails: { restaurantId: string };
  Notifications: undefined;
  Category: { categoryId: string };
  SearchScreen: {
    category?: string;
    categoryId?: string;
    type: 'search' | 'category';
  };
  // profile screens
  EditProfile: undefined;
  AddressScreen: undefined;
  AddAddress: { addressId?: string };
  PaymentMethods: undefined;
  AddPayment: { paymentId?: string };
  Settings: undefined;
  Help: NavigatorScreenParams<CustomerHelpCenterStackParamList>;
  About: undefined;
  FavoriteRestaurantScreen: undefined;
  LanguageScreen: undefined;
  NearbyRestaurants: undefined;
  OrderReceipt: { orderId: string };
};

// Auth Stack (unchanged)
export type AuthStackParamList = {
  SignIn: { userType?: 'customer' | 'restaurant' } | undefined;
  SignUp: { userType?: 'customer' | 'restaurant' } | undefined;
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
};


export type CustomerHelpCenterStackParamList = {
  FAQ: undefined;
  ContactUs: undefined;
};

// Restaurant types (unchanged)
export type RestaurantTabParamList = {
  Orders: NavigatorScreenParams<RestaurantOrdersStackParamList>;
  Menu: NavigatorScreenParams<RestaurantMenuStackParamList>;
  Analytics: NavigatorScreenParams<RestaurantAnalyticsStackParamList>;
  Profile: NavigatorScreenParams<RestaurantProfileStackParamList>;
};

export type RestaurantOrdersStackParamList = {
  OrdersScreen: undefined;
  OrderDetails: { orderId: string };
  OrderHistory: undefined;
  LiveOrders: undefined;
  RejectOrder: { id: string };
  ConfirmOrder: { id: string };
};

export type RestaurantMenuStackParamList = {
  MenuScreen: undefined;
  AddMenuItem: undefined;
  EditMenuItem: { itemId: string };
  Categories: undefined;
  AddCategory: undefined;
  EditCategory: { categoryId: string };
  MenuSettings: undefined;
  MenuList: undefined; // Add this for the menu list view
};

export type RestaurantAnalyticsStackParamList = {
  AnalyticsScreen: undefined;
  DashboardScreen: undefined;
  SalesReport: undefined;
  CustomerInsights: undefined;
  PopularItems: undefined;
  PerformanceMetrics: undefined;
};

export type RestaurantProfileStackParamList = {
  ProfileScreen: undefined;
  ProfileEditProfile: {
    userProfile?: {
      name: string;
      email: string;
      phone: string;
      restaurantName: string;
      address: string;
      bio?: string;
      website?: string;
      cuisine?: string;
    };
  };
  RestaurantSettings: undefined;
  AccountSettings: undefined;
  About: undefined;
  Notification: undefined;
  Support: undefined;
  BusinessSettings: undefined;
  PaymentBilling: undefined;
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

export type RestaurantProfileStackScreenProps<
  T extends keyof RestaurantProfileStackParamList,
> = CompositeScreenProps<
  NativeStackScreenProps<RestaurantProfileStackParamList, T>,
  RestaurantTabScreenProps<'Profile'>
>;

// User type enum
export type UserType = 'customer' | 'restaurant';

// Global navigation state
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
