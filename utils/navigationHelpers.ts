

export const navigationHelpers = {
    // Auth Navigation 
    navigateToLogin: (navigation: any, userType: 'customer' | 'restaurant') => {
        navigation.navigate('Login', { userType });
    },

    navigateToRegister: (navigation: any, userType: 'customer' | 'restaurant') => {
        navigation.navigate('Register', { userType });
    },
    navigateToForgotPassword: (navigation: any) => {
        navigation.navigate('ForgotPassword');
    },
    navigateToResetPassword: (navigation: any, token: string) => {
        navigation.navigate('ResetPassword', { token });
    },  
    navigateToOTP: (navigation: any, phoneNumber: string) => {
        navigation.navigate('OTPScreen', { phoneNumber });
    },
    // Customer Navigation
    navigateToCustomerApp : (navigation: any) => {
        navigation.navigate('CustomerTabs');
    },

    navigateToRestaurantDetails: (navigation: any, restaurantId: string) => {
    navigation.navigate('RestaurantDetails', { restaurantId });
  },

  navigateToItemDetails: (navigation: any, itemId: string, restaurantId: string) => {
    navigation.navigate('ItemDetails', { itemId, restaurantId });
  },

  navigateToCheckout: (navigation: any) => {
    navigation.navigate('Checkout');
  },

  navigateToOrderTracking: (navigation: any, orderId: string) => {
    navigation.navigate('OrderTracking', { orderId });
  },

  navigateToSearchResults: (navigation: any, query: string) => {
    navigation.navigate('SearchResults', { query });
  },

  navigateToOrderHistory: (navigation: any) => {
    navigation.navigate('OrderHistory');
  },

  navigateToOrderDetails: (navigation: any, orderId: string) => {
    navigation.navigate('OrderDetails', { orderId });
  },

  // Restaurant Navigation Helpers
  navigateToRestaurantOrderDetails: (navigation: any, orderId: string) => {
    navigation.navigate('OrderDetails', { orderId });
  },

  navigateToAddMenuItem: (navigation: any) => {
    navigation.navigate('AddMenuItem');
  },

  navigateToEditMenuItem: (navigation: any, itemId: string) => {
    navigation.navigate('EditMenuItem', { itemId });
  },

  navigateToSalesReport: (navigation: any) => {
    navigation.navigate('SalesReport');
  },

  navigateToBusinessHours: (navigation: any) => {
    navigation.navigate('BusinessHours');
  },

  // Common Navigation Helpers
  goBack: (navigation: any) => {
    navigation.goBack();
  },

  resetToScreen: (navigation: any, screenName: string) => {
    navigation.reset({
      index: 0,
      routes: [{ name: screenName }],
    });
  },

}