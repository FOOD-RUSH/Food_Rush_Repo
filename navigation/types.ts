
export type RootStackParamList = {
  Auth: undefined;
  CustomerApp: undefined;
  RestaurantApp: undefined;


}

// Auth Stack Navigator types
export type AuthStackParamList = {
  Login: { userType: 'customer' | 'restaurant' };
  Register: { userType: 'customer' | 'restaurant' };
  ForgotPassword: undefined;
  ResetPassword: { token: string };
  OTPScreen: { phoneNumber: string };
};
// customer Tab Navigator types
export type CustomerTabsParamList = {
  Home: undefined;
  Search: undefined;
  Cart: undefined;
  Profile: undefined;
}

//  Customer Stack Navigator types
export type CustomerHomeStackParamList = {
  HomeScreen: undefined;
  FoodDetails: undefined;
  // TODO: ADD MORE PAGES

}

export type CustomerSearchParamList = {
  SearchScreen: undefined;
  SearchResults: { query: string };
  FilterOptions: undefined;
}

export type CustomerCartStackParamList = {
  CartScreen: undefined;
  Checkout: undefined;
  PaymentMethods: undefined;
  AddPaymentMethod: undefined;
  DeliveryAddress: undefined;
  AddAddress: undefined;
  OrderConfirmation: { orderId: string };
};

export type CustomerProfileStackParamList = {
  ProfileScreen: undefined;
  EditProfile: undefined;
  OrderHistory: undefined;
  OrderDetails: { orderId: string };
  Addresses: undefined;
  AddAddress: undefined;
  PaymentMethods: undefined;
  Settings: undefined;
  Help: undefined;
  Favorites: undefined;
};

// Restaurant Tab Navigator Types
export type RestaurantTabParamList = {
  Orders: undefined;
  Menu: undefined;
  Analytics: undefined;
  Profile: undefined;
};

// Restaurant Stack Navigator Types
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