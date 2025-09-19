import { LinkingOptions } from '@react-navigation/native';
import { RootStackParamList } from './types';

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['fooddeliveryapp://', 'https://foodrush.com'],
  config: {
    screens: {
      // Core app flow screens
      Onboarding: {
        path: 'onboarding/:step?',
        parse: {
          step: (step: string) => parseInt(step, 10) || 1,
        },
        stringify: {
          step: (step?: number) => step?.toString() || '1',
        },
      },
      UserTypeSelection: {
        path: 'user-type-selection',
        exact: true,
      },
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
              OrdersList: 'restaurant/orders',
            },
          },
          Menu: {
            screens: {
              MenuItemsList: 'restaurant/menu',
            },
          },
          Analytics: {
            screens: {
              AnalyticsOverview: 'restaurant/analytics',
            },
          },
          Notifications: {
            screens: {
              NotificationsList: 'restaurant/notifications',
            },
          },
          Account: {
            screens: {
              AccountHome: 'restaurant/account',
            },
          },
        },
      },
      // Restaurant full-screen screens (RootStack)
      RestaurantOrderDetails: 'restaurant/order/:orderId',
      RestaurantBestSellers: 'restaurant/analytics/bestsellers',
      RestaurantTimeHeatmap: 'restaurant/analytics/heatmap',
      RestaurantMenuItemForm: 'restaurant/menu/item',

      RestaurantProfile: 'restaurant/profile',
      RestaurantSettings: 'restaurant/settings',
      RestaurantSupport: 'restaurant/support',
      RestaurantAbout: 'restaurant/about',
    },
  },
};
