// Root Stack

import { NavigatorScreenParams } from "@react-navigation/native";
import {StackScreenProps} from '@react-navigation/stack'
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
export type RootStackParamList = {
    Auth: undefined;
    CustomerApp: undefined;
    RestaurantApp: undefined;
}


export type AuthStackParamList = {

    SignIn: { userType: 'customer' | 'restaurant' };
    SignUp: { userType: 'customer' | 'restaurant' };
    ForgotPassword: undefined;
    OTPVerification: undefined // left undefined for the moment
    ResetPassword: { token: string };
}

// Customer Tab Navigator

export type CustomerTabParamList = {
    Home: NavigatorScreenParams<CustomerHomeStackParamList>;
    Orders: NavigatorScreenParams<CustomerOrderStackParamList>;
    Search: NavigatorScreenParams<CustomerSearchStackParamList>;
    Profile: NavigatorScreenParams<CustomerProfileStackParamList>;
}

// Customer App screens 

export type CustomerHomeStackParamList = {
    HomeScreen: undefined;
    FoodDetails: { foodID: string, categoryID: string };
    RestaurantDetails: { restaurantID: string };
    MenuCategory: { categoryID: string, restaurantId: string };
    Notifications: undefined;
    Promotions: undefined;
}
export type CustomerSearchStackParamList = {
    SearchScreen: undefined;
    FilterOptions: undefined;
    SearchResult: undefined;

}
export type CustomerOrderStackParamList = {
    OrderScreen: undefined
    FoodDetails: { foodID: string, categoryID: string };
    ReviewFood: {foodId: string, restaurantID: string};



}

export type CustomerProfileStackParamList = {
    FavoriteRestaurantScreen: undefined;
    ProfileScreen: undefined;
    AdressScreen: undefined;
    LanguageScreen: undefined;
    ProfileHome: undefined

}

export type RestaurantTabParamList = {
    Orders: undefined;
    Menu: undefined;
    Analytics: undefined;
    Profile: undefined;
}
 // TODO: DEVELOPER WORKING ON RESTAURANT PAGES
 export type RestaurantOrdersStackParamList = {
  OrdersScreen: undefined;
  OrderDetails: { orderId: string };
  OrderHistory: undefined;
};

export type RestaurantMenuStackParamList = {
  MenuScreen: undefined;
  AddMenuItem: undefined;
  EditMenuItem: { itemId: string };
  Categories: undefined;
  AddCategory: undefined;
  EditCategory: { categoryId: string };
};

export type RestaurantAnalyticsStackParamList = {
  AnalyticsScreen: undefined;
  SalesReport: undefined;
  CustomerInsights: undefined;
  PopularItems: undefined;
};

export type RestaurantProfileStackParamList = {
  ProfileScreen: undefined;
  EditProfile: undefined;
  RestaurantSettings: undefined;
  BusinessHours: undefined;
  DeliverySettings: undefined;
  Notifications: undefined;
  Help: undefined;
};

// Navigation Prop Types

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  StackScreenProps<RootStackParamList, T>;

export type CustomerTabScreenProps<T extends keyof CustomerTabParamList> =
  BottomTabScreenProps<CustomerTabParamList, T>;

export type RestaurantTabScreenProps<T extends keyof RestaurantTabParamList> =
  BottomTabScreenProps<RestaurantTabParamList, T>;