import { LinkingOptions } from "@react-navigation/native";
import { RootStackParamList } from "@/navigation/types";

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['fooddeliveryapp://', 'https://foodRush.com'],
  config: {
    screens: {
      Auth: {
        screens: {
          SignIn: 'signin',
          SignUp: 'signup',
          ForgotPassword: 'forgot-password',
          ResetPassword: 'reset-Password'
        },
      },
      CustomerApp: {
        screens: {
          Home: {
            screens: {
              HomeScreen: 'home',
              RestaurantDetails: 'restaurant/:restaurantId',
              FoodDetails: 'food/:foodId/restaurant/:restaurantId',
              Cart: 'cart',
              Checkout: 'checkout',
              OrderTracking: 'order/:orderId/track',
              Category: 'category'
            },
          },
          Search: {
            screens: {
              SearchScreen: 'search',
              SearchResults: 'search/results',
              FilterScreen: 'search/filters',
            },
          },
          Orders: {
            screens: {
              CompletedOrderScreen: 'orders/completedOrders',
              PendingOrderScreen: 'orders/pendingOrders'
            },
          },
          Profile: {
            screens: {
              ProfileScreen: 'profile',
              EditProfile: 'profile/edit',
              AddressBook: 'profile/addresses',
              AddAddress: 'profile/address/add',
              PaymentMethods: 'profile/payments',
              AddPayment: 'profile/payment/add',
              Settings: 'profile/settings',
              Help: 'profile/help',
              About: 'profile/about',
            },
          },
        },
      },
      RestaurantApp: {
        screens: {
          Dashboard: {
            screens: {
              DashboardScreen: 'restaurant/dashboard',
              LiveOrders: 'restaurant/orders/live',
              QuickStats: 'restaurant/stats',
            },
          },
          Orders: {
            screens: {
              OrdersScreen: 'restaurant/orders',
              OrderDetails: 'restaurant/order/:orderId',
              OrderHistory: 'restaurant/orders/history',
            },
          },
          Menu: {
            screens: {
              MenuScreen: 'restaurant/menu',
              AddMenuItem: 'restaurant/menu/add',
              EditMenuItem: 'restaurant/menu/edit/:itemId',
              Categories: 'restaurant/menu/categories',
              AddCategory: 'restaurant/menu/category/add',
              MenuSettings: 'restaurant/menu/settings',
            },
          },
          Analytics: {
            screens: {
              AnalyticsScreen: 'restaurant/analytics',
              SalesReport: 'restaurant/analytics/sales',
              CustomerInsights: 'restaurant/analytics/customers',
              PerformanceMetrics: 'restaurant/analytics/performance',
            },
          },
          Profile: {
            screens: {
              ProfileScreen: 'restaurant/profile',
              EditProfile: 'restaurant/profile/edit',
              BusinessSettings: 'restaurant/profile/business',
              PayoutSettings: 'restaurant/profile/payouts',
              Help: 'restaurant/profile/help',
            },
          },
        },
      },
    },
  },
};
