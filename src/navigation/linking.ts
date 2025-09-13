import { LinkingOptions } from '@react-navigation/native';
import { RootStackParamList } from './types';

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['fooddeliveryapp://', 'https://foodrush.com'],
  config: {
    screens: {
      Auth: {
        screens: {
          SignIn: 'signin',
          SignUp: 'signup',
          ForgotPassword: 'forgot-password',
          ResetPassword: 'reset-password',
          OTPVerification: 'otp-verification',
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
              Category: 'category/:categoryId',
              MenuCategory: 'restaurant/:restaurantId/category/:categoryId',
              Notifications: 'notifications',
              Promotions: 'promotions',
              OrderSummary: 'order-receipt',
              SearchScreen: 'search',
              SearchResults: 'search/results',
              FilterScreen: 'search/filters',
              FilterOptions: 'search/filter-options',
            },
          },
          Orders: {
            screens: {
              CompletedOrdersScreen: 'orders/completed',
              PendingOrdersScreen: 'orders/pending',
              OrderDetails: 'order/:orderId',
            },
          },
          Profile: {
            screens: {
              ProfileHome: 'profile',
              EditProfile: 'profile/edit',
              AddressScreen: 'profile/addresses',
              PaymentMethods: 'profile/payments',
              AddPayment: 'profile/payment/add',
              Settings: 'profile/settings',
              Help: {
                screens: {
                  FAQ: 'profile/help/faq',
                  ContactUs: 'profile/help/contact',
                },
              },
              About: 'profile/about',
              FavoriteRestaurantScreen: 'profile/favorites',
              LanguageScreen: 'profile/language',
            },
          },
        },
      },
      RestaurantApp: {
        screens: {
          Orders: {
            screens: {
              OrdersScreen: 'restaurant/orders',
              OrderDetails: 'restaurant/order/:orderId',
              OrderHistory: 'restaurant/orders/history',
              LiveOrders: 'restaurant/orders/live',
            },
          },
          Menu: {
            screens: {
              MenuScreen: 'restaurant/menu',
              AddMenuItem: 'restaurant/menu/add',
              EditMenuItem: 'restaurant/menu/edit/:itemId',
              Categories: 'restaurant/menu/categories',
              AddCategory: 'restaurant/menu/category/add',
              EditCategory: 'restaurant/menu/category/edit/:categoryId',
              MenuSettings: 'restaurant/menu/settings',
            },
          },
          Analytics: {
            screens: {
              AnalyticsScreen: 'restaurant/analytics',
              SalesReport: 'restaurant/analytics/sales',
              CustomerInsights: 'restaurant/analytics/customers',
              PopularItems: 'restaurant/analytics/popular',
              PerformanceMetrics: 'restaurant/analytics/performance',
            },
          },
          Profile: {
            screens: {
              ProfileScreen: 'restaurant/profile',
              EditProfile: 'restaurant/profile/edit',
              RestaurantSettings: 'restaurant/profile/settings',
              BusinessHours: 'restaurant/profile/hours',
              DeliverySettings: 'restaurant/profile/delivery',
              Notifications: 'restaurant/profile/notifications',
              Help: 'restaurant/profile/help',
              BusinessSettings: 'restaurant/profile/business',
              PayoutSettings: 'restaurant/profile/payouts',
            },
          },
        },
      },
    },
  },
};
