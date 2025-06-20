import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
    Auth: undefined;
    Customer: undefined;
    RestaurantAuth: undefined;
    Restaurant: undefined;

}

export type AuthStackParamList = {
    Login: undefined,
    Signup: undefined,
    ForgotPassword: undefined,
    OTP: undefined,
    ResetPassword: { email?: string },

}

// we need to put parameters for foodDetails

export type CustomerStackParamList = {
    Search: undefined,
    Favorites: undefined,
    FoodDetails: undefined,
    // location logic will be implemented later, we should make sure everything can work first like ordering food using dummy data
    OrderHistory: undefined,
    Tabs: TabCustomerParamList
    // TODO: ADD MORE PAGES
}
// Reststaurant Stack Param List
export type TabRestaurantStackParamList = {
   Dashboard: undefined,
    Orders: undefined,
    Menu: undefined,
    Profile: undefined,
}
export type RestaurantStackParamList = {
    RestaurantTabs: TabRestaurantStackParamList,
    FoodDetails: undefined,
    AddFood: undefined,
    EditFood: { foodId: string },
    OrderDetails: { orderId: string },
    OrderHistory: undefined,
    Notifications: undefined,
}

// Restaurant Auth Stack Param List
export type RestaurantAuthStackParamList = {
     LoginRestaurant: undefined,
    RegisterRestaurant: undefined,
    ForgotPasswordRestaurant: { email?: string },
    OTPRestaurant: undefined,
    ResetPasswordRestaurant: { email?: string },

}

export type TabCustomerParamList = {
    Home: undefined,
    Cart: undefined,
    Notifcation: undefined,
    Profile: undefined, 
}

// Helper types for screen props
export type RootStackScreenProps<T extends keyof RootStackParamList> = 
  NativeStackScreenProps<RootStackParamList, T>;

export type AuthStackScreenProps<T extends keyof AuthStackParamList> = 
  NativeStackScreenProps<AuthStackParamList, T>;

export type CustomerStackScreenProps<T extends keyof CustomerStackParamList> = 
  NativeStackScreenProps<CustomerStackParamList, T>;

export type RestaurantAuthStackProps<T extends keyof RestaurantAuthStackParamList> = 
  NativeStackScreenProps<RestaurantAuthStackParamList, T>;

export type RestaurantStackScreenProps<T extends keyof RestaurantStackParamList> =
  NativeStackScreenProps<RestaurantStackParamList, T>;
// Global navigation type augmentation
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}